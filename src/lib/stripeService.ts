import { supabase } from './supabase';
import { stripeCheckoutConfig } from '../stripe-config';

/**
 * Creates a Stripe checkout session for a product
 * @param priceId The Stripe price ID
 * @param mode The checkout mode ('payment' or 'subscription')
 * @param successUrl Optional custom success URL
 * @param cancelUrl Optional custom cancel URL
 * @returns The checkout session URL
 */
export const createCheckoutSession = async (
  priceId: string,
  mode: 'payment' | 'subscription',
  successUrl?: string,
  cancelUrl?: string
): Promise<{ url: string; sessionId: string } | { error: string }> => {
  try {
    // Get the user's auth token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { error: 'You must be logged in to make a purchase' };
    }

    // Call the Supabase Edge Function to create a checkout session
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        price_id: priceId,
        mode,
        success_url: successUrl || stripeCheckoutConfig.successUrl,
        cancel_url: cancelUrl || stripeCheckoutConfig.cancelUrl
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Checkout session creation failed:', errorData);
      return { error: errorData.error || 'Failed to create checkout session' };
    }

    const { url, sessionId } = await response.json();
    
    if (!url) {
      return { error: 'No checkout URL returned from server' };
    }

    return { url, sessionId };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return { error: 'An unexpected error occurred' };
  }
};

/**
 * Redirects the user to the Stripe checkout page
 * @param priceId The Stripe price ID
 * @param mode The checkout mode ('payment' or 'subscription')
 * @param successUrl Optional custom success URL
 * @param cancelUrl Optional custom cancel URL
 */
export const redirectToCheckout = async (
  priceId: string,
  mode: 'payment' | 'subscription',
  successUrl?: string,
  cancelUrl?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const result = await createCheckoutSession(priceId, mode, successUrl, cancelUrl);
    
    if ('error' in result) {
      return { success: false, error: result.error };
    }
    
    // Redirect to Stripe Checkout
    window.location.href = result.url;
    return { success: true };
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    return { success: false, error: 'Failed to redirect to checkout' };
  }
};

/**
 * Gets the user's subscription status
 * @returns The subscription status or null if not subscribed
 */
export const getUserSubscription = async () => {
  try {
    const { data, error } = await supabase
      .from('stripe_user_subscriptions')
      .select('*')
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
};

/**
 * Gets the user's order history
 * @returns The user's orders or empty array if none
 */
export const getUserOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('stripe_user_orders')
      .select('*')
      .order('order_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};