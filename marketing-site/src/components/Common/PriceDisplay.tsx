'use client';
import React, { useState, useEffect } from 'react';
import { getCountryByCode, formatPrice as formatCountryPrice } from '@/lib/countries';

interface PriceDisplayProps {
  plan: 'premium' | 'pro';
  className?: string;
  showCurrency?: boolean;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ 
  plan, 
  className = '',
  showCurrency = true 
}) => {
  const [priceData, setPriceData] = useState({ symbol: '$', price: 19.99 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize with saved country or Germany default (EUR base pricing)
    const initPrice = () => {
      const savedCountryCode = localStorage.getItem('selected_country') || 'DE';
      const country = getCountryByCode(savedCountryCode);
      if (country) {
        setPriceData({ symbol: country.symbol, price: country.price });
      }
      setIsLoading(false);
    };

    initPrice();

    // Listen for country changes
    const handleCountryChange = (event: CustomEvent) => {
      const { symbol, price } = event.detail;
      setPriceData({ symbol, price });
    };

    window.addEventListener('countryChange', handleCountryChange as EventListener);

    return () => {
      window.removeEventListener('countryChange', handleCountryChange as EventListener);
    };
  }, []);

  if (isLoading) {
    return <span className={className}>€19.99</span>; // Default fallback to EUR
  }

  // Format price properly (no decimals for certain currencies like JPY, KRW, etc.)
  const needsDecimals = priceData.price < 100 || !Number.isInteger(priceData.price);
  const formattedPrice = showCurrency 
    ? needsDecimals
      ? `${priceData.symbol}${priceData.price.toFixed(2)}`
      : `${priceData.symbol}${priceData.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
    : priceData.price.toFixed(2);

  return (
    <span className={className}>
      {formattedPrice}
    </span>
  );
};

export default PriceDisplay;