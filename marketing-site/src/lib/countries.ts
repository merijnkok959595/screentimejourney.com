// Comprehensive country/currency data for global coverage
export interface Country {
  code: string;
  name: string;
  currency: string;
  symbol: string;
  flag: string;
  price: number; // Price in local currency
}

export const COUNTRIES: Country[] = [
  // North America  
  { code: 'US', name: 'United States', currency: 'USD', symbol: '$', flag: '🇺🇸', price: 21.99 },
  { code: 'CA', name: 'Canada', currency: 'CAD', symbol: 'C$', flag: '🇨🇦', price: 26.99 },
  { code: 'MX', name: 'Mexico', currency: 'MXN', symbol: '$', flag: '🇲🇽', price: 399.99 },

  // Europe (BASE PRICE: €19.99)
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', symbol: '£', flag: '🇬🇧', price: 16.99 },
  { code: 'DE', name: 'Germany', currency: 'EUR', symbol: '€', flag: '🇩🇪', price: 19.99 },
  { code: 'FR', name: 'France', currency: 'EUR', symbol: '€', flag: '🇫🇷', price: 19.99 },
  { code: 'ES', name: 'Spain', currency: 'EUR', symbol: '€', flag: '🇪🇸', price: 19.99 },
  { code: 'IT', name: 'Italy', currency: 'EUR', symbol: '€', flag: '🇮🇹', price: 19.99 },
  { code: 'NL', name: 'Netherlands', currency: 'EUR', symbol: '€', flag: '🇳🇱', price: 19.99 },
  { code: 'BE', name: 'Belgium', currency: 'EUR', symbol: '€', flag: '🇧🇪', price: 19.99 },
  { code: 'AT', name: 'Austria', currency: 'EUR', symbol: '€', flag: '🇦🇹', price: 19.99 },
  { code: 'CH', name: 'Switzerland', currency: 'CHF', symbol: 'Fr', flag: '🇨🇭', price: 19.99 },
  { code: 'SE', name: 'Sweden', currency: 'SEK', symbol: 'kr', flag: '🇸🇪', price: 199.99 },
  { code: 'NO', name: 'Norway', currency: 'NOK', symbol: 'kr', flag: '🇳🇴', price: 199.99 },
  { code: 'DK', name: 'Denmark', currency: 'DKK', symbol: 'kr', flag: '🇩🇰', price: 139.99 },
  { code: 'FI', name: 'Finland', currency: 'EUR', symbol: '€', flag: '🇫🇮', price: 19.99 },
  { code: 'PL', name: 'Poland', currency: 'PLN', symbol: 'zł', flag: '🇵🇱', price: 79.99 },
  { code: 'CZ', name: 'Czech Republic', currency: 'CZK', symbol: 'Kč', flag: '🇨🇿', price: 499.99 },

  // Asia Pacific
  { code: 'AU', name: 'Australia', currency: 'AUD', symbol: 'A$', flag: '🇦🇺', price: 29.99 },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD', symbol: 'NZ$', flag: '🇳🇿', price: 32.99 },
  { code: 'JP', name: 'Japan', currency: 'JPY', symbol: '¥', flag: '🇯🇵', price: 2999 },
  { code: 'KR', name: 'South Korea', currency: 'KRW', symbol: '₩', flag: '🇰🇷', price: 24999 },
  { code: 'SG', name: 'Singapore', currency: 'SGD', symbol: 'S$', flag: '🇸🇬', price: 27.99 },
  { code: 'HK', name: 'Hong Kong', currency: 'HKD', symbol: 'HK$', flag: '🇭🇰', price: 159.99 },
  { code: 'IN', name: 'India', currency: 'INR', symbol: '₹', flag: '🇮🇳', price: 1699.99 },
  { code: 'MY', name: 'Malaysia', currency: 'MYR', symbol: 'RM', flag: '🇲🇾', price: 89.99 },
  { code: 'TH', name: 'Thailand', currency: 'THB', symbol: '฿', flag: '🇹🇭', price: 699.99 },
  { code: 'ID', name: 'Indonesia', currency: 'IDR', symbol: 'Rp', flag: '🇮🇩', price: 299999 },
  { code: 'PH', name: 'Philippines', currency: 'PHP', symbol: '₱', flag: '🇵🇭', price: 1099.99 },
  { code: 'VN', name: 'Vietnam', currency: 'VND', symbol: '₫', flag: '🇻🇳', price: 499999 },

  // Middle East & Africa  
  { code: 'AE', name: 'UAE', currency: 'AED', symbol: 'د.إ', flag: '🇦🇪', price: 73.99 },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', symbol: '﷼', flag: '🇸🇦', price: 74.99 },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', symbol: 'R', flag: '🇿🇦', price: 359.99 },
  { code: 'IL', name: 'Israel', currency: 'ILS', symbol: '₪', flag: '🇮🇱', price: 72.99 },
  { code: 'TR', name: 'Turkey', currency: 'TRY', symbol: '₺', flag: '🇹🇷', price: 579.99 },

  // Latin America
  { code: 'BR', name: 'Brazil', currency: 'BRL', symbol: 'R$', flag: '🇧🇷', price: 99.99 },
  { code: 'AR', name: 'Argentina', currency: 'ARS', symbol: '$', flag: '🇦🇷', price: 7999 },
  { code: 'CL', name: 'Chile', currency: 'CLP', symbol: '$', flag: '🇨🇱', price: 17999 },
  { code: 'CO', name: 'Colombia', currency: 'COP', symbol: '$', flag: '🇨🇴', price: 79999 },
  { code: 'PE', name: 'Peru', currency: 'PEN', symbol: 'S/', flag: '🇵🇪', price: 74.99 },

  // Additional European Countries
  { code: 'IE', name: 'Ireland', currency: 'EUR', symbol: '€', flag: '🇮🇪', price: 19.99 },
  { code: 'PT', name: 'Portugal', currency: 'EUR', symbol: '€', flag: '🇵🇹', price: 19.99 },
  { code: 'GR', name: 'Greece', currency: 'EUR', symbol: '€', flag: '🇬🇷', price: 19.99 },
  { code: 'RU', name: 'Russia', currency: 'RUB', symbol: '₽', flag: '🇷🇺', price: 1499.99 },
  { code: 'UA', name: 'Ukraine', currency: 'UAH', symbol: '₴', flag: '🇺🇦', price: 549.99 },

  // Additional countries can be added easily...
];

