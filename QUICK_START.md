# 🚀 Quick Start Guide - TubeBirds Backend

## ✅ What's Been Completed

All migration work is **100% complete**:

- ✅ MongoDB → MySQL (Sequelize) migration
- ✅ All 11 controllers updated (8 existing + 2 new + 1 dashboard)
- ✅ Email service with 7 professional templates
- ✅ Database seeder with sample data
- ✅ All routes configured

---

## 📋 Prerequisites

Before starting, you need:

1. **Hostinger MySQL Credentials** (from cPanel)
2. **Hostinger Email Password** (for SMTP)

---

## 🔧 Setup Instructions

### Step 1: Configure Environment Variables

Edit `server/.env` and update these values:

```env
# Get DB_HOST from Hostinger cPanel → MySQL Databases
DB_HOST=your-mysql-host.hostinger.com

# Your MySQL password
DB_PASSWORD=your_actual_password

# Your email password  
SMTP_PASSWORD=your_email_password
```

### Step 2: Install Dependencies (Already Done)

```bash
cd server
npm install
```

### Step 3: Seed the Database

```bash
npm run seed:data
```

This will create:
- 1 Admin user
- 5 Services (Views, Subscribers, Likes, Watch Time, Comments)
- 13 Pricing plans
- 3 Portfolio items

**Admin Login:**
- Email: `admin@tubebirdspromotion.com`
- Password: `Admin@123`

### Step 4: Start the Server

```bash
npm run dev
```

Expected output:
```
✅ MySQL Database connected successfully
✅ Database synced
✅ Email service is ready to send messages
🚀 Server running on port 5000
```

---

## 🧪 Testing Endpoints

### 1. Health Check
```bash
GET http://localhost:5000/api/health
```

### 2. Get All Services
```bash
GET http://localhost:5000/api/services
```

### 3. Register New User (Test Email)
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "your-email@example.com",
  "password": "Test@123",
  "phone": "1234567890"
}
```
**Check your email for verification link!**

### 4. Login as Admin
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@tubebirdspromotion.com",
  "password": "Admin@123"
}
```

### 5. Get Pricing Plans
```bash
GET http://localhost:5000/api/pricing
```

### 6. Submit Contact Form (Test Admin Email)
```bash
POST http://localhost:5000/api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "subject": "Test Contact",
  "message": "Testing the contact form"
}
```
**Admin should receive notification email!**

---

## 📊 Available API Routes

### Public Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `GET /api/pricing` - Get pricing plans
- `GET /api/portfolio` - Get portfolio items
- `POST /api/contact` - Submit contact form
- `POST /api/consultations` - Request consultation
- `GET /api/reviews` - Get approved reviews

### Protected Routes (Require Authentication)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `POST /api/reviews` - Submit review (client only)

### Admin Routes (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/contacts` - Get all contacts
- `GET /api/consultations` - Get consultations
- `GET /api/dashboard/admin/stats` - Admin stats
- `PATCH /api/reviews/:id/approve` - Approve/reject review

---

## 📧 Email Features

All emails are sent via Hostinger SMTP. Test these:

1. **Registration** → Verification email
2. **Contact Form** → Admin notification
3. **Consultation** → Admin notification
4. **Order Creation** → Order confirmation (after payment)
5. **Payment Success** → Payment receipt + Order confirmation

---

## 🗄️ Database Structure

### Tables Created by Sequelize:
- `users` - User accounts (client/admin/editor)
- `services` - YouTube growth services
- `pricings` - Pricing plans for each service
- `orders` - Customer orders
- `portfolios` - Success stories & case studies
- `contacts` - Contact form submissions
- `consultations` - Free consultation requests
- `reviews` - Order reviews with approval
- `payments` - Payment transaction records

---

## 🔍 Troubleshooting

### "Access denied for user"
- Check `DB_PASSWORD` in `.env`
- Verify user `u422058511_vishal` has correct password

### "Can't connect to MySQL server"
- Update `DB_HOST` with value from Hostinger cPanel
- Enable remote MySQL access in cPanel → Remote MySQL

### "Emails not sending"
- Verify `SMTP_PASSWORD` in `.env`
- Check email account is active in Hostinger
- Look for errors in server console

### "Tables don't exist"
- Ensure server started successfully
- Run `npm run seed:data` again
- Check Sequelize sync logs

---

## 📁 Project Structure

```
server/
├── config/
│   └── db.js (MySQL Sequelize config)
├── controllers/
│   ├── authController.js (✅ Email verification)
│   ├── userController.js (✅ Sequelize)
│   ├── serviceController.js (✅ Sequelize)
│   ├── pricingController.js (✅ Sequelize)
│   ├── orderController.js (✅ Sequelize + Email)
│   ├── portfolioController.js (✅ Sequelize)
│   ├── contactController.js (✅ Sequelize + Email)
│   ├── consultationController.js (✅ NEW + Email)
│   ├── reviewController.js (✅ NEW)
│   ├── paymentController.js (✅ Sequelize + Email)
│   └── dashboardController.js (✅ Sequelize aggregates)
├── models/
│   ├── User.js (✅ Sequelize)
│   ├── Service.js (✅ Sequelize)
│   ├── Pricing.js (✅ Sequelize)
│   ├── Order.js (✅ Sequelize)
│   ├── Portfolio.js (✅ Sequelize)
│   ├── Contact.js (✅ Sequelize)
│   ├── Consultation.js (✅ NEW)
│   ├── Review.js (✅ NEW)
│   ├── Payment.js (✅ NEW)
│   └── index.js (✅ All associations)
├── routes/
│   └── (All 11 route files)
├── seeds/
│   └── seedData.js (✅ Sample data)
├── utils/
│   ├── emailService.js (✅ Nodemailer + 7 templates)
│   └── tokenUtils.js
└── server.js (✅ Updated for Sequelize)
```

---

## 🎯 Next Steps

1. **Test locally** with your credentials
2. **Update frontend** to use new API routes:
   - `/api/consultations` - Free consultation form
   - `/api/reviews` - Review system
   - Email verification flow
3. **Deploy** following `DEPLOYMENT_PLAN.md`
4. **Configure domain** (tubebirdspromotion.com)

---

## 🆘 Need Help?

Check these files:
- `TESTING_GUIDE.md` - Detailed testing instructions
- `DEPLOYMENT_PLAN.md` - Full deployment guide
- `CONTROLLER_MIGRATION_TODO.md` - Migration reference

---

**Status:** ✅ Ready for Testing & Deployment  
**Required:** Hostinger credentials (DB + Email)  
**Estimated Setup Time:** 5-10 minutes
