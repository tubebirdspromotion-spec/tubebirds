# Razorpay Integration - Setup Checklist

## ✅ Pre-Integration Checklist

### Before You Start
- [ ] Node.js installed (v14+ recommended)
- [ ] Database setup (MySQL)
- [ ] Project dependencies installed
- [ ] Basic understanding of React and Node.js

---

## 📝 Step-by-Step Setup

### Step 1: Create Razorpay Account (5 mins)
- [ ] Go to https://razorpay.com/signup
- [ ] Sign up with business email
- [ ] Verify email address
- [ ] Login to dashboard

### Step 2: Get API Keys (2 mins)
- [ ] Navigate to **Settings** → **API Keys**
- [ ] Click **Generate Test Keys**
- [ ] Copy **Key ID** (rzp_test_xxxxx)
- [ ] Copy **Key Secret**
- [ ] Store safely (never commit to Git!)

### Step 3: Configure Backend (3 mins)
- [ ] Navigate to `server/` folder
- [ ] Copy `.env.example` to `.env`
  ```bash
  cp .env.example .env
  ```
- [ ] Open `.env` file
- [ ] Add Razorpay credentials:
  ```env
  RAZORPAY_KEY_ID=rzp_test_your_key_id_here
  RAZORPAY_KEY_SECRET=your_secret_key_here
  ```
- [ ] Save the file

### Step 4: Install Dependencies (2 mins)
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### Step 5: Database Setup (if needed)
- [ ] Ensure MySQL is running
- [ ] Database connection configured in `.env`
- [ ] Run migrations (if applicable)
- [ ] Verify tables created (orders, payments, etc.)

### Step 6: Start Application (1 min)
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm run dev
```

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] No errors in console

### Step 7: Test Payment Flow (5 mins)
- [ ] Open browser: http://localhost:5173
- [ ] Login/Register an account
- [ ] Navigate to **Pricing** page
- [ ] Select any plan
- [ ] Click **"Choose Plan"**
- [ ] Fill checkout form:
  - [ ] Video URL: `https://youtube.com/watch?v=dQw4w9WgXcQ`
  - [ ] Channel name (optional)
  - [ ] Agree to terms
- [ ] Click **"Proceed to Secure Payment"**
- [ ] Razorpay checkout loads ✅
- [ ] Use test card: **4111 1111 1111 1111**
- [ ] Expiry: Any future date
- [ ] CVV: Any 3 digits
- [ ] Complete payment
- [ ] Payment success message shown
- [ ] Redirected to dashboard
- [ ] Order visible in dashboard

---

## 🧪 Testing Checklist

### Payment Success Flow
- [ ] Test with credit card (4111 1111 1111 1111)
- [ ] Test with UPI (success@razorpay)
- [ ] Test with net banking
- [ ] Payment verification works
- [ ] Order status updated to "Processing"
- [ ] Payment record created
- [ ] Invoice number generated
- [ ] Email notification sent (if configured)

### Payment Failure Flow
- [ ] Test with failed card (4000 0000 0000 0002)
- [ ] Error message shown
- [ ] Order status remains "Pending"
- [ ] Can retry payment

### Admin Features
- [ ] Login as admin
- [ ] View all orders
- [ ] Filter orders by status
- [ ] View payment history
- [ ] Update order status
- [ ] Add admin notes
- [ ] View customer details
- [ ] View video URLs

### GST Calculation
- [ ] Base amount calculated correctly
- [ ] 18% GST added
- [ ] Total amount correct
- [ ] Breakdown shown on checkout
- [ ] Stored in database correctly

---

## 🔐 Security Checklist

### Environment Variables
- [ ] `.env` file exists
- [ ] `.env` in `.gitignore`
- [ ] All secrets in `.env` (not in code)
- [ ] Different keys for test/production

### Payment Security
- [ ] Signature verification enabled
- [ ] HTTPS in production (later)
- [ ] No API keys in frontend code
- [ ] Webhook signature validation (if setup)

---

## 📧 Optional: Email Configuration

### If You Want Email Notifications
- [ ] Configure SMTP settings in `.env`:
  ```env
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USER=your_email@gmail.com
  SMTP_PASS=your_app_password
  EMAIL_FROM=noreply@tubebirds.com
  ```
- [ ] Get Gmail App Password (if using Gmail)
- [ ] Test email sending

---

## 🔗 Webhook Setup (Optional but Recommended)

### For Real-time Payment Updates
- [ ] Have publicly accessible URL (use ngrok for local testing)
- [ ] Go to Razorpay Dashboard → Settings → Webhooks
- [ ] Click "Create New Webhook"
- [ ] Add URL: `https://yourdomain.com/api/payment/webhook`
- [ ] Select events:
  - [ ] payment.authorized
  - [ ] payment.captured
  - [ ] payment.failed
  - [ ] refund.processed
