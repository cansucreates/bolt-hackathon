import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, User, Mail, Phone, MapPin, MessageCircle, CheckCircle, AlertTriangle, Heart } from 'lucide-react';
import { AdoptableAnimal, AdoptionApplication } from '../../types/adoption';
import { submitAdoptionApplication } from '../../lib/adoptionService';
import { useAuth } from '../../contexts/AuthContext';

interface AdoptionFormProps {
  animal: AdoptableAnimal;
  onClose: () => void;
  onSuccess: () => void;
}

const AdoptionForm: React.FC<AdoptionFormProps> = ({ animal, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<AdoptionApplication>({
    defaultValues: {
      pet_id: animal.id,
      full_name: '',
      email: user?.email || '',
      phone: '',
      address: '',
      reason: '',
      has_experience: false,
      agrees_to_terms: false,
      pet_name: animal.name,
      pet_photo: animal.photo
    }
  });

  const watchAgreeToTerms = watch('agrees_to_terms');

  const onSubmit = async (data: AdoptionApplication) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await submitAdoptionApplication(data);
      
      if (result.success) {
        setMessage({
          type: 'success',
          text: `Thanks for applying to adopt ${animal.name}! We'll contact you shortly.`
        });
        
        // After a short delay, close the form and notify parent component
        setTimeout(() => {
          onSuccess();
        }, 3000);
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Failed to submit application. Please try again.'
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting adoption application:', error);
      setMessage({
        type: 'error',
        text: 'An unexpected error occurred. Please try again.'
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-kawaii shadow-kawaii max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-kawaii-pink/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart size={24} className="text-kawaii-pink-dark" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Adoption Application
                </h2>
                <p className="text-gray-600 font-quicksand">
                  Apply to adopt {animal.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Animal Info */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-4">
            <img 
              src={animal.photo} 
              alt={animal.name}
              className="w-20 h-20 rounded-kawaii object-cover"
            />
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">{animal.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{animal.breed} • {animal.ageCategory}</p>
              <p className="text-sm text-gray-600">{animal.shelter}</p>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-4 ${
            message.type === 'success' 
              ? 'bg-green-50 border-b border-green-200 text-green-800' 
              : 'bg-red-50 border-b border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle size={20} className="flex-shrink-0" />
              ) : (
                <AlertTriangle size={20} className="flex-shrink-0" />
              )}
              <p className="font-quicksand">{message.text}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Personal Information</h3>
            
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  className={`kawaii-input pl-12 w-full ${errors.full_name ? 'border-red-300' : ''}`}
                  placeholder="Enter your full name"
                  {...register('full_name', { required: 'Full name is required' })}
                />
              </div>
              {errors.full_name && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {errors.full_name.message}
                </p>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="email"
                  className={`kawaii-input pl-12 w-full ${errors.email ? 'border-red-300' : ''}`}
                  placeholder="Enter your email address"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {errors.email.message}
                </p>
              )}
            </div>
            
            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="tel"
                  className={`kawaii-input pl-12 w-full ${errors.phone ? 'border-red-300' : ''}`}
                  placeholder="Enter your phone number"
                  {...register('phone', { required: 'Phone number is required' })}
                />
              </div>
              {errors.phone && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {errors.phone.message}
                </p>
              )}
            </div>
            
            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Home Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  className={`kawaii-input pl-12 w-full ${errors.address ? 'border-red-300' : ''}`}
                  placeholder="Enter your home address"
                  {...register('address', { required: 'Home address is required' })}
                />
              </div>
              {errors.address && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>

          {/* Adoption Information */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Adoption Information</h3>
            
            {/* Reason */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Why do you want to adopt {animal.name}? *
              </label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-3 text-gray-500" size={20} />
                <textarea
                  className={`kawaii-input pl-12 w-full h-32 resize-none ${errors.reason ? 'border-red-300' : ''}`}
                  placeholder="Tell us why you want to adopt this pet and what kind of home you can provide..."
                  {...register('reason', { 
                    required: 'Please tell us why you want to adopt this pet',
                    minLength: {
                      value: 50,
                      message: 'Please provide at least 50 characters'
                    }
                  })}
                />
              </div>
              <div className="flex justify-between mt-1">
                {errors.reason ? (
                  <p className="text-red-600 text-xs flex items-center gap-1">
                    <AlertTriangle size={12} />
                    {errors.reason.message}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">Minimum 50 characters</p>
                )}
                <p className="text-xs text-gray-500">
                  {watch('reason')?.length || 0}/500
                </p>
              </div>
            </div>
            
            {/* Experience */}
            <div>
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-kawaii hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  {...register('has_experience')}
                />
                <div>
                  <span className="text-sm font-semibold text-gray-700">
                    I have experience with pets
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Check this if you have owned or cared for pets before
                  </p>
                </div>
              </label>
            </div>
            
            {/* Terms Agreement */}
            <div>
              <label className={`flex items-center gap-3 p-4 border rounded-kawaii transition-colors duration-200 cursor-pointer ${
                errors.agrees_to_terms 
                  ? 'border-red-300 bg-red-50' 
                  : watchAgreeToTerms 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  {...register('agrees_to_terms', { 
                    required: 'You must agree to the terms to proceed' 
                  })}
                />
                <div>
                  <span className="text-sm font-semibold text-gray-700">
                    I agree to a home check and adoption terms *
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    By checking this box, you agree to allow a home check and accept our adoption terms and conditions
                  </p>
                </div>
              </label>
              {errors.agrees_to_terms && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {errors.agrees_to_terms.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-gray-200 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-kawaii text-gray-700 font-bold hover:bg-gray-50 transition-colors duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || message?.type === 'success'}
              className="flex-1 py-3 px-4 bg-kawaii-pink hover:bg-kawaii-pink-dark disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-bold rounded-kawaii transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-md"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : message?.type === 'success' ? (
                <>
                  <CheckCircle size={18} />
                  Application Submitted!
                </>
              ) : (
                <>
                  <Heart size={18} />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdoptionForm;