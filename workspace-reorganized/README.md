# 🚀 Screen Time Journey - Organized Workspace

## 📁 **Folder Structure**

```
workspace-reorganized/
├── screentimejourney-marketing/     ← Marketing Website (screentimejourney.com)
│   ├── .git → github.com/merijnkok959595/screentimejourney.com.git
│   ├── Next.js 16 + React 19
│   ├── E-commerce template
│   └── Domain: screentimejourney.com
├── screentimejourney-dashboard/     ← User Dashboard (app.screentimejourney.com)  
│   ├── .git → github.com/merijnkok959595/app.screentimejourney.git
│   ├── React 19 + CRA
│   ├── Screen time management app
│   └── Domain: app.screentimejourney.com
└── shared-scripts/                  ← Deployment & Setup Scripts
    ├── AWS configs
    ├── Deployment scripts
    └── Documentation
```

## 🌐 **Deployment Architecture**

```
screentimejourney.com
├── Marketing Landing Page (Next.js)
├── Pricing, About, Blog
├── "Start Now" → Redirects to app.screentimejourney.com
└── AWS Amplify App 1

app.screentimejourney.com  
├── User Dashboard (React)
├── Screen time tracking
├── Device management
├── Progress tracking  
└── AWS Amplify App 2
```

## 🔄 **Git Repository Setup**

### **Marketing Site** (`screentimejourney-marketing/`)
- **Repository**: `screentimejourney.com.git`
- **Branch for deployment**: `main` or `amplify-deploy`
- **Technology**: Next.js 16 + React 19
- **Build command**: `npm run build`
- **Output**: `.next/` directory

### **Dashboard App** (`screentimejourney-dashboard/`)
- **Repository**: `app.screentimejourney.git` 
- **Branch for deployment**: `amplify-deploy` (clean, no secrets)
- **Technology**: React 19 + Create React App
- **Build command**: `npm run build`
- **Output**: `build/` directory

## 🚀 **Deployment Commands**

### Marketing Site
```bash
cd screentimejourney-marketing/
npm run build        # Test locally
git add . && git commit -m "Marketing site update"
git push origin main # Triggers Amplify auto-deploy
```

### Dashboard App
```bash
cd screentimejourney-dashboard/  
npm run build        # Test locally
git add . && git commit -m "Dashboard update"
git push origin amplify-deploy # Triggers Amplify auto-deploy
```

## ✅ **Benefits of This Structure**

1. **🎯 Clear separation** of concerns
2. **🔗 Correct Git repositories** for each app
3. **🚀 Independent deployments**
4. **📱 No more confusion** about which app is which
5. **🛠️ Shared scripts** in one place

## 🔧 **Next Steps**

1. Test both apps build correctly
2. Push initial commits to respective repositories  
3. Configure AWS Amplify to watch correct repos/branches
4. Set up custom domains properly


