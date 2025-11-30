# 🚀 TubeBirds Deployment Guide

Complete guide for deploying TubeBirds MERN application to production.

## 📋 Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Database Migration](#database-migration)
4. [Frontend Deployment (Netlify)](#frontend-deployment-netlify)
5. [Domain Configuration](#domain-configuration)
6. [Testing & Verification](#testing--verification)

---

## ✅ Pre-Deployment Checklist

### Backend Completed ✓
- [x] MySQL database models (9 models)
- [x] All controllers converted to Sequelize
- [x] Email service with Hostinger SMTP
- [x] reCAPTCHA verification on registration
- [x] Email validation on backend
- [x] All API routes configured
- [x] Error handling middleware
- [x] Authentication & authorization
- [x] Database seeder ready

### Frontend Completed ✓
- [x] All pages: Home, Services, Pricing, Portfolio, About, Contact
- [x] Auth pages: Login, Register (with validation & CAPTCHA)
- [x] Admin Dashboard pages
- [x] Client Dashboard pages
- [x] API service with all endpoints
- [x] Redux store configured
- [x] Email validation on registration form
- [x] reCAPTCHA integration

### Services Configured ✓
- [x] Hostinger MySQL Database
- [x] Hostinger SMTP Email
- [x] Domain: tubebirdspromotion.com

---

## 🖥️ Backend Deployment (Render)

### Step 1: Push Code to GitHub

```bash
# Initialize git if not already done
cd TubeBirds
git init

# Create .gitignore
echo "node_modules/
.env
.DS_Store
dist/
build/" > .gitignore

# Commit all changes
git add .
git commit -m "Ready for deployment"

# Create GitHub repository and push
git remote add origin https://github.com/tubebirdspromotion-spec/tubebirds.git
git branch -M main
git push -u origin main
```

### Step 2: Create Render Account

1. Go to [Render.com](https://render.com)
2. Sign up using GitHub
3. Verify your email

### Step 3: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `tubebirds`
3. Configure the service:

   **Basic Settings:**
   - Name: `tubebirds-api`
   - Region: `Singapore` (closest to India)
   - Branch: `main`
   - Root Directory: `server`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

   **Instance Type:**
   - Free tier (or Starter $7/month for better performance)

### Step 4: Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# MySQL Database (Hostinger)
DB_HOST=srv1995.hstgr.io
DB_PORT=3306
DB_USER=u422058511_vishal
DB_PASSWORD=Vishal8081@
DB_NAME=u422058511_tubebirds
DB_DIALECT=mysql

# JWT Secret (Generate new one for production!)
JWT_SECRET=your_production_jwt_secret_key_here_make_it_complex
JWT_EXPIRE=30d

# Google reCAPTCHA v2 (Get production keys!)
RECAPTCHA_SECRET_KEY=your_production_recaptcha_secret_key

# Frontend URL (Will update after Netlify deployment)
CLIENT_URL=https://tubebirdspromotion.com

# Email Configuration (Hostinger SMTP)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=contact@tubebirdspromotion.com
SMTP_PASSWORD=Vishal8081@
FROM_NAME=TubeBirds Promotion
FROM_EMAIL=contact@tubebirdspromotion.com
ADMIN_EMAIL=contact@tubebirdspromotion.com

# Payment Gateway (PayU)
PAYU_MERCHANT_KEY=your_payu_merchant_key
PAYU_MERCHANT_SALT=your_payu_merchant_salt
PAYU_MODE=live
PAYU_SUCCESS_URL=https://tubebirdspromotion.com/payment/success
PAYU_FAILURE_URL=https://tubebirdspromotion.com/payment/failure
```

**Important Notes:**
- Remove `SKIP_DB=true` (database will work from Render)
- Generate new `JWT_SECRET` for production
- Get production reCAPTCHA keys from [Google reCAPTCHA](https://www.google.com/recaptcha/admin)

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Your API will be live at: `https://tubebirds-api.onrender.com`

---

## 🗄️ Database Migration

### Step 1: Verify Database Connection

Once Render deployment is complete, check the logs:
```
✅ MySQL database connected successfully!
🚀 Server is running on port 5000 in production mode
```

### Step 2: Run Database Seeder

Access Render Shell:
1. Go to your service dashboard
2. Click **"Shell"** tab
3. Run the seeder:

```bash
npm run seed:data
```

This will create:
- 1 Admin user: `admin@tubebirdspromotion.com` / `Admin@123`
- 5 Sample services
- 13 Pricing plans (₹199 to ₹14,999)
- 3 Portfolio items

### Step 3: Verify Data

Test API endpoints:
```bash
# Health check
GET https://tubebirds-api.onrender.com/api/health

# Get all services
GET https://tubebirds-api.onrender.com/api/services

# Get all pricing plans
GET https://tubebirds-api.onrender.com/api/pricing
```

---

## 🌐 Frontend Deployment (Netlify)

### Step 1: Update Environment Variables

Edit `client/.env.production`:

```env
# API Configuration (Use your Render URL)
VITE_API_URL=https://tubebirds-api.onrender.com/api

# Google reCAPTCHA v2 (Production keys)
VITE_RECAPTCHA_SITE_KEY=your_production_recaptcha_site_key

# Payment Gateway
VITE_PAYU_MERCHANT_KEY=your_payu_merchant_key
```

### Step 2: Build Frontend

```bash
cd client
npm run build
```

This creates the `dist/` folder.

### Step 3: Deploy to Netlify

**Option A: Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd client
netlify deploy --prod --dir=dist
```

**Option B: Netlify Dashboard**
1. Go to [Netlify.com](https://netlify.com)
2. Drag & drop the `client/dist` folder
3. Configure domain

### Step 4: Configure Custom Domain

1. In Netlify dashboard → **"Domain Settings"**
2. Click **"Add custom domain"**
3. Enter: `tubebirdspromotion.com`
4. Follow DNS configuration steps

---

## 🌍 Domain Configuration (Hostinger)

### Update DNS Records

Go to Hostinger cPanel → **"DNS Zone Editor"**:

```dns
# Frontend (Netlify)
Type: A
Name: @
Value: 75.2.60.5 (Netlify load balancer)

Type: CNAME
Name: www
Value: tubebirds-frontend.netlify.app

# Backend (Render) - Optional subdomain
Type: CNAME
Name: api
Value: tubebirds-api.onrender.com
```

**Note:** DNS propagation takes 24-48 hours.

---

## 🧪 Testing & Verification

### 1. Test Backend API

```bash
# Health check
curl https://tubebirds-api.onrender.com/api/health

# Register new user (with CAPTCHA)
curl -X POST https://tubebirds-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "Test@123",
    "captchaToken": "your_captcha_token"
  }'

# Login
curl -X POST https://tubebirds-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tubebirdspromotion.com",
    "password": "Admin@123"
  }'
```

### 2. Test Frontend

1. Visit `https://tubebirdspromotion.com`
2. Test registration with:
   - Email validation (real-time)
   - reCAPTCHA verification
3. Test login
4. Check dashboard access
5. Test order creation
6. Verify email notifications

### 3. Test Email Service

- Register new user → Check welcome email
- Create order → Check order confirmation
- Complete payment → Check payment receipt

---

## 📊 Database Migration Summary

### Tables Created (Auto-sync)
1. `Users` - User accounts with roles
2. `Services` - YouTube promotion services
3. `Pricing` - Service pricing plans
4. `Orders` - Customer orders
5. `Payments` - Payment records
6. `Portfolio` - Case studies/results
7. `Contacts` - Contact form submissions
8. `Consultations` - Consultation requests
9. `Reviews` - Service reviews

### Sample Data Seeded
- **Admin User**: `admin@tubebirdspromotion.com` / `Admin@123`
- **Services**: 5 services (Subscribers, Views, Likes, etc.)
- **Pricing**: 13 plans ranging from ₹199 to ₹14,999
- **Portfolio**: 3 success stories

---

## 🔐 Security Checklist

- [x] reCAPTCHA on registration
- [x] Email validation
- [x] Password hashing (bcrypt)
- [x] JWT authentication
- [x] Rate limiting configured
- [x] CORS configured
- [x] Environment variables secured
- [x] Helmet.js security headers
- [ ] SSL/HTTPS enabled (auto by Netlify/Render)

---

## 🐛 Troubleshooting

### Database Connection Issues
- **Symptom**: "Connection refused" errors
- **Solution**: Render can connect to Hostinger MySQL (server-to-server). Local connections are blocked by Hostinger firewall.

### Email Not Sending
- **Check**: SMTP credentials in Render environment variables
- **Test**: Send test email using Render shell

### reCAPTCHA Fails
- **Issue**: Using test keys in production
- **Solution**: Get production keys from Google reCAPTCHA admin console

### Frontend Can't Connect to API
- **Check**: `VITE_API_URL` in Netlify environment variables
- **Check**: CORS configuration in backend

---

## 📞 Support

For deployment issues:
1. Check Render logs: Service → Logs
2. Check Netlify deploy logs: Deploys → Latest deploy
3. Test API endpoints using Postman/curl

---

## ✅ Final Checklist

Before going live:
- [ ] Backend deployed to Render
- [ ] Database seeded with sample data
- [ ] Frontend deployed to Netlify
- [ ] Custom domain configured
- [ ] DNS propagated
- [ ] Test user registration (with CAPTCHA & email validation)
- [ ] Test admin login
- [ ] Test order creation
- [ ] Test email notifications
- [ ] Test payment flow
- [ ] SSL certificates active

**Your application is now live! 🎉**
