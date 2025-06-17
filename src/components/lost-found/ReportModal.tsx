import React, { useState } from 'react';
import { X, Upload, MapPin, Calendar, User, Phone, Mail, PawPrint, Heart } from 'lucide-react';
import { PetCard } from '../../types/pet';

interface ReportModalProps {
  type: 'lost' | 'found';
  onClose: () => void;
  onSubmit: (petData: Partial<PetCard>) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ type, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    contactInfo: '',
    photo: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.location.trim() !== '';
      case 2:
        return formData.description.trim() !== '';
      case 3:
        return formData.contactInfo.trim() !== '';
      default:
        return true;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-kawaii shadow-kawaii max-w-2xl w-full max-h-[90vh] overflow-y-auto slide-in">
        {/* Header */}
        <div className={`p-6 border-b border-gray-200 ${
          type === 'lost' ? 'bg-kawaii-coral/20' : 'bg-kawaii-mint/20'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {type === 'lost' ? (
                <PawPrint size={24} className="text-kawaii-coral" />
              ) : (
                <Heart size={24} className="text-kawaii-mint" />
              )}
              <h2 className="text-2xl font-bold text-gray-800">
                Report {type === 'lost' ? 'Lost' : 'Found'} Pet
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6 flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
                  step >= stepNumber 
                    ? type === 'lost' 
                      ? 'bg-kawaii-coral text-gray-700' 
                      : 'bg-kawaii-mint text-gray-700'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-8 h-1 mx-2 rounded-full transition-colors duration-300 ${
                    step > stepNumber 
                      ? type === 'lost' 
                        ? 'bg-kawaii-coral' 
                        : 'bg-kawaii-mint'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Where was the pet {type === 'lost' ? 'last seen' : 'found'}?
                </h3>
                <p className="text-gray-600 font-quicksand">
                  Please provide as much location detail as possible
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="text"
                    placeholder="Street address, neighborhood, or landmark..."
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="kawaii-input pl-12 w-full"
                    required
                  />
                </div>

                {type === 'lost' && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type="text"
                      placeholder="Pet's name (optional)"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="kawaii-input pl-12 w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Tell us about the pet
                </h3>
                <p className="text-gray-600 font-quicksand">
                  Describe the pet's appearance, behavior, and any distinguishing features
                </p>
              </div>

              <div className="space-y-4">
                <textarea
                  placeholder="Describe the pet's breed, size, color, markings, collar, behavior, etc..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="kawaii-input w-full h-32 resize-none"
                  required
                />

                {/* Photo Upload */}
                <div className="border-2 border-dashed border-kawaii-pink rounded-kawaii p-8 text-center bg-kawaii-pink/10 hover:bg-kawaii-pink/20 transition-colors duration-300">
                  <Upload size={48} className="text-kawaii-pink-dark mx-auto mb-4" />
                  <p className="text-gray-600 font-quicksand mb-2">
                    Upload a photo of the pet
                  </p>
                  <p className="text-sm text-gray-500">
                    A clear photo helps with identification
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  How can people contact you?
                </h3>
                <p className="text-gray-600 font-quicksand">
                  Provide your contact information so people can reach you
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.contactInfo}
                    onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                    className="kawaii-input pl-12 w-full"
                    required
                  />
                </div>

                <div className="bg-kawaii-yellow/20 border border-kawaii-yellow rounded-kawaii p-4">
                  <p className="text-sm text-gray-700 font-quicksand">
                    <strong>Privacy Note:</strong> Your contact information will only be visible to people who respond to your post. We recommend using email for initial contact.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={step === 1 ? onClose : () => setStep(step - 1)}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-bold transition-colors duration-200"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!isStepValid()}
                className={`px-8 py-3 rounded-kawaii font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                  type === 'lost'
                    ? 'bg-kawaii-coral hover:bg-kawaii-coral/80 text-gray-700'
                    : 'bg-kawaii-mint hover:bg-kawaii-mint/80 text-gray-700'
                }`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isStepValid()}
                className={`px-8 py-3 rounded-kawaii font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                  type === 'lost'
                    ? 'bg-kawaii-coral hover:bg-kawaii-coral/80 text-gray-700'
                    : 'bg-kawaii-mint hover:bg-kawaii-mint/80 text-gray-700'
                }`}
              >
                Submit Report
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;