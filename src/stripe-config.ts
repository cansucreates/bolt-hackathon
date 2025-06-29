// Stripe product configuration
export const stripeProducts = {
  donation: {
    priceId: 'price_1RfHE2QCNr9j5YEPftEdeaQG',
    name: 'Donation to Animal in Need',
    description: 'This donation will support veterinary care for rescued animals.',
    mode: 'payment' as const
  }
};

// Default donation amounts
export const defaultDonationAmounts = [10, 25, 50, 100, 250];

// Stripe checkout configuration
export const stripeCheckoutConfig = {
  successUrl: `${window.location.origin}/donations?success=true`,
  cancelUrl: `${window.location.origin}/donations?canceled=true`
};