import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  DollarSign, 
  CreditCard, 
  Shield, 
  Star, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  User,
  Mail,
  MessageCircle,
  Loader,
  Gift
} from 'lucide-react';
import { Campaign } from '../../types/crowdfunding';
import { DonationFormData } from '../../types/donation';
import { processDonation, validateDonationAmount, formatCurrency } from '../../lib/donationService';

interface EnhancedDonationModalProps {
  campaign: Campaign;
  onClose: () => void;
  onSuccess: (amount: number, isAnonymous: boolean) => void;
}

const EnhancedDonationModal: React.FC<EnhancedDonationModalProps> = ({ 
  campaign, 
  onClose, 
  onSuccess 
}) => {
  const [step, setStep] = useState<'amount' | 'details' | 'payment' | 'processing' | 'success'>('amount');
  const [formData, setFormData] = useState<DonationFormData>({
    amount: 25,
    paymentMethod: 'card',
    isRecurring: false,
    isAnonymous: false,
    donorName: '',
    donorEmail: '',
    donorMessage: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  const handleAmountSelect = (amount: number) => {
    setFormData(prev => ({ ...prev, amount, customAmount: undefined }));
    setErrors(prev => ({ ...prev, amount: '' }));
  };

  const handleCustomAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setFormData(prev => ({ ...prev, amount: numValue, customAmount: numValue }));
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  const validateStep = (currentStep: string): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (currentStep === 'amount') {
      const validation = validateDonationAmount(formData.amount);
      if (!validation.isValid) {
        newErrors.amount = validation.error || 'Invalid amount';
      }
    }

    if (currentStep === 'details') {
      if (!formData.isAnonymous) {
        if (!formData.donorName?.trim()) {
          newErrors.donorName = 'Name is required';
        }
      }
      
      if (!formData.donorEmail?.trim()) {
        newErrors.donorEmail = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.donorEmail)) {
        newErrors.donorEmail = 'Please enter a valid email address';
      }
    }

    if (currentStep === 'payment' && formData.paymentMethod === 'card') {
      if (!formData.cardDetails?.number?.trim()) {
        newErrors.cardNumber = 'Card number is required';
      }
      if (!formData.cardDetails?.expiry?.trim()) {
        newErrors.cardExpiry = 'Expiry date is required';
      }
      if (!formData.cardDetails?.cvc?.trim()) {
        newErrors.cardCvc = 'CVC is required';
      }
      if (!formData.cardDetails?.name?.trim()) {
        newErrors.cardName = 'Cardholder name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;

    switch (step) {
      case 'amount':
        setStep('details');
        break;
      case 'details':
        setStep('payment');
        break;
      case 'payment':
        handleSubmitDonation();
        break;
    }
  };

  const handleBack = () => {
    switch (step) {
      case 'details':
        setStep('amount');
        break;
      case 'payment':
        setStep('details');
        break;
    }
  };

  const handleSubmitDonation = async () => {
    if (!validateStep('payment')) return;

    setStep('processing');
    setIsProcessing(true);

    try {
      const result = await processDonation(campaign.id, formData);

      if (result.success) {
        setStep('success');
        onSuccess(formData.amount, formData.isAnonymous);
      } else {
        setErrors({ payment: result.error || 'Payment failed' });
        setStep('payment');
      }
    } catch (error) {
      setErrors({ payment: 'An unexpected error occurred' });
      setStep('payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const progressPercentage = Math.min((campaign.currentAmount / campaign.goalAmount) * 100, 100);
  const newProgressPercentage = Math.min(((campaign.currentAmount + formData.amount) / campaign.goalAmount) * 100, 100);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-kawaii shadow-kawaii max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-kawaii-yellow/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart size={24} className="text-kawaii-yellow-dark" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Support {campaign.animalName}
                </h2>
                <p className="text-gray-600 font-quicksand">
                  Help this precious animal get back home
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

          {/* Progress Indicator */}
          <div className="mt-6 flex items-center justify-center space-x-4">
            {['amount', 'details', 'payment'].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
                  step === stepName || (step === 'processing' && stepName === 'payment') || (step === 'success' && index <= 2)
                    ? 'bg-kawaii-yellow text-gray-700' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                {index < 2 && (
                  <div className={`w-8 h-1 mx-2 rounded-full transition-colors duration-300 ${
                    (step === 'details' && index === 0) || 
                    (step === 'payment' && index <= 1) || 
                    (step === 'processing' && index <= 1) || 
                    (step === 'success' && index <= 1)
                      ? 'bg-kawaii-yellow' 
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Info */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-4">
            <img 
              src={campaign.image} 
              alt={campaign.animalName}
              className="w-20 h-20 rounded-kawaii object-cover"
            />
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">{campaign.animalName}</h3>
              <p className="text-sm text-gray-600 mb-2">{campaign.location}</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div 
                  className="h-full bg-kawaii-yellow-dark rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">
                {formatCurrency(campaign.currentAmount)} of {formatCurrency(campaign.goalAmount)} raised
              </p>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {step === 'amount' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Choose your donation amount
                </h3>
                <p className="text-gray-600 font-quicksand">
                  Every dollar helps {campaign.animalName} get the care they need
                </p>
              </div>

              {/* Preset Amounts */}
              <div className="grid grid-cols-3 gap-3">
                {presetAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`p-4 rounded-kawaii font-bold transition-all duration-300 ${
                      formData.amount === amount && !formData.customAmount
                        ? 'bg-kawaii-yellow text-gray-700 shadow-md scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-kawaii-yellow/30'
                    }`}
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="number"
                  placeholder="Enter custom amount"
                  value={formData.customAmount || ''}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="kawaii-input pl-12 w-full"
                  min="1"
                  max="10000"
                  step="0.01"
                />
              </div>
              {errors.amount && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <AlertTriangle size={16} />
                  {errors.amount}
                </p>
              )}

              {/* Impact Preview */}
              {formData.amount > 0 && (
                <div className="p-4 bg-kawaii-green/20 rounded-kawaii border border-kawaii-green/30">
                  <h5 className="font-bold text-gray-800 mb-2">Your impact:</h5>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div 
                      className="h-full bg-gradient-to-r from-kawaii-yellow to-kawaii-green rounded-full transition-all duration-500"
                      style={{ width: `${newProgressPercentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-700">
                    Your {formatCurrency(formData.amount)} donation will help reach {Math.round(newProgressPercentage)}% of the goal!
                  </p>
                </div>
              )}

              {/* Recurring Option */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-kawaii hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-kawaii-blue-dark" />
                    <span className="text-sm text-gray-700 font-quicksand font-semibold">
                      Make this a recurring donation
                    </span>
                  </div>
                </label>

                {formData.isRecurring && (
                  <select
                    value={formData.recurringFrequency || 'monthly'}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      recurringFrequency: e.target.value as 'monthly' | 'quarterly' | 'yearly'
                    }))}
                    className="kawaii-input w-full"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                )}
              </div>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Your information
                </h3>
                <p className="text-gray-600 font-quicksand">
                  Help us send you a donation receipt and updates
                </p>
              </div>

              {/* Anonymous Option */}
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-kawaii hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                  className="w-4 h-4"
                />
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-kawaii-purple-dark" />
                  <span className="text-sm text-gray-700 font-quicksand font-semibold">
                    Make this donation anonymous
                  </span>
                </div>
              </label>

              {/* Donor Information */}
              <div className="space-y-4">
                {!formData.isAnonymous && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={formData.donorName}
                      onChange={(e) => setFormData(prev => ({ ...prev, donorName: e.target.value }))}
                      className={`kawaii-input pl-12 w-full ${errors.donorName ? 'border-red-300' : ''}`}
                    />
                    {errors.donorName && (
                      <p className="text-red-600 text-xs mt-1">{errors.donorName}</p>
                    )}
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={formData.donorEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, donorEmail: e.target.value }))}
                    className={`kawaii-input pl-12 w-full ${errors.donorEmail ? 'border-red-300' : ''}`}
                  />
                  {errors.donorEmail && (
                    <p className="text-red-600 text-xs mt-1">{errors.donorEmail}</p>
                  )}
                </div>

                <div className="relative">
                  <MessageCircle className="absolute left-3 top-3 text-gray-500" size={20} />
                  <textarea
                    placeholder="Leave a message of support (optional)"
                    value={formData.donorMessage}
                    onChange={(e) => setFormData(prev => ({ ...prev, donorMessage: e.target.value }))}
                    className="kawaii-input pl-12 w-full h-24 resize-none"
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {formData.donorMessage?.length || 0}/500
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Payment information
                </h3>
                <p className="text-gray-600 font-quicksand">
                  Your payment is secure and encrypted
                </p>
              </div>

              {/* Payment Summary */}
              <div className="p-4 bg-kawaii-blue/20 rounded-kawaii">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-800">Donation Amount:</span>
                  <span className="text-xl font-bold text-kawaii-yellow-dark">
                    {formatCurrency(formData.amount)}
                  </span>
                </div>
                {formData.isRecurring && (
                  <p className="text-sm text-gray-600">
                    Recurring {formData.recurringFrequency}
                  </p>
                )}
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3">
                <h4 className="font-bold text-gray-800">Payment Method</h4>
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-4 border-2 rounded-kawaii cursor-pointer transition-all duration-300 ${
                    formData.paymentMethod === 'card' ? 'border-kawaii-yellow bg-kawaii-yellow/20' : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value as 'card' }))}
                      className="w-4 h-4"
                    />
                    <CreditCard size={20} className="text-gray-600" />
                    <span className="font-semibold text-gray-700">Credit/Debit Card</span>
                  </label>
                  
                  <label className={`flex items-center gap-3 p-4 border-2 rounded-kawaii cursor-pointer transition-all duration-300 ${
                    formData.paymentMethod === 'paypal' ? 'border-kawaii-yellow bg-kawaii-yellow/20' : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value as 'paypal' }))}
                      className="w-4 h-4"
                    />
                    <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">P</span>
                    </div>
                    <span className="font-semibold text-gray-700">PayPal</span>
                  </label>
                </div>
              </div>

              {/* Card Details */}
              {formData.paymentMethod === 'card' && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={formData.cardDetails?.number || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      cardDetails: { ...prev.cardDetails, number: e.target.value } as any
                    }))}
                    className={`kawaii-input w-full ${errors.cardNumber ? 'border-red-300' : ''}`}
                  />
                  {errors.cardNumber && (
                    <p className="text-red-600 text-xs">{errors.cardNumber}</p>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={formData.cardDetails?.expiry || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          cardDetails: { ...prev.cardDetails, expiry: e.target.value } as any
                        }))}
                        className={`kawaii-input ${errors.cardExpiry ? 'border-red-300' : ''}`}
                      />
                      {errors.cardExpiry && (
                        <p className="text-red-600 text-xs mt-1">{errors.cardExpiry}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="CVC"
                        value={formData.cardDetails?.cvc || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          cardDetails: { ...prev.cardDetails, cvc: e.target.value } as any
                        }))}
                        className={`kawaii-input ${errors.cardCvc ? 'border-red-300' : ''}`}
                      />
                      {errors.cardCvc && (
                        <p className="text-red-600 text-xs mt-1">{errors.cardCvc}</p>
                      )}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    value={formData.cardDetails?.name || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      cardDetails: { ...prev.cardDetails, name: e.target.value } as any
                    }))}
                    className={`kawaii-input w-full ${errors.cardName ? 'border-red-300' : ''}`}
                  />
                  {errors.cardName && (
                    <p className="text-red-600 text-xs">{errors.cardName}</p>
                  )}
                </div>
              )}

              {/* Security Notice */}
              <div className="p-3 bg-green-50 border border-green-200 rounded-kawaii">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-green-600" />
                  <span className="text-sm text-green-800 font-quicksand">
                    Your payment is secure and encrypted with 256-bit SSL
                  </span>
                </div>
              </div>

              {/* Payment Error */}
              {errors.payment && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-kawaii">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-red-600" />
                    <span className="text-sm text-red-800">{errors.payment}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-12">
              <Loader size={48} className="text-kawaii-yellow-dark animate-spin mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Processing your donation...</h3>
              <p className="text-gray-600 font-quicksand">
                Please don't close this window while we process your payment.
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-kawaii-green rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
              <p className="text-gray-600 font-quicksand mb-4">
                Your {formatCurrency(formData.amount)} donation to help {campaign.animalName} has been processed successfully.
              </p>
              
              {/* Achievement Badge */}
              <div className="p-4 bg-kawaii-yellow/20 rounded-kawaii border border-kawaii-yellow/30 mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star size={20} className="text-kawaii-yellow-dark" />
                  <span className="font-bold text-gray-800">You're a Hero!</span>
                </div>
                <p className="text-sm text-gray-600">
                  You've earned the "Animal Helper" badge for your generous donation!
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-600 font-quicksand">
                  A confirmation email has been sent to {formData.donorEmail}
                </p>
                {formData.isRecurring && (
                  <p className="text-sm text-gray-600 font-quicksand">
                    Your {formData.recurringFrequency} donation will help provide ongoing support.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {step !== 'processing' && step !== 'success' && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-3">
              <button
                onClick={step === 'amount' ? onClose : handleBack}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-kawaii text-gray-700 font-bold hover:bg-gray-50 transition-colors duration-200"
              >
                {step === 'amount' ? 'Cancel' : 'Back'}
              </button>
              <button
                onClick={handleNext}
                disabled={isProcessing}
                className="flex-1 py-3 px-4 bg-kawaii-yellow hover:bg-kawaii-yellow-dark disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-bold rounded-kawaii transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-md"
              >
                {step === 'payment' ? (
                  <>
                    <Gift size={18} />
                    Donate {formatCurrency(formData.amount)}
                  </>
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-kawaii-pink hover:bg-kawaii-pink-dark text-gray-700 font-bold rounded-kawaii transition-all duration-300 hover:scale-105"
            >
              Continue Browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedDonationModal;