# 🔧 Environment Variables for Marketing Site Integration

## Required for Vercel Deployment:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51Rd76LCVD9tkw4fnw1IXXdpLUbxSVNpPME4P4BSqNNToapQhfhJ6SWUszE5jcqoW1NVSE7fWqCZeyCD0MxHqipzp00LHVNoOh9
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE

# Multi-Currency Price IDs (Premium Plan) - EUR Base €19.99
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_EUR=price_1Sf7ivCVD9tkw4fnpfiMI5BF
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_USD=price_1RhTI6CVD9tkw4fnUlQoe0br
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_GBP=price_gbp_premium_new
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_AUD=price_aud_premium_new
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_CAD=price_cad_premium_new

# Pro Plan Price IDs (if applicable)
NEXT_PUBLIC_STRIPE_PRO_PRICE_USD=price_usd_pro_new
NEXT_PUBLIC_STRIPE_PRO_PRICE_EUR=price_eur_pro_new
NEXT_PUBLIC_STRIPE_PRO_PRICE_GBP=price_gbp_pro_new
NEXT_PUBLIC_STRIPE_PRO_PRICE_AUD=price_aud_pro_new
NEXT_PUBLIC_STRIPE_PRO_PRICE_CAD=price_cad_pro_new

# AWS Cognito Configuration
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_USER_POOL_ID=us-east-1_xxxxxxxxx
NEXT_PUBLIC_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx

# Dashboard Integration
NEXT_PUBLIC_DASHBOARD_URL=https://app.screentimejourney.com

# API Configuration  
NEXT_PUBLIC_API_ENDPOINT=https://your-api-gateway-url/prod
```

## Add these to:
- Vercel Dashboard → Project Settings → Environment Variables
- Set for: Production, Preview, Development

## 🌍 Multi-Currency Features:
- Automatic country/currency detection
- Currency selector in announcement bar  
- Dynamic pricing in 5 currencies (USD, EUR, GBP, AUD, CAD)
- Stripe-native multi-currency checkout