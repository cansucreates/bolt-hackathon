import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader, Shield, AlertTriangle } from 'lucide-react';
import { createPaymentIntent, confirmPayment } from '../../lib/stripeService';
import { formatCurrency } from '../../lib/donationService';

interface StripePaymentFormProps {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
  billingDetails: {
    name: string;
    email: string;
  };
  onSuccess: () => void;
  onError: (error: string) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  currency = 'usd',
  metadata = {},
  billingDetails,
  onSuccess,
  onError
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Create payment intent when component mounts
  useEffect(() => {
    const getPaymentIntent = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const { clientSecret, error } = await createPaymentIntent(
          amount,
          currency,
          metadata
        );

        if (error || !clientSecret) {
          setErrorMessage(error || 'Failed to initialize payment. Please try again.');
          onError(error || 'Failed to initialize payment');
        } else {
          setClientSecret(clientSecret);
        }
      } catch (error) {
        console.error('Error creating payment intent:', error);
        setErrorMessage('An unexpected error occurred. Please try again.');
        onError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    getPaymentIntent();
  }, [amount, currency, metadata, onError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      // Stripe.js has not loaded yet or client secret is missing
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage('Card element not found');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { success, error } = await confirmPayment(
        stripe,
        clientSecret,
        { card: cardElement },
        billingDetails
      );

      if (success) {
        onSuccess();
      } else {
        setErrorMessage(error || 'Payment failed. Please try again.');
        onError(error || 'Payment failed');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
      onError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: 'Quicksand, sans-serif',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
        iconColor: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-kawaii-blue/20 rounded-kawaii">
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-800">Donation Amount:</span>
          <span className="text-xl font-bold text-kawaii-yellow-dark">{formatCurrency(amount)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            Card Details
          </label>
          <div className="p-4 border-2 border-kawaii-pink rounded-kawaii bg-white">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-3 bg-green-50 border border-green-200 rounded-kawaii">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-green-600" />
            <span className="text-sm text-green-800 font-quicksand">
              Your payment is secure and encrypted with 256-bit SSL
            </span>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-kawaii">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-600" />
              <span className="text-sm text-red-800">{errorMessage}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || !elements || isLoading}
          className="w-full py-3 px-4 bg-kawaii-green hover:bg-kawaii-green-dark disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-bold rounded-kawaii transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-md"
        >
          {isLoading ? (
            <>
              <Loader size={18} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Pay {formatCurrency(amount)}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default StripePaymentForm;