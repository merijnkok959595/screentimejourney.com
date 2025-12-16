'use client';
import React, { useState, useEffect } from 'react';
import { getStripe, STRIPE_CONFIG } from '@/lib/stripe';
import { getStripePriceId, formatPrice, PRODUCT_PRICES, getCurrency } from '@/lib/currency';
import toast from 'react-hot-toast';

interface StripeCheckoutProps {
  plan?: 'premium' | 'pro';
  priceId?: string;
  buttonText?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ 
  plan = 'premium',
  priceId,
  buttonText = "Start Your Journey Now",
  className = "",
  style = {},
  children
}) => {
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    // Initialize with saved country or Germany default (EUR base)
    const initCurrency = () => {
      const savedCountryCode = localStorage.getItem('selected_country') || 'DE';
      // Simple mapping for existing Stripe Price IDs
      const currencyMap: Record<string, string> = {
        'US': 'USD', 'CA': 'CAD', 'MX': 'USD', // North America
        'GB': 'GBP', // UK
        'AU': 'AUD', 'NZ': 'AUD', // Australia/NZ
        // All other countries default to EUR for now
      };
      
      // Check if country supports EUR (base currency)
      const eurCountries = ['DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'AT', 'FI', 'IE', 'PT', 'GR'];
      if (eurCountries.includes(savedCountryCode)) {
        setCurrency('EUR');
      } else {
        setCurrency(currencyMap[savedCountryCode] || 'EUR');
      }
    };

    initCurrency();

    // Listen for country changes
    const handleCountryChange = (event: CustomEvent) => {
      const { country, currency: newCurrency } = event.detail;
      
      // Map to supported Stripe currencies
      const supportedCurrencies = ['USD', 'EUR', 'GBP', 'AUD', 'CAD'];
      if (supportedCurrencies.includes(newCurrency)) {
        setCurrency(newCurrency);
      } else {
        setCurrency('EUR'); // Fallback to EUR (base currency) for unsupported currencies
      }
    };

    window.addEventListener('countryChange', handleCountryChange as EventListener);

    return () => {
      window.removeEventListener('countryChange', handleCountryChange as EventListener);
    };
  }, []);

  const handleCheckout = async () => {
    if (!STRIPE_CONFIG.isConfigured) {
      toast.error('Payment system is being configured. Please try again in a few minutes.');
      return;
    }

    // Use the provided priceId or get it based on plan and currency
    const finalPriceId = priceId || getStripePriceId(plan, currency);
    
    if (!finalPriceId) {
      toast.error('Invalid product configuration');
      return;
    }

    try {
      setLoading(true);
      
      // Create checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: finalPriceId,
          currency,
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      
      // Redirect to Stripe checkout
      const stripe = await getStripe();
      if (!stripe) throw new Error('Stripe failed to initialize');

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (children) {
    return (
      <div onClick={handleCheckout} style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>
        {children}
      </div>
    );
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={className}
      style={{
        opacity: loading ? 0.7 : 1,
        cursor: loading ? 'not-allowed' : 'pointer',
        ...style
      }}
    >
      {loading ? 'Processing...' : buttonText}
    </button>
  );
};

export default StripeCheckout;
