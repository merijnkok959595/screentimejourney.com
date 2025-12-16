import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
  }
  return stripePromise;
};

export const STRIPE_CONFIG = {
  PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  PREMIUM_PRICE_ID: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
  PRO_PRICE_ID: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  isConfigured: Boolean(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && 
    process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID
  )
};
