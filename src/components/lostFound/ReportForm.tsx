import React, { useState, useRef } from 'react';
import { Upload, MapPin, User, Mail, Phone, Camera, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { PetReportData } from '../../types/lostFound';
import { uploadPetImage, submitPetReport } from '../../lib/lostFoundService';
import { useAuth } from '../../contexts/AuthContext';

interface ReportFormProps {
  type: 'lost' | 'found';
  onSuccess: () => void;
  onCancel: () => void;
  initialImageData?: string; // Add support for pre-uploaded images
}

const ReportForm: React.FC<ReportFormProps> = ({ type, onSuccess, onCancel, initialImageData }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<PetReportData>({
    type,
    pet_name: '',
    description: '',
    photo_url: '', // Start with empty photo_url
    location: '',
    contact_info: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialImageData || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof PetReportData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please select a valid image file (JPG, PNG, WEBP)' }));
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size must be less than 10MB' }));
      return;
    }

    setImageFile(file);
    setErrors(prev => ({ ...prev, image: '' }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, photo_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.contact_info.trim()) {
      newErrors.contact_info = 'Contact information is required';
    } else {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      
      if (!emailRegex.test(formData.contact_info) && !phoneRegex.test(formData.contact_info.replace(/[\s\-\(\)]/g, ''))) {
        newErrors.contact_info = 'Please enter a valid email address or phone number';
      }
    }

    // Check if we have either a new image file or initial image data
    if (!imageFile && !initialImageData && !imagePreview) {
      newErrors.image = 'Photo is required';
    }

    if (type === 'lost' && !formData.pet_name?.trim()) {
      newErrors.pet_name = 'Pet name is required for lost pets';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started');
    console.log('User authenticated:', !!user);
    console.log('Form data:', formData);
    console.log('Image file:', imageFile);
    console.log('Initial image data exists:', !!initialImageData);
    console.log('Image preview exists:', !!imagePreview);
    
    if (!user) {
      setMessage({ type: 'error', text: 'You must be logged in to submit a report' });
      return;
    }

    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the errors above before submitting' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      let photoUrl = '';

      // Handle image upload - prioritize new file over initial data
      if (imageFile) {
        console.log('Uploading new image file...');
        setIsUploading(true);
        setUploadProgress(0);
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        const uploadResult = await uploadPetImage(imageFile);
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        setIsUploading(false);

        if (uploadResult.error) {
          console.error('Image upload failed:', uploadResult.error);
          setMessage({ type: 'error', text: uploadResult.error });
          setIsSubmitting(false);
          return;
        }

        photoUrl = uploadResult.url;
        console.log('Image uploaded successfully:', photoUrl);
      } else if (initialImageData) {
        console.log('Using initial image data, need to upload it first...');
        
        // Convert base64 to blob and upload
        try {
          setIsUploading(true);
          setUploadProgress(0);
          
          // Start progress animation
          const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
              if (prev >= 90) {
                clearInterval(progressInterval);
                return 90;
              }
              return prev + 10;
            });
          }, 200);

          // Convert base64 to blob
          const response = await fetch(initialImageData);
          const blob = await response.blob();
          const file = new File([blob], 'transferred-image.jpg', { type: 'image/jpeg' });
          
          console.log('Converted base64 to file:', { name: file.name, size: file.size, type: file.type });

          const uploadResult = await uploadPetImage(file);
          
          clearInterval(progressInterval);
          setUploadProgress(100);
          setIsUploading(false);

          if (uploadResult.error) {
            console.error('Initial image upload failed:', uploadResult.error);
            setMessage({ type: 'error', text: `Upload failed: ${uploadResult.error}` });
            setIsSubmitting(false);
            return;
          }

          photoUrl = uploadResult.url;
          console.log('Initial image uploaded successfully:', photoUrl);
        } catch (error) {
          console.error('Error processing initial image:', error);
          setMessage({ type: 'error', text: 'Failed to process the uploaded image. Please try uploading again.' });
          setIsSubmitting(false);
          setIsUploading(false);
          return;
        }
      }

      // Validate that we have a photo URL
      if (!photoUrl) {
        setMessage({ type: 'error', text: 'Photo is required. Please upload an image.' });
        setIsSubmitting(false);
        return;
      }

      // Submit report
      console.log('Submitting pet report...');
      const reportData = {
        ...formData,
        photo_url: photoUrl
      };
      
      console.log('Report data being submitted:', reportData);
      
      const result = await submitPetReport(reportData);

      if (result.error) {
        console.error('Report submission failed:', result.error);
        setMessage({ type: 'error', text: result.error });
      } else {
        console.log('Report submitted successfully:', result.data);
        setMessage({ 
          type: 'success', 
          text: `${type === 'lost' ? 'Lost' : 'Found'} pet report submitted successfully! 🏡 Helping this pet get back home.` 
        });
        
        // Clear form
        setFormData({
          type,
          pet_name: '',
          description: '',
          photo_url: '',
          location: '',
          contact_info: ''
        });
        setImageFile(null);
        setImagePreview('');
        
        // Clear transferred image from sessionStorage
        sessionStorage.removeItem('transferredPetImage');
        sessionStorage.removeItem('transferredPetImageTimestamp');
        
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (error) {
      console.error('Unexpected submission error:', error);
      setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-pink/30 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Report {type === 'lost' ? 'Lost' : 'Found'} Pet
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-kawaii transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close form"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mb-6 p-4 rounded-kawaii flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle size={20} className="flex-shrink-0" />
          ) : (
            <AlertTriangle size={20} className="flex-shrink-0" />
          )}
          <span className="text-sm sm:text-base">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Pet Name (required for lost pets) */}
        {type === 'lost' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pet Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                value={formData.pet_name || ''}
                onChange={(e) => handleInputChange('pet_name', e.target.value)}
                className={`kawaii-input pl-12 w-full ${errors.pet_name ? 'border-red-300' : ''}`}
                placeholder="Enter your pet's name"
              />
            </div>
            {errors.pet_name && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <AlertTriangle size={12} />
                {errors.pet_name}
              </p>
            )}
          </div>
        )}

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pet Photo *
          </label>
          
          {imagePreview ? (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Pet preview"
                className="w-full h-48 sm:h-64 object-contain rounded-kawaii border-2 border-kawaii-pink/30 bg-gray-50"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-2 bg-red-100 hover:bg-red-200 rounded-full transition-colors duration-200 min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label="Remove image"
              >
                <X size={16} className="text-red-600" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-kawaii-pink rounded-kawaii p-6 sm:p-8 text-center bg-kawaii-pink/10 hover:bg-kawaii-pink/20 transition-colors duration-300 cursor-pointer"
            >
              <Camera size={32} className="text-kawaii-pink-dark mx-auto mb-4 sm:w-12 sm:h-12" />
              <p className="text-gray-700 font-quicksand font-semibold mb-2 text-sm sm:text-base">
                Click to upload pet photo
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                JPG, PNG, WEBP (max 10MB)
              </p>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          
          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Uploading...</span>
                <span className="text-sm text-gray-600">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-kawaii-blue-dark h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
          
          {errors.image && (
            <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
              <AlertTriangle size={12} />
              {errors.image}
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Location *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={`kawaii-input pl-12 w-full ${errors.location ? 'border-red-300' : ''}`}
              placeholder="Where was the pet lost/found? (e.g., Central Park, NYC)"
            />
          </div>
          {errors.location && (
            <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
              <AlertTriangle size={12} />
              {errors.location}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className={`kawaii-input w-full h-24 sm:h-32 resize-none ${errors.description ? 'border-red-300' : ''}`}
            placeholder={`Describe the pet's appearance, behavior, and any other relevant details...`}
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.description ? (
              <p className="text-red-600 text-xs">{errors.description}</p>
            ) : (
              <p className="text-gray-500 text-xs">Minimum 10 characters</p>
            )}
            <p className="text-gray-500 text-xs">{formData.description.length}/500</p>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Contact Information *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              value={formData.contact_info}
              onChange={(e) => handleInputChange('contact_info', e.target.value)}
              className={`kawaii-input pl-12 w-full ${errors.contact_info ? 'border-red-300' : ''}`}
              placeholder="Email or phone number for contact"
            />
          </div>
          {errors.contact_info && (
            <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
              <AlertTriangle size={12} />
              {errors.contact_info}
            </p>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-6 border border-gray-300 rounded-kawaii text-gray-700 font-bold hover:bg-gray-50 transition-colors duration-200 min-h-[48px]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className={`flex-1 py-3 px-6 rounded-kawaii font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-md min-h-[48px] ${
              type === 'lost'
                ? 'bg-kawaii-coral hover:bg-kawaii-coral/80 text-gray-700'
                : 'bg-kawaii-green hover:bg-kawaii-green-dark text-gray-700'
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            {isUploading ? (
              <>
                <Upload size={18} className="animate-spin" />
                Uploading...
              </>
            ) : isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                Submit Report
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;