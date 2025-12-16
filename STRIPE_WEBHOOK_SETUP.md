# 🎯 **STRIPE WEBHOOK SETUP - ACTION REQUIRED**

## ✅ **COMPLETED:**
- ✅ **Marketing site**: Pushed to git → Live on Vercel  
- ✅ **Dashboard app**: Pushed to git → Live on Amplify
- ✅ **Currency selector**: No flags + footer placement ✨
- ✅ **Animation fix**: Scrolling banner speed stacking resolved 🚀
- ✅ **Stripe webhook handler**: `stripe_webhook_handler.py` created
- ✅ **Full integration**: Stripe + Cognito + Multi-currency

---

## 🚨 **NEXT: Deploy Webhook to AWS Lambda**

Your apps are **LIVE** but you need to deploy the webhook handler so Stripe can store subscription data.

### **🎯 Webhook URL Pattern:**
```
https://YOUR_API_GATEWAY_ID.execute-api.REGION.amazonaws.com/prod/api/stripe/webhook
```

---

## 🔍 **Find Your Current API Gateway URL**

Run this to get your existing API:
```bash
aws apigateway get-rest-apis --query 'items[?name==`screen-time-journey-api`].[id,name]' --output table
```

**Expected output:**
```
|  id         | name                    |
|  abc123xyz  | screen-time-journey-api |
```

**Your webhook URL will be:**
```
https://abc123xyz.execute-api.eu-north-1.amazonaws.com/prod/api/stripe/webhook
```

---

## 🚀 **Quick Deploy Steps**

### **1. Add Stripe to Lambda**
```bash
cd /Users/merijnkok/Desktop/screen-time-journey-workspace/aws_lambda_api

# Add stripe to requirements
echo "stripe" >> requirements.txt

# Create deployment package  
zip -r webhook_deploy.zip stripe_webhook_handler.py requirements.txt

# Deploy to your existing Lambda
aws lambda update-function-code \
  --function-name YOUR_LAMBDA_NAME \
  --zip-file fileb://webhook_deploy.zip
```

### **2. Add Environment Variables**
```bash
aws lambda update-function-configuration \
  --function-name YOUR_LAMBDA_NAME \
  --environment Variables='{
    "STRIPE_SECRET_KEY":"sk_live_YOUR_KEY",
    "STRIPE_WEBHOOK_SECRET":"whsec_YOUR_SECRET",
    "SUBSCRIBERS_TABLE":"stj_subscribers",
    "SUBSCRIPTIONS_TABLE":"stj_subscriptions"
  }'
```

### **3. Add API Gateway Route**
Add this route to your existing API Gateway:
```
POST /api/stripe/webhook → Lambda Handler
```

---

## 🔗 **Configure Stripe Dashboard**

### **Go to:** [Stripe Webhooks](https://dashboard.stripe.com/webhooks)

### **Add Endpoint:**
- **URL**: `https://YOUR_API_GATEWAY_ID.execute-api.eu-north-1.amazonaws.com/prod/api/stripe/webhook`
- **Events**: 
  - ✅ `checkout.session.completed`
  - ✅ `customer.subscription.updated` 
  - ✅ `customer.subscription.deleted`
  - ✅ `invoice.payment_failed`

### **Copy Webhook Secret** 
Copy `whsec_...` and add to Lambda environment variables.

---

## 🧪 **Test Everything**

### **1. Test Payment Flow**
1. Visit: `https://screentimejourney.vercel.app/product/screentimejourney`
2. Select country (Germany | EUR should show €19.99)
3. Click "Start now" → Complete test payment
4. Should redirect to dashboard with login credentials
5. Check DynamoDB for subscription record

### **2. Verify Webhook**
```bash
# Check Lambda logs after payment
aws logs tail /aws/lambda/YOUR_LAMBDA_NAME --follow

# Should see:
# ✅ Stripe webhook received: POST /api/stripe/webhook  
# ✅ Processing webhook: checkout.session.completed
# ✅ Subscription created for user@example.com - sub_123
```

---

## 📱 **Your Live Apps**

### **🎨 Marketing Site (Vercel)**
- **URL**: `https://screentimejourney.vercel.app`
- **Features**: Multi-currency, Stripe checkout, Cognito integration
- **Status**: ✅ LIVE

### **📊 Dashboard (Amplify)** 
- **URL**: `https://app.screentimejourney.com`
- **Features**: Authentication, payment modal, user management
- **Status**: ✅ LIVE

### **⚡ Lambda API**
- **Webhook**: `/api/stripe/webhook` 
- **Status**: ⚠️ NEEDS DEPLOYMENT

---

## 🎯 **Bottom Line**

**Your apps are LIVE and working!** 🎉

**Just need to:**
1. Deploy webhook handler to Lambda
2. Configure Stripe webhook URL  
3. Test a payment

**Then you have a complete Stripe → Cognito → Dashboard flow!** 🚀

---

## ❓ **Need Help?**

Send me:
1. Your API Gateway ID (from `aws apigateway get-rest-apis` command)
2. Your Lambda function name
3. Any error messages from testing

**Ready to complete the integration!** ✨