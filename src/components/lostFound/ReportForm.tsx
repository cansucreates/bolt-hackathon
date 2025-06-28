import React, { useState, useRef } from 'react';
import { Upload, MapPin, User, Mail, Phone, Camera, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { PetReportData } from '../../types/lostFound';
import { uploadPetImage, submitPetReport } from '../../lib/lostFoundService';
import { useAuth } from '../../contexts/AuthContext';

interface ReportFormProps {
  type: 'lost' | 'found';
  onSuccess: () => void;
  onCancel: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ type, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<PetReportData>({
    type,
    pet_name: '',
    description: '',
    photo_url: '',
    location: '',
    contact_info: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
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
    }

    if (!imageFile && !formData.photo_url) {
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
    
    if (!user) {
      setMessage({ type: 'error', text: 'You must be logged in to submit a report' });
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      let photoUrl = formData.photo_url;

      // Upload image if a new file is selected
      if (imageFile) {
        setIsUploading(true);
        const uploadResult = await uploadPetImage(imageFile);
        setIsUploading(false);

        if (uploadResult.error) {
          setMessage({ type: 'error', text: uploadResult.error });
          setIsSubmitting(false);
          return;
        }

        photoUrl = uploadResult.url;
      }

      // Submit report
      const result = await submitPetReport({
        ...formData,
        photo_url: photoUrl
      });

      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Report submitted successfully! 🏡 Helping this pet get back home.' });
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-pink/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Report {type === 'lost' ? 'Lost' : 'Found'} Pet
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-kawaii transition-colors duration-200"
        >
          <X size={24} className="text-gray-600" />
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
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
              <p className="text-red-600 text-sm mt-1">{errors.pet_name}</p>
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
                className="w-full h-64 object-cover rounded-kawaii border-2 border-kawaii-pink/30"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-2 bg-red-100 hover:bg-red-200 rounded-full transition-colors duration-200"
              >
                <X size={16} className="text-red-600" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-kawaii-pink rounded-kawaii p-8 text-center bg-kawaii-pink/10 hover:bg-kawaii-pink/20 transition-colors duration-300 cursor-pointer"
            >
              <Camera size={48} className="text-kawaii-pink-dark mx-auto mb-4" />
              <p className="text-gray-700 font-quicksand font-semibold mb-2">
                Click to upload pet photo
              </p>
              <p className="text-sm text-gray-600">
                JPG, PNG, WEBP (max 5MB)
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
          
          {errors.image && (
            <p className="text-red-600 text-sm mt-1">{errors.image}</p>
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
            <p className="text-red-600 text-sm mt-1">{errors.location}</p>
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
            className={`kawaii-input w-full h-32 resize-none ${errors.description ? 'border-red-300' : ''}`}
            placeholder={`Describe the pet's appearance, behavior, and any other relevant details...`}
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.description ? (
              <p className="text-red-600 text-sm">{errors.description}</p>
            ) : (
              <p className="text-gray-500 text-sm">Minimum 10 characters</p>
            )}
            <p className="text-gray-500 text-sm">{formData.description.length}/500</p>
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
            <p className="text-red-600 text-sm mt-1">{errors.contact_info}</p>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-6 border border-gray-300 rounded-kawaii text-gray-700 font-bold hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className={`flex-1 py-3 px-6 rounded-kawaii font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-md ${
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