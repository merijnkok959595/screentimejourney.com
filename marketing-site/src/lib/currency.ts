// Multi-currency support for Stripe integration
export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  countries: string[];
  stripeLocale?: string;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    countries: ['US', 'CA'],
    stripeLocale: 'en-US'
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    countries: ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'IE', 'FI', 'GR'],
    stripeLocale: 'en-GB'
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    countries: ['GB'],
    stripeLocale: 'en-GB'
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    countries: ['AU'],
    stripeLocale: 'en-AU'
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    countries: ['CA'],
    stripeLocale: 'en-CA'
  }
};

// Stripe Price IDs for different currencies
export const STRIPE_PRICES = {
  premium: {
    EUR: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_EUR || 'price_1Sf7ivCVD9tkw4fnpfiMI5BF',
    USD: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_USD || 'price_1RhTI6CVD9tkw4fnUlQoe0br', 
    GBP: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_GBP || 'price_gbp_premium',
    AUD: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_AUD || 'price_aud_premium',
    CAD: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_CAD || 'price_cad_premium',
  },
  pro: {
    USD: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_USD || 'price_usd_pro',
    EUR: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_EUR || 'price_eur_pro',
    GBP: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_GBP || 'price_gbp_pro',
    AUD: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_AUD || 'price_aud_pro',
    CAD: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_CAD || 'price_cad_pro',
  }
};

// Product pricing in different currencies
export const PRODUCT_PRICES = {
  premium: {
    USD: 19.99,
    EUR: 18.99,
    GBP: 16.99,
    AUD: 29.99,
    CAD: 26.99,
  },
  pro: {
    USD: 39.99,
    EUR: 36.99,
    GBP: 34.99,
    AUD: 59.99,
    CAD: 52.99,
  }
};

// Detect user's country via IP (you can use a service like ipapi.co)
export const detectUserCountry = async (): Promise<string> => {
  try {
    const response = await fetch('https://ipapi.co/country_code/');
    const countryCode = await response.text();
    return countryCode.trim().toUpperCase();
  } catch (error) {
    console.error('Failed to detect country:', error);
    return 'US'; // Default fallback
  }
};

// Get currency for country
export const getCurrencyForCountry = (countryCode: string): string => {
  for (const [currency, config] of Object.entries(SUPPORTED_CURRENCIES)) {
    if (config.countries.includes(countryCode)) {
      return currency;
    }
  }
  return 'USD'; // Default fallback
};

// Format price with currency
export const formatPrice = (price: number, currency: string): string => {
  const config = SUPPORTED_CURRENCIES[currency];
  if (!config) return `$${price}`;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// Get Stripe Price ID for currency and plan
export const getStripePriceId = (plan: 'premium' | 'pro', currency: string): string => {
  return STRIPE_PRICES[plan][currency as keyof typeof STRIPE_PRICES.premium] || STRIPE_PRICES[plan].USD;
};

// Currency storage helpers
export const setCurrency = (currency: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferred_currency', currency);
  }
};

export const getCurrency = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('preferred_currency') || 'USD';
  }
  return 'USD';
};