// Group countries by region for better UX
export const REGIONS = {
  'North America': ['US', 'CA', 'MX'],
  'Europe': ['GB', 'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'IE', 'PT', 'GR', 'RU', 'UA'],
  'Asia Pacific': ['AU', 'NZ', 'JP', 'KR', 'SG', 'HK', 'IN', 'MY', 'TH', 'ID', 'PH', 'VN'],
  'Middle East & Africa': ['AE', 'SA', 'ZA', 'IL', 'TR'],
  'Latin America': ['BR', 'AR', 'CL', 'CO', 'PE']
};

// Helper functions
export const getCountryByCode = (code: string): Country | undefined => {
  return COUNTRIES.find(country => country.code === code);
};

export const getCountriesBySearch = (searchTerm: string): Country[] => {
  const term = searchTerm.toLowerCase();
  return COUNTRIES.filter(country => 
    country.name.toLowerCase().includes(term) ||
    country.currency.toLowerCase().includes(term) ||
    country.code.toLowerCase().includes(term)
  );
};

export const formatPrice = (country: Country): string => {
  // Handle special formatting for different currencies
  if (country.currency === 'JPY' || country.currency === 'KRW' || country.currency === 'VND' || country.currency === 'IDR' || country.currency === 'CLP' || country.currency === 'ARS') {
    // No decimals for these currencies
    return `${country.symbol}${country.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
  
  return `${country.symbol}${country.price.toFixed(2)}`;
};

// Auto-detect user's country (enhanced)
export const detectUserCountry = async (): Promise<string> => {
  try {
    const response = await fetch('https://ipapi.co/country_code/');
    const countryCode = await response.text();
    const code = countryCode.trim().toUpperCase();
    
    // Check if we support this country
    const country = getCountryByCode(code);
    return country ? code : 'DE'; // Fallback to Germany (EUR base pricing)
  } catch (error) {
    console.error('Country detection failed:', error);
    return 'DE'; // Fallback to Germany (EUR base pricing)
  }
};