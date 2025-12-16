# 🚀 Production Setup Guide - Cognito + Stripe Integration

## 🔧 Required Environment Variables

### **Step 1: AWS Cognito Setup**

**Create AWS Cognito User Pool:**
1. Go to AWS Console → Cognito → User Pools
2. Create User Pool with these settings:
   - **Sign-in options**: Email
   - **Required attributes**: Name, Phone Number
   - **Password policy**: Default
   - **MFA**: Optional (recommended)
   - **App client**: Public client
   - **OAuth flows**: Authorization code grant

**Get these values and add to Vercel:**
```bash
REACT_APP_AWS_REGION=us-east-1
REACT_APP_USER_POOL_ID=us-east-1_xxxxxxxxx
REACT_APP_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxx
REACT_APP_OAUTH_DOMAIN=your-domain.auth.us-east-1.amazoncognito.com
REACT_APP_COOKIE_DOMAIN=.vercel.app
REACT_APP_REDIRECT_SIGN_IN=https://screentimejourney.vercel.app
REACT_APP_REDIRECT_SIGN_OUT=https://screentimejourney.vercel.app
```

### **Step 2: Stripe Configuration**

**Create Stripe Account & Get Keys:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get Publishable Key: Dashboard → Developers → API keys
3. Create Products: Dashboard → Products → Add Product
   - **Premium Plan**: $9.99/month recurring
   - **Pro Plan**: $19.99/month recurring

**Add to Vercel Environment Variables:**
```bash
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_STRIPE_PREMIUM_PRICE_ID=price_xxxxxxxxxxxxxxxxx
REACT_APP_STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxxxxxxx
```

### **Step 3: AWS Lambda API Backend**

**Your existing Lambda API endpoint:**
```bash
REACT_APP_API_ENDPOINT=https://your-existing-lambda-api-gateway-url/prod
```

**Required Lambda Functions to Update:**
1. **Authentication Endpoints:**
   - `POST /auth/signup` - Handle Cognito signup
   - `POST /auth/signin` - Handle Cognito signin
   - `POST /auth/signout` - Handle Cognito signout

2. **Stripe Payment Endpoints:**
   - `POST /create-subscription` - Create Stripe subscription
   - `POST /webhook/stripe` - Handle Stripe webhooks
   - `GET /subscription/status` - Check subscription status

### **Step 4: Add to Vercel Dashboard**

**Go to Vercel Project Settings:**
1. Visit: https://vercel.com/merijnkok959595s-projects/app-screentimejourney-com/settings/environment-variables
2. Add all environment variables above
3. Set Environment: **Production, Preview, Development**
4. Save and redeploy

### **Step 5: Update Lambda Functions**

**Add to your existing Lambda functions:**

```python
# In your auth handler
import boto3
import stripe

cognito = boto3.client('cognito-idp', region_name='us-east-1')
stripe.api_key = os.environ['STRIPE_SECRET_KEY']

def signup_handler(event, context):
    # Handle Cognito user signup
    response = cognito.admin_create_user(
        UserPoolId=os.environ['USER_POOL_ID'],
        Username=email,
        MessageAction='SUPPRESS',  # Don't send welcome email
        TemporaryPassword=password,
        UserAttributes=[
            {'Name': 'email', 'Value': email},
            {'Name': 'name', 'Value': full_name},
            {'Name': 'phone_number', 'Value': phone}
        ]
    )
    return response

def create_subscription_handler(event, context):
    # Handle Stripe subscription creation
    stripe_customer = stripe.Customer.create(
        email=user_email,
        name=user_name
    )
    
    subscription = stripe.Subscription.create(
        customer=stripe_customer.id,
        items=[{'price': price_id}],
        payment_behavior='default_incomplete',
        expand=['latest_invoice.payment_intent']
    )
    
    return {
        'client_secret': subscription.latest_invoice.payment_intent.client_secret,
        'subscription_id': subscription.id
    }
```

## 🔐 Security Checklist

- ✅ Use HTTPS only in production
- ✅ Set proper CORS headers in Lambda
- ✅ Validate all inputs on backend
- ✅ Use Stripe webhooks for payment verification
- ✅ Store sensitive data in AWS Secrets Manager
- ✅ Enable Cognito MFA for added security

## 🚀 Deployment Workflow

1. **Add environment variables** to Vercel
2. **Update Lambda functions** with Cognito + Stripe integration
3. **Test authentication flow**:
   - Sign up → Email confirmation → Sign in ✅
4. **Test payment flow**:
   - Sign up → Payment modal → Stripe checkout ✅
5. **Test subscription management**

## 📞 Need Help?

**AWS Cognito Documentation:**
- [User Pool Setup](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html)

**Stripe Documentation:**
- [Accept a Payment](https://stripe.com/docs/payments/accept-a-payment)
- [Subscriptions](https://stripe.com/docs/billing/subscriptions/build-subscriptions)

**Your frontend is ready!** 🎉 Once you add these environment variables, authentication and payments will work seamlessly.