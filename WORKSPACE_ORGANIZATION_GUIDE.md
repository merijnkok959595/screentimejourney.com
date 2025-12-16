# 🗂️ Screen Time Journey - Complete Workspace Guide

## 🎯 **Project Overview**

You have **2 separate applications** that need to work together:

| **Project** | **Purpose** | **Technology** | **Live URL** | **Deployment** |
|-------------|-------------|----------------|--------------|----------------|
| **Marketing Website** | Landing page, blog, product pages | Next.js + Shopify | https://screentimejourney.vercel.app | Vercel |
| **Dashboard App** | User dashboard, milestones, progress | React + Cognito + Stripe | https://app.screentimejourney.com | AWS Amplify |

---

## 📁 **Actual Workspace Structure**

```
/Users/merijnkok/Desktop/screen-time-journey-workspace/
├── marketing-site/                    # ✅ EXISTS - Next.js Marketing Website
│   ├── (Next.js marketing website)    # Ready for Stripe integration
│   └── .git/ → screentimejourney-nextjs-headless
│
├── vercel-dashboard/                   # ✅ WORKING - React Dashboard App
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .git/ → app.screentimejourney.com
│
├── aws_amplify_app/                    # ❌ OLD - Original Amplify version
│   ├── (Original dashboard code)       # Can be archived
│   └── .git/ → (old version)
│
└── [Many other files...]               # Legacy files, can be organized later
```

---

## 🚀 **Current Status**

### ✅ **Dashboard App (React) - WORKING**
- **Local Code**: `/Users/merijnkok/Desktop/screen-time-journey-workspace/vercel-dashboard/`
- **GitHub**: https://github.com/merijnkok959595/app.screentimejourney.com
- **Live Site**: https://app.screentimejourney.com (AWS Amplify)
- **Status**: ✅ All fixes deployed, Cognito + Stripe ready
- **Git Commands**:
  ```bash
  cd /Users/merijnkok/Desktop/screen-time-journey-workspace/vercel-dashboard
  git add . && git commit -m "message" && git push
  # Auto-deploys to AWS Amplify
  ```

### ⚡ **Marketing Website (Next.js) - READY FOR INTEGRATION**
- **Local Code**: ✅ `/Users/merijnkok/Desktop/screen-time-journey-workspace/marketing-site/`
- **GitHub**: https://github.com/merijnkok959595/screentimejourney.com.git  
- **Live Site**: https://screentimejourney.vercel.app (Vercel)
- **Status**: ⚡ Ready to integrate Stripe + Cognito

---

## 🔗 **Integration Flow (Goal)**

```
User Journey:
1. screentimejourney.vercel.app → Marketing site with Stripe checkout
2. Payment success → Create Cognito account  
3. Redirect to app.screentimejourney.com → Dashboard with user progress
```

---

## 📋 **Action Plan**

### **Step 1: Check Marketing Website (Already Exists!)**
```bash
cd /Users/merijnkok/Desktop/screen-time-journey-workspace/marketing-site
ls -la  # Check if it's set up correctly
```

### **Step 2: Set Up Marketing Site Development**
```bash
cd /Users/merijnkok/Desktop/screen-time-journey-workspace/marketing-site
npm install
npm run dev  # Runs on http://localhost:3000
```

### **Step 3: Dashboard Development**  
```bash
cd /Users/merijnkok/Desktop/screen-time-journey-workspace/vercel-dashboard
npm start   # Runs on http://localhost:3001 (to avoid port conflict)
```

---

## 🛠️ **Development Workflow**

### **Working on Marketing Website:**
```bash
cd /Users/merijnkok/Desktop/screen-time-journey-workspace/marketing-site

# Make changes to Next.js code
# Test locally: npm run dev

# Deploy changes:
git add .
git commit -m "feat: add Stripe integration"  
git push origin main
# Auto-deploys to Vercel → screentimejourney.vercel.app
```

### **Working on Dashboard App:**
```bash
cd /Users/merijnkok/Desktop/screen-time-journey-workspace/vercel-dashboard

# Make changes to React code
# Test locally: npm start

# Deploy changes:
git add .
git commit -m "feat: update dashboard features"
git push origin main  
# Auto-deploys to AWS Amplify → app.screentimejourney.com
```

---

## 🔧 **Environment Variables Needed**

### **Marketing Website** (Vercel Environment Variables):
```bash
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51Rd76LCVD9tkw4fn...
STRIPE_SECRET_KEY=sk_live_... (server-side only)

# Cognito  
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_USER_POOL_ID=us-east-1_xxxxxxxxx
NEXT_PUBLIC_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxx

# Redirect after payment
NEXT_PUBLIC_DASHBOARD_URL=https://app.screentimejourney.com
```

### **Dashboard App** (AWS Amplify Environment Variables):
```bash
# Already configured in AWS Amplify Console
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_51Rd76LCVD9tkw4fn...
REACT_APP_STRIPE_PREMIUM_PRICE_ID=price_1RhTI6CVD9tkw4fnUlQoe0br
REACT_APP_AWS_REGION=us-east-1
# ... (other Cognito variables)
```

---

## 🎯 **Next Steps**

### **Immediate Actions:**
1. **Clone marketing website** to workspace
2. **Add Stripe + Cognito** to marketing site  
3. **Test integration** between both sites
4. **Deploy and verify** complete user flow

### **Priority Integration:**
1. **Payment on marketing site** → Creates user account
2. **Redirect to dashboard** → Shows user progress  
3. **Shared authentication** → Seamless experience

---

## 📞 **Quick Reference Commands**

### **Check what's running where:**
```bash
# Marketing site local dev:
cd marketing-site && npm run dev  # http://localhost:3000

# Dashboard local dev:  
cd vercel-dashboard && npm start  # http://localhost:3001

# Live sites:
# https://screentimejourney.vercel.app (marketing)
# https://app.screentimejourney.com (dashboard)
```

### **Deploy to production:**
```bash
# Marketing site:
cd marketing-site && git push  # → Vercel

# Dashboard:  
cd vercel-dashboard && git push  # → AWS Amplify
```

---

**🎉 This guide will keep everything organized and clear!** 

Ready to clone the marketing website and start the integration? 🚀
