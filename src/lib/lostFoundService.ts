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
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      console.error('File too large:', file.size);
      return { url: '', error: 'Image size must be less than 10MB' };
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

    // Check if bucket exists and is accessible
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    if (bucketsError) {
      console.error('Error checking storage buckets:', bucketsError);
      return { url: '', error: 'Storage service unavailable. Please try again later.' };
    }
    
    const petImagesBucket = buckets.find(bucket => bucket.id === 'pet-images');
    if (!petImagesBucket) {
      console.error('Pet images bucket not found');
      return { url: '', error: 'Storage bucket not configured. Please contact support.' };
    }

    console.log('Storage bucket verified, proceeding with upload...');

    // Upload to Supabase Storage with retry logic
    let uploadAttempts = 0;
    const maxAttempts = 3;
    let uploadError: any = null;
    let uploadData: any = null;

    while (uploadAttempts < maxAttempts) {
      try {
        uploadAttempts++;
        console.log(`Upload attempt ${uploadAttempts}/${maxAttempts}`);

        const { data, error } = await supabase.storage
          .from('pet-images')
          .upload(filePath, compressedFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: 'image/jpeg'
          });

        if (error) {
          uploadError = error;
          console.error(`Upload attempt ${uploadAttempts} failed:`, error);
          
          // If it's a duplicate file error, try with a new filename
          if (error.message?.includes('duplicate') || error.message?.includes('already exists')) {
            const newFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-retry.${fileExt}`;
            filePath = `${user.id}/${newFileName}`;
            console.log('Retrying with new filename:', filePath);
            continue;
          }
          
          // For other errors, wait a bit before retrying
          if (uploadAttempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000 * uploadAttempts));
            continue;
          }
        } else {
          uploadData = data;
          uploadError = null;
          break;
        }
      } catch (error) {
        uploadError = error;
        console.error(`Upload attempt ${uploadAttempts} threw error:`, error);
        
        if (uploadAttempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000 * uploadAttempts));
        }
      }
    }

    if (uploadError || !uploadData) {
      console.error('All upload attempts failed:', uploadError);
      return { 
        url: '', 
        error: `Failed to upload image after ${maxAttempts} attempts: ${uploadError?.message || 'Unknown error'}` 
      };
    }

    console.log('Upload successful:', uploadData);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('pet-images')
      .getPublicUrl(uploadData.path);

    console.log('Public URL generated:', publicUrl);

    // Verify the uploaded file is accessible
    try {
      const response = await fetch(publicUrl, { method: 'HEAD' });
      if (!response.ok) {
        console.error('Uploaded file not accessible:', response.status, response.statusText);
        return { url: '', error: 'Image uploaded but not accessible. Please try again.' };
      }
    } catch (error) {
      console.error('Error verifying uploaded file:', error);
      // Don't fail here, the file might still be accessible
    }

    return { url: publicUrl };
  } catch (error) {
    console.error('Image upload error:', error);
    return { 
      url: '', 
      error: `Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};

// Submit new pet report
export const submitPetReport = async (data: PetReportData): Promise<{ data?: PetReport; error?: string }> => {
  try {
    console.log('Starting pet report submission...');
    console.log('Report data:', data);
    
    // Validate required fields
    if (!data.description || !data.location || !data.contact_info || !data.photo_url) {
      console.error('Missing required fields:', {
        description: !!data.description,
        location: !!data.location,
        contact_info: !!data.contact_info,
        photo_url: !!data.photo_url
      });
      return { error: 'Please fill in all required fields including photo, description, location, and contact information.' };
    }
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('User not authenticated:', userError);
      return { error: 'You must be logged in to submit a report' };
    }

    console.log('User authenticated for submission:', user.id);

    // Prepare report data with proper field mapping
    const reportData = {
      user_id: user.id,
      type: data.type,
      pet_name: data.pet_name || null, // This can be null for found pets
      description: data.description.trim(),
      photo_url: data.photo_url,
      location: data.location.trim(),
      contact_info: data.contact_info.trim(),
      status: 'active' as const,
      date_reported: new Date().toISOString()
    };

    console.log('Submitting to database:', reportData);

    // Test database connection first
    const { data: testData, error: testError } = await supabase
      .from('lost_found_pets')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('Database connection test failed:', testError);
      return { error: 'Database connection failed. Please try again.' };
    }

    console.log('Database connection test passed');

    // Submit the report
    const { data: report, error } = await supabase
      .from('lost_found_pets')
      .insert([reportData])
      .select()
      .single();

    if (error) {
      console.error('Database submission error:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      // Provide more specific error messages
      if (error.code === '23505') {
        return { error: 'A report with this information already exists.' };
      } else if (error.code === '23502') {
        return { error: 'Missing required information. Please fill in all required fields.' };
      } else if (error.code === '42501') {
        return { error: 'Permission denied. Please make sure you are logged in.' };
      } else if (error.code === '23503') {
        return { error: 'Invalid user reference. Please try logging out and back in.' };
      } else {
        return { error: `Database error: ${error.message}` };
      }
    }

    console.log('Report submitted successfully:', report);
    return { data: report };
  } catch (error) {
    console.error('Unexpected submission error:', error);
    return { error: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}` };
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