import React, { useState } from 'react';
import { X, Heart, DollarSign, CreditCard, Shield, Star } from 'lucide-react';
import { Campaign } from '../../types/crowdfunding';

interface DonationModalProps {
  campaign: Campaign;
  onClose: () => void;
  onDonate: (amount: number, isAnonymous: boolean) => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ campaign, onClose, onDonate }) => {
  const [amount, setAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [step, setStep] = useState<'amount' | 'payment' | 'confirmation'>('amount');

  const presetAmounts = [10, 25, 50, 100, 250];

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setAmount(numValue);
    }
  };

  const handleDonate = () => {
    if (amount > 0) {
      onDonate(amount, isAnonymous);
      setStep('confirmation');
    }
  };

  const progressPercentage = Math.min((campaign.currentAmount / campaign.goalAmount) * 100, 100);
  const newProgressPercentage = Math.min(((campaign.currentAmount + amount) / campaign.goalAmount) * 100, 100);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-kawaii shadow-kawaii max-w-md w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-kawaii-yellow/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart size={24} className="text-kawaii-yellow-dark" />
              <h2 className="text-2xl font-bold text-gray-800">
                Support {campaign.animalName}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {step === 'amount' && (
          <div className="p-6">
            {/* Campaign Info */}
            <div className="flex gap-4 mb-6">
              <img 
                src={campaign.image} 
                alt={campaign.animalName}
                className="w-20 h-20 rounded-kawaii object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{campaign.animalName}</h3>
                <p className="text-sm text-gray-600 mb-2">{campaign.location}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-full bg-kawaii-yellow-dark rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ${campaign.currentAmount} of ${campaign.goalAmount} raised
                </p>
              </div>
            </div>

            {/* Amount Selection */}
            <div className="mb-6">
              <h4 className="font-bold text-gray-800 mb-4">Choose your donation amount</h4>
              
              {/* Preset Amounts */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {presetAmounts.map((presetAmount) => (
                  <button
                    key={presetAmount}
                    onClick={() => handleAmountSelect(presetAmount)}
                    className={`p-3 rounded-kawaii font-bold transition-all duration-300 ${
                      amount === presetAmount && !customAmount
                        ? 'bg-kawaii-yellow text-gray-700 shadow-md scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-kawaii-yellow/30'
                    }`}
                  >
                    ${presetAmount}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="number"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="kawaii-input pl-12 w-full"
                  min="1"
                  step="0.01"
                />
              </div>
            </div>

            {/* Impact Preview */}
            {amount > 0 && (
              <div className="mb-6 p-4 bg-kawaii-green/20 rounded-kawaii border border-kawaii-green/30">
                <h5 className="font-bold text-gray-800 mb-2">Your impact:</h5>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="h-full bg-gradient-to-r from-kawaii-yellow to-kawaii-green rounded-full transition-all duration-500"
                    style={{ width: `${newProgressPercentage}%` }}
                  />
                </div>
                <p className="text-sm text-gray-700">
                  Your ${amount} donation will help reach {Math.round(newProgressPercentage)}% of the goal!
                </p>
              </div>
            )}

            {/* Anonymous Option */}
            <div className="mb-6">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-kawaii hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700 font-quicksand">
                  Make this donation anonymous
                </span>
              </label>
            </div>

            {/* Continue Button */}
            <button
              onClick={() => setStep('payment')}
              disabled={amount <= 0}
              className="w-full py-3 px-4 bg-kawaii-yellow hover:bg-kawaii-yellow-dark disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-bold rounded-kawaii transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-md"
            >
              <Heart size={18} />
              Continue to Payment
            </button>
          </div>
        )}

        {step === 'payment' && (
          <div className="p-6">
            {/* Payment Summary */}
            <div className="mb-6 p-4 bg-kawaii-blue/20 rounded-kawaii">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800">Donation Amount:</span>
                <span className="text-xl font-bold text-kawaii-yellow-dark">${amount}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <h4 className="font-bold text-gray-800 mb-4">Payment Method</h4>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-4 border-2 rounded-kawaii cursor-pointer transition-all duration-300 ${
                  paymentMethod === 'card' ? 'border-kawaii-yellow bg-kawaii-yellow/20' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                    className="w-4 h-4"
                  />
                  <CreditCard size={20} className="text-gray-600" />
                  <span className="font-semibold text-gray-700">Credit/Debit Card</span>
                </label>
                
                <label className={`flex items-center gap-3 p-4 border-2 rounded-kawaii cursor-pointer transition-all duration-300 ${
                  paymentMethod === 'paypal' ? 'border-kawaii-yellow bg-kawaii-yellow/20' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'paypal')}
                    className="w-4 h-4"
                  />
                  <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">P</span>
                  </div>
                  <span className="font-semibold text-gray-700">PayPal</span>
                </label>
              </div>
            </div>

            {/* Card Details (if card selected) */}
            {paymentMethod === 'card' && (
              <div className="mb-6 space-y-4">
                <input
                  type="text"
                  placeholder="Card Number"
                  className="kawaii-input w-full"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="kawaii-input"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="kawaii-input"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  className="kawaii-input w-full"
                />
              </div>
            )}

            {/* Security Notice */}
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-kawaii">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-green-600" />
                <span className="text-sm text-green-800 font-quicksand">
                  Your payment is secure and encrypted
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep('amount')}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-kawaii text-gray-700 font-bold hover:bg-gray-50 transition-colors duration-200"
              >
                Back
              </button>
              <button
                onClick={handleDonate}
                className="flex-1 py-3 px-4 bg-kawaii-green hover:bg-kawaii-green-dark text-gray-700 font-bold rounded-kawaii transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-md"
              >
                <Heart size={18} />
                Donate ${amount}
              </button>
            </div>
          </div>
        )}

        {step === 'confirmation' && (
          <div className="p-6 text-center">
            {/* Success Animation */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-kawaii-green rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Heart size={32} className="text-white fill-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
              <p className="text-gray-600 font-quicksand">
                Your ${amount} donation to help {campaign.animalName} has been processed successfully.
              </p>
            </div>

            {/* Achievement Badge */}
            <div className="mb-6 p-4 bg-kawaii-yellow/20 rounded-kawaii border border-kawaii-yellow/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star size={20} className="text-kawaii-yellow-dark" />
                <span className="font-bold text-gray-800">Achievement Unlocked!</span>
              </div>
              <p className="text-sm text-gray-600">
                You've earned the "Animal Helper" badge for your generous donation!
              </p>
            </div>

            {/* Close Button */}
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

export default DonationModal;