- [ ] Copy Webhook Secret
- [ ] Add to `.env`:
  ```env
  RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
  ```
- [ ] Test webhook with Razorpay test events

---

## 📋 Verification Checklist

### Backend Verification
- [ ] Server starts without errors
- [ ] Database connected
- [ ] All routes working
- [ ] Payment controller accessible
- [ ] Order controller accessible
- [ ] Razorpay service initialized
- [ ] Environment variables loaded

### Frontend Verification
- [ ] Client starts without errors
- [ ] Can navigate to checkout
- [ ] Razorpay script loads
- [ ] Form validation works
- [ ] API calls successful
- [ ] Payment modal opens
- [ ] Success/error handling works

### Database Verification
- [ ] Orders table has GST fields
- [ ] Payments table has Razorpay fields
- [ ] Foreign keys working
- [ ] Indexes created
- [ ] Test order created successfully
- [ ] Test payment recorded correctly

---

## 🐛 Troubleshooting

### Common Issues

#### "Payment gateway not configured"
**Check:**
- [ ] RAZORPAY_KEY_ID in .env
- [ ] RAZORPAY_KEY_SECRET in .env
- [ ] No extra spaces in .env
- [ ] Server restarted after adding keys

#### Razorpay checkout doesn't open
**Check:**
- [ ] Razorpay script loaded (check browser console)
- [ ] No JavaScript errors
- [ ] API response contains razorpayOrderId
- [ ] razorpayKeyId is correct

#### Payment succeeds but order not updated
**Check:**
- [ ] Signature verification passing
- [ ] RAZORPAY_KEY_SECRET correct
- [ ] No errors in server console
- [ ] Database connection working

#### Video URL validation fails
**Check:**
- [ ] URL format: https://youtube.com/watch?v=xxxxx
- [ ] Supported formats in code
- [ ] No extra characters
- [ ] Proper URL encoding

---

## 🚀 Ready to Go Live?

### Production Checklist

#### Razorpay Account
- [ ] KYC completed
- [ ] Business verification done
- [ ] Live keys generated (rzp_live_xxxxx)

#### Environment
- [ ] Update .env with live keys
- [ ] HTTPS enabled
- [ ] Domain configured
- [ ] SSL certificate installed

#### Webhook
- [ ] Production webhook URL configured
- [ ] Webhook secret updated
- [ ] Test events passing

#### Testing
- [ ] Test with real small amount (₹1)
- [ ] Verify payment success
- [ ] Verify order update
- [ ] Verify email sending
- [ ] Test refund process

#### Monitoring
- [ ] Error logging setup
- [ ] Payment monitoring
- [ ] Alert system configured
- [ ] Backup system ready

---

## 📊 Post-Deployment Verification

### After Going Live
- [ ] Process first real payment
- [ ] Verify in Razorpay dashboard
- [ ] Check order in database
- [ ] Confirm email sent
- [ ] Test refund if needed
- [ ] Monitor for errors
- [ ] Check webhook logs

---

## 📞 Support

### If You Need Help

#### Documentation
- [ ] Read RAZORPAY_INTEGRATION_GUIDE.md
- [ ] Check PAYMENT_API_DOCS.md
- [ ] Review code comments

#### Razorpay
- [ ] Dashboard: https://dashboard.razorpay.com
- [ ] Docs: https://razorpay.com/docs/
- [ ] Support: support@razorpay.com

#### Debugging
- [ ] Check server logs
- [ ] Check browser console
- [ ] Review Razorpay dashboard
- [ ] Test with different payment methods

---

## ✅ Final Checklist

Before considering integration complete:

### Functionality
- [ ] Users can complete payments
- [ ] Admins can manage orders
- [ ] Payment history visible
- [ ] GST calculated correctly
- [ ] Status updates working
- [ ] Refunds processed successfully

### Security
- [ ] Secrets in environment variables
- [ ] Signature verification working
- [ ] No sensitive data in logs
- [ ] HTTPS in production

### User Experience
- [ ] Clear checkout flow
- [ ] Error messages helpful
- [ ] Success confirmations shown
- [ ] Mobile responsive
- [ ] Fast loading times

### Documentation
- [ ] Team knows how it works
- [ ] README updated
- [ ] API docs available
- [ ] Troubleshooting guide ready

---

## 🎉 Success!

If all items are checked:
- ✅ **Razorpay integration is complete!**
- ✅ **Ready to accept payments!**
- ✅ **Production-ready setup!**

---

**Need help? Check the comprehensive guides:**
- 📚 RAZORPAY_INTEGRATION_GUIDE.md
- 📚 RAZORPAY_QUICK_START.md
- 📚 PAYMENT_API_DOCS.md
- 📚 RAZORPAY_IMPLEMENTATION_SUMMARY.md

**Happy selling! 💰**
