import { supabase } from './supabase';
import { DonationTransaction, DonationFormData, DonationStats } from '../types/donation';
import { createPaymentIntent, confirmPayment } from './stripeService';

// Process donation
export const processDonation = async (
  campaignId: string,
  donationData: DonationFormData
): Promise<{ success: boolean; transaction?: DonationTransaction; error?: string }> => {
  try {
    console.log('Processing donation:', { campaignId, donationData });

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    // Check for authentication errors or missing user
    if (userError || !user) {
      console.error('User authentication error:', userError);
      return {
        success: false,
        error: userError?.message || 'Authentication required to process donation.'
      };
    }

    // Create a payment intent with Stripe
    const { clientSecret, error: stripeError } = await createPaymentIntent(
      donationData.amount,
      'usd',
      {
        campaignId,
        donorId: user.id,
        isRecurring: donationData.isRecurring ? 'true' : 'false',
        isAnonymous: donationData.isAnonymous ? 'true' : 'false'
      }
    );

    if (stripeError || !clientSecret) {
      return {
        success: false,
        error: stripeError || 'Failed to create payment intent'
      };
    }

    // In a real implementation, the payment would be confirmed on the client side
    // and then the server would create a donation record in the database
    // For now, we'll simulate a successful transaction
    const mockTransaction: DonationTransaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      campaign_id: campaignId,
      donor_id: user.id,
      amount: donationData.amount,
      currency: 'USD',
      payment_method: donationData.paymentMethod,
      stripe_payment_intent_id: clientSecret.split('_secret_')[0],
      is_anonymous: donationData.isAnonymous,
      is_recurring: donationData.isRecurring,
      recurring_frequency: donationData.recurringFrequency,
      donor_name: donationData.isAnonymous ? undefined : donationData.donorName,
      donor_email: donationData.donorEmail,
      donor_message: donationData.donorMessage,
      status: 'completed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Donation processed successfully:', mockTransaction);

    // Send confirmation email (mock)
    await sendDonationConfirmation(mockTransaction);

    return {
      success: true,
      transaction: mockTransaction
    };
  } catch (error) {
    console.error('Donation processing error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while processing your donation.'
    };
  }
};

// Send donation confirmation email
const sendDonationConfirmation = async (transaction: DonationTransaction): Promise<void> => {
  try {
    // Mock email sending
    console.log('Sending donation confirmation email:', {
      to: transaction.donor_email,
      amount: transaction.amount,
      campaignId: transaction.campaign_id
    });
    
    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Donation confirmation email sent successfully');
  } catch (error) {
    console.error('Failed to send donation confirmation email:', error);
    // Don't fail the donation if email fails
  }
};

// Get donation statistics for a campaign
export const getCampaignDonationStats = async (
  campaignId: string
): Promise<{ data?: DonationStats; error?: string }> => {
  try {
    // Mock donation statistics
    // In production, this would query the database
    const mockStats: DonationStats = {
      totalRaised: 3200,
      totalDonors: 89,
      averageDonation: 35.96,
      recentDonations: [
        {
          id: 'txn_1',
          campaign_id: campaignId,
          amount: 50,
          currency: 'USD',
          payment_method: 'card',
          is_anonymous: false,
          is_recurring: false,
          donor_name: 'Sarah Johnson',
          donor_email: 'sarah@example.com',
          status: 'completed',
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        },
        {
          id: 'txn_2',
          campaign_id: campaignId,
          amount: 25,
          currency: 'USD',
          payment_method: 'card',
          is_anonymous: true,
          is_recurring: false,
          donor_email: 'anonymous@example.com',
          status: 'completed',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
        }
      ],
      topDonors: [
        { name: 'Michael Chen', amount: 200, isAnonymous: false },
        { name: 'Anonymous', amount: 150, isAnonymous: true },
        { name: 'Emily Rodriguez', amount: 100, isAnonymous: false }
      ]
    };

    return { data: mockStats };
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    return { error: 'Failed to fetch donation statistics' };
  }
};

// Get user's donation history
export const getUserDonationHistory = async (): Promise<{ data?: DonationTransaction[]; error?: string }> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { error: 'User not authenticated' };
    }

    // Mock user donation history
    const mockHistory: DonationTransaction[] = [
      {
        id: 'txn_user_1',
        campaign_id: 'campaign_1',
        donor_id: user.id,
        amount: 50,
        currency: 'USD',
        payment_method: 'card',
        is_anonymous: false,
        is_recurring: true,
        recurring_frequency: 'monthly',
        donor_name: 'Current User',
        donor_email: user.email || '',
        status: 'completed',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString()
      }
    ];

    return { data: mockHistory };
  } catch (error) {
    console.error('Error fetching user donation history:', error);
    return { error: 'Failed to fetch donation history' };
  }
};

// Validate donation amount
export const validateDonationAmount = (amount: number): { isValid: boolean; error?: string } => {
  if (amount < 1) {
    return { isValid: false, error: 'Minimum donation amount is $1' };
  }
  
  if (amount > 10000) {
    return { isValid: false, error: 'Maximum donation amount is $10,000' };
  }
  
  return { isValid: true };
};

// Format currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};