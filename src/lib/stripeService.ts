import { loadStripe, Stripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

// Initialize Stripe with your publishable key
// In production, this should be an environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

// Create a payment intent
export const createPaymentIntent = async (
  amount: number,
  currency: string = 'usd',
  metadata: Record<string, string> = {}
): Promise<{ clientSecret: string | null; error?: string }> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('User authentication error:', userError);
      return { 
        clientSecret: null, 
        error: userError?.message || 'Authentication required to process payment.' 
      };
    }

    // Call your backend to create a payment intent
    // In a real implementation, this would be a serverless function or API endpoint
    // For demo purposes, we're simulating this with a mock response
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a mock client secret
    // In production, this would come from your server after calling Stripe's API
    const mockClientSecret = `pi_mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}_secret_${Math.random().toString(36).substring(2, 15)}`;
    
    return { clientSecret: mockClientSecret };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return { 
      clientSecret: null, 
      error: error instanceof Error ? error.message : 'Failed to create payment intent' 
    };
  }
};

// Confirm a payment
export const confirmPayment = async (
  stripe: Stripe | null,
  clientSecret: string,
  paymentMethod: { card: any } | { paypal: any },
  billingDetails: {
    name: string;
    email: string;
  }
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!stripe || !clientSecret) {
      return { success: false, error: 'Stripe not initialized or missing client secret' };
    }

    // Confirm the payment
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        ...paymentMethod,
        billing_details: billingDetails
      }
    });

    if (error) {
      console.error('Payment confirmation error:', error);
      return { success: false, error: error.message };
    }

    if (paymentIntent?.status === 'succeeded') {
      return { success: true };
    } else {
      return { 
        success: false, 
        error: `Payment status: ${paymentIntent?.status || 'unknown'}` 
      };
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to confirm payment' 
    };
  }
};

// Create a setup intent for recurring payments
export const createSetupIntent = async (): Promise<{ clientSecret: string | null; error?: string }> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('User authentication error:', userError);
      return { 
        clientSecret: null, 
        error: userError?.message || 'Authentication required to set up recurring payments.' 
      };
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a mock setup intent client secret
    const mockSetupIntentSecret = `seti_mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}_secret_${Math.random().toString(36).substring(2, 15)}`;
    
    return { clientSecret: mockSetupIntentSecret };
  } catch (error) {
    console.error('Error creating setup intent:', error);
    return { 
      clientSecret: null, 
      error: error instanceof Error ? error.message : 'Failed to create setup intent' 
    };
  }
};

// Get Stripe instance
export const getStripe = (): Promise<Stripe | null> => {
  return stripePromise;
};

export default {
  createPaymentIntent,
  confirmPayment,
  createSetupIntent,
  getStripe
};