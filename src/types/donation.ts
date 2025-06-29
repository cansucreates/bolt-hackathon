export interface DonationTransaction {
  id: string;
  campaign_id: string;
  donor_id?: string;
  amount: number;
  currency: string;
  payment_method: 'card' | 'paypal' | 'bank_transfer';
  stripe_payment_intent_id?: string;
  is_anonymous: boolean;
  is_recurring: boolean;
  recurring_frequency?: 'monthly' | 'quarterly' | 'yearly';
  donor_name?: string;
  donor_email?: string;
  donor_message?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
}

export interface DonationFormData {
  amount: number;
  customAmount?: number;
  paymentMethod: 'card' | 'paypal';
  isRecurring: boolean;
  recurringFrequency?: 'monthly' | 'quarterly' | 'yearly';
  isAnonymous: boolean;
  donorName?: string;
  donorEmail?: string;
  donorMessage?: string;
  cardDetails?: {
    number: string;
    expiry: string;
    cvc: string;
    name: string;
  };
}

export interface DonationStats {
  totalRaised: number;
  totalDonors: number;
  averageDonation: number;
  recentDonations: DonationTransaction[];
  topDonors: {
    name: string;
    amount: number;
    isAnonymous: boolean;
  }[];
}