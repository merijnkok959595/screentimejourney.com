# 🎯 Stripe Webhook Lambda Deployment Guide

## ✅ **READY TO DEPLOY**

I've created `stripe_webhook_handler.py` which handles:
- ✅ `checkout.session.completed` - Creates user subscription records
- ✅ `customer.subscription.updated` - Updates subscription status
- ✅ `customer.subscription.deleted` - Handles cancellations  
- ✅ `invoice.payment_failed` - Handles failed payments

---

## 🚀 **1. Deploy Lambda Function**

### **Option A: Update Existing Lambda**
```bash
cd /Users/merijnkok/Desktop/screen-time-journey-workspace/aws_lambda_api

# Add Stripe to requirements
echo "stripe" >> requirements.txt

# Create deployment package
zip -r stripe_webhook_deployment.zip stripe_webhook_handler.py

# Deploy via AWS CLI
aws lambda update-function-code \
  --function-name screen-time-journey-api \
  --zip-file fileb://stripe_webhook_deployment.zip
```

### **Option B: Create New Lambda Function**
```bash
# Create new function specifically for Stripe webhooks
aws lambda create-function \
  --function-name stj-stripe-webhooks \
  --runtime python3.9 \
  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-execution-role \
  --handler stripe_webhook_handler.lambda_handler \
  --zip-file fileb://stripe_webhook_deployment.zip
```

---

## 🔧 **2. Environment Variables**

Add these environment variables to your Lambda function:

```bash
STRIPE_SECRET_KEY=sk_live_... # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_... # Webhook signing secret (from Stripe dashboard)
SUBSCRIBERS_TABLE=stj_subscribers
SUBSCRIPTIONS_TABLE=stj_subscriptions
```

---

## 🗄️ **3. Create DynamoDB Table**

### **Create Subscriptions Table:**
```bash
aws dynamodb create-table \
  --table-name stj_subscriptions \
  --attribute-definitions AttributeName=subscription_id,AttributeType=S \
  --key-schema AttributeName=subscription_id,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```

### **Or use existing `stj_subscribers` table** (already exists)

---

## 🌐 **4. API Gateway Setup**

### **Create New Route:**
```bash
# Add route to existing API Gateway
POST /api/stripe/webhook → Lambda: stj-stripe-webhooks
```

**Your webhook URL will be:**
```
https://YOUR_API_GATEWAY_ID.execute-api.REGION.amazonaws.com/prod/api/stripe/webhook
```

---

## 🔗 **5. Configure Stripe Webhooks**

### **In Stripe Dashboard:**

1. **Go to:** [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks)

2. **Click "Add endpoint"**

3. **Endpoint URL:**
   ```
   https://YOUR_API_GATEWAY_ID.execute-api.REGION.amazonaws.com/prod/api/stripe/webhook
   ```

4. **Select events to listen for:**
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_failed`

5. **Copy webhook signing secret** and add to Lambda environment variables

---

## 🧪 **6. Test Webhook**

### **Test with Stripe CLI:**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local endpoint for testing
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Trigger test webhook
stripe trigger checkout.session.completed
```

---

## 📊 **7. What Happens When User Pays**

### **Complete Flow:**
```
1. User completes checkout on marketing site
   ↓
2. Stripe sends checkout.session.completed webhook to Lambda
   ↓  
3. Lambda stores subscription in DynamoDB:
   - stj_subscriptions table (new structure)
   - stj_subscribers table (legacy compatibility)
   ↓
4. User account creation continues via marketing site
   ↓
5. User redirected to dashboard with credentials
```

### **Stored Data:**
```json
{
  "customer_id": "cus_...",
  "email": "user@example.com", 
  "subscription_id": "sub_...",
  "status": "active",
  "plan": "premium",
  "currency": "eur",
  "country": "DE",
  "created_at": "2025-12-16T23:45:00.000Z",
  "payment_source": "stripe"
}
```

---

## 🚨 **URGENT: What You Need to Do Now**

### **1. Get Your Current API Gateway URL**
```bash
aws apigateway get-rest-apis --query 'items[?name==`screen-time-journey-api`]'
```

### **2. Add Webhook Route** 
Either:
- Add `/api/stripe/webhook` route to existing API Gateway
- Or deploy new Lambda with API Gateway trigger

### **3. Set Environment Variables**
```bash
STRIPE_SECRET_KEY=sk_live_... # From your Stripe account
STRIPE_WEBHOOK_SECRET=whsec_... # Will get from Stripe after creating webhook
```

### **4. Deploy and Test**
- Deploy Lambda function
- Configure Stripe webhook with your Lambda URL
- Test with a real payment

---

## 📋 **Quick Deploy Checklist**

- [ ] Lambda function deployed with `stripe_webhook_handler.py`  
- [ ] Environment variables set (Stripe keys)
- [ ] DynamoDB table exists (`stj_subscriptions`)
- [ ] API Gateway route configured (`/api/stripe/webhook`)
- [ ] Stripe webhook configured with Lambda URL
- [ ] Test webhook with Stripe CLI
- [ ] Verify subscription data appears in DynamoDB after test payment

**Ready for production! 🚀**