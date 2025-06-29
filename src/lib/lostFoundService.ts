import { supabase } from './supabase';
import { PetReport, PetReportData, ReportFilters, ImageUploadResult } from '../types/lostFound';

// Image compression utility
const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }
    
    img.onload = () => {
      try {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        }, 'image/jpeg', quality);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Upload image to Supabase Storage
export const uploadPetImage = async (file: File): Promise<ImageUploadResult> => {
  try {
    console.log('Starting image upload process...');
    console.log('File details:', { name: file.name, size: file.size, type: file.type });
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type:', file.type);
      return { url: '', error: 'Please select a valid image file (JPG, PNG, WEBP)' };
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      console.error('File too large:', file.size);
      return { url: '', error: 'Image size must be less than 5MB' };
    }

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('User authentication error:', userError);
      return { url: '', error: 'You must be logged in to upload images' };
    }

    console.log('User authenticated:', user.id);

    // Compress image
    console.log('Compressing image...');
    const compressedBlob = await compressImage(file);
    const compressedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' });
    console.log('Image compressed. Original size:', file.size, 'Compressed size:', compressedFile.size);

    // Generate unique filename with user folder
    const fileExt = 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    console.log('Uploading to path:', filePath);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('pet-images')
      .upload(filePath, compressedFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      return { url: '', error: 'Failed to upload image. Please try again.' };
    }

    console.log('Upload successful:', data);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('pet-images')
      .getPublicUrl(data.path);

    console.log('Public URL generated:', publicUrl);

    return { url: publicUrl };
  } catch (error) {
    console.error('Image upload error:', error);
    return { url: '', error: 'Failed to upload image. Please try again.' };
  }
};

// Submit new pet report
export const submitPetReport = async (data: PetReportData): Promise<{ data?: PetReport; error?: string }> => {
  try {
    console.log('Starting pet report submission...');
    console.log('Report data:', data);
    
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      console.error('User not authenticated');
      return { error: 'You must be logged in to submit a report' };
    }

    console.log('User authenticated for submission:', user.user.id);

    // Prepare report data
    const reportData = {
      user_id: user.user.id,
      type: data.type,
      pet_name: data.pet_name || null,
      description: data.description,
      photo_url: data.photo_url,
      location: data.location,
      contact_info: data.contact_info,
      status: 'active' as const
    };

    console.log('Submitting to database:', reportData);

    const { data: report, error } = await supabase
      .from('lost_found_pets')
      .insert([reportData])
      .select()
      .single();

    if (error) {
      console.error('Database submission error:', error);
      
      // Provide more specific error messages
      if (error.code === '23505') {
        return { error: 'A report with this information already exists.' };
      } else if (error.code === '23502') {
        return { error: 'Missing required information. Please fill in all required fields.' };
      } else if (error.code === '42501') {
        return { error: 'Permission denied. Please make sure you are logged in.' };
      } else {
        return { error: `Database error: ${error.message}` };
      }
    }

    console.log('Report submitted successfully:', report);
    return { data: report };
  } catch (error) {
    console.error('Unexpected submission error:', error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
};

// Fetch pet reports with filters
export const fetchPetReports = async (filters: ReportFilters = {}): Promise<{ data?: PetReport[]; error?: string }> => {
  try {
    console.log('Fetching pet reports with filters:', filters);
    
    let query = supabase
      .from('lost_found_pets')
      .select('*')
      .order('date_reported', { ascending: false });

    // Apply filters
    if (filters.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }

    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters.searchQuery) {
      query = query.or(`description.ilike.%${filters.searchQuery}%,pet_name.ilike.%${filters.searchQuery}%,location.ilike.%${filters.searchQuery}%`);
    }

    if (filters.dateRange) {
      query = query
        .gte('date_reported', filters.dateRange.start)
        .lte('date_reported', filters.dateRange.end);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Fetch reports error:', error);
      return { error: 'Failed to fetch reports. Please try again.' };
    }

    console.log('Reports fetched successfully:', data?.length || 0);
    return { data: data || [] };
  } catch (error) {
    console.error('Unexpected fetch error:', error);
    return { error: 'Failed to fetch reports. Please try again.' };
  }
};

// Update pet report
export const updatePetReport = async (id: string, data: Partial<PetReportData>): Promise<{ data?: PetReport; error?: string }> => {
  try {
    console.log('Updating pet report:', id, data);
    
    const { data: report, error } = await supabase
      .from('lost_found_pets')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update report error:', error);
      return { error: 'Failed to update report. Please try again.' };
    }

    console.log('Report updated successfully:', report);
    return { data: report };
  } catch (error) {
    console.error('Unexpected update error:', error);
    return { error: 'Failed to update report. Please try again.' };
  }
};

// Delete pet report
export const deletePetReport = async (id: string): Promise<{ error?: string }> => {
  try {
    console.log('Deleting pet report:', id);
    
    const { error } = await supabase
      .from('lost_found_pets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete report error:', error);
      return { error: 'Failed to delete report. Please try again.' };
    }

    console.log('Report deleted successfully');
    return {};
  } catch (error) {
    console.error('Unexpected delete error:', error);
    return { error: 'Failed to delete report. Please try again.' };
  }
};

// Mark report as resolved
export const markReportResolved = async (id: string): Promise<{ error?: string }> => {
  try {
    console.log('Marking report as resolved:', id);
    
    const { error } = await supabase
      .from('lost_found_pets')
      .update({ status: 'resolved' })
      .eq('id', id);

    if (error) {
      console.error('Mark resolved error:', error);
      return { error: 'Failed to mark report as resolved. Please try again.' };
    }

    console.log('Report marked as resolved successfully');
    return {};
  } catch (error) {
    console.error('Unexpected mark resolved error:', error);
    return { error: 'Failed to mark report as resolved. Please try again.' };
  }
};