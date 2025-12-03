# Razorpay Payment Integration Guide

## Overview
This guide will help you integrate Razorpay payment gateway into the TubeBirds application following industry best practices.

## Features Implemented

### ✅ Core Features
- **Secure Payment Processing** with Razorpay
- **18% GST Calculation** automatically applied to all orders
- **Video URL Validation** before payment (YouTube URL required)
- **Payment Verification** with signature validation
- **Webhook Support** for real-time payment updates
- **Payment History** for users and admins
- **Invoice Generation** with unique invoice numbers
- **Order Status Management** by admin
- **Refund Support** through admin dashboard

### ✅ Security Features
- SHA256 signature verification
- Webhook signature validation
- Environment-based configuration
- Secure API endpoints
- Role-based access control

---

## 🚀 Setup Instructions

### Step 1: Create Razorpay Account

1. Go to [https://razorpay.com](https://razorpay.com)
2. Sign up for a free account
3. Complete KYC verification (required for live mode)
4. Access your dashboard at [https://dashboard.razorpay.com](https://dashboard.razorpay.com)

### Step 2: Get API Keys

#### Test Mode Keys (for development)
1. Go to **Settings** → **API Keys**
2. Generate Test Keys
3. Copy **Key ID** (starts with `rzp_test_`)
4. Copy **Key Secret**

#### Live Mode Keys (for production)
1. Complete KYC verification
2. Switch to **Live Mode** in dashboard
3. Go to **Settings** → **API Keys**
4. Generate Live Keys
5. Copy **Key ID** (starts with `rzp_live_`)
6. Copy **Key Secret**

⚠️ **Important**: Never commit live keys to version control!

### Step 3: Configure Environment Variables

Copy `.env.example` to `.env` and update:

```bash
# In server/.env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### Step 4: Set Up Webhooks (Recommended)

Webhooks allow Razorpay to notify your server about payment events in real-time.

1. Go to **Settings** → **Webhooks** in Razorpay Dashboard
2. Click **Create New Webhook**
3. Enter your webhook URL: `https://yourdomain.com/api/payment/webhook`
4. Select events to subscribe:
   - `payment.authorized`
   - `payment.captured`
   - `payment.failed`
   - `refund.processed`
5. Copy the **Webhook Secret** and add to `.env`:
   ```
   RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

### Step 5: Test the Integration

1. **Start the server:**
   ```bash
   cd server
   npm install
   npm start
   ```

2. **Start the client:**
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Test Payment Flow:**
   - Navigate to pricing page
   - Select a plan
   - Enter YouTube video URL (required)
   - Click "Proceed to Secure Payment"
   - Use Razorpay test cards

---

## 🧪 Test Payment Details

### Test Cards (Razorpay)

**Successful Payment:**
- Card: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits
- Name: Any name

**Failed Payment:**
- Card: `4000 0000 0000 0002`
- Expiry: Any future date
- CVV: Any 3 digits

**3D Secure Flow:**
- Card: `5104 0600 0000 0008`
- Will show 3D Secure authentication page

### Test UPI IDs
- Success: `success@razorpay`
- Failure: `failure@razorpay`

### Test Net Banking
- Select any bank
- Use credentials provided on test page

---

## 📊 Payment Flow Diagram

```
User Selects Plan
    ↓
Enters Video URL (Required) ← Validated before payment
    ↓
Clicks "Proceed to Payment"
    ↓
Server creates Razorpay Order (with GST)
    ↓
Razorpay Checkout Opens
    ↓
User completes payment
    ↓
Razorpay sends payment details
    ↓
Server verifies signature
    ↓
Order status updated to "Processing"
    ↓
Payment record created
    ↓
Confirmation emails sent
    ↓
User redirected to dashboard
```

---

## 💰 GST Calculation

All prices automatically include 18% GST:

```javascript
Base Amount: ₹1000
GST (18%): ₹180
Total: ₹1180
```

**Implementation:**
- GST is calculated on server-side
- Breakdown shown on checkout page
- Stored in database for reporting
- Included in invoices

---

## 🔐 Security Best Practices

### ✅ What We've Implemented

1. **Signature Verification**
   ```javascript
   // Every payment is verified using HMAC SHA256
   const signature = crypto
     .createHmac('sha256', RAZORPAY_KEY_SECRET)
     .update(orderId + '|' + paymentId)
     .digest('hex')
   ```

2. **Webhook Verification**
   ```javascript
   // Webhooks are verified before processing
   const isValid = razorpayService.verifyWebhookSignature(body, signature)
   ```

3. **Environment Variables**
   - All sensitive keys in `.env`
   - Never committed to Git
   - Different keys for test/production

4. **Database Security**
   - Payment details encrypted
   - Sensitive data masked in logs
   - Audit trail maintained

5. **API Security**
   - JWT authentication required
   - Role-based access control
   - Rate limiting enabled

---

## 📋 Admin Features

### Order Management
- View all orders with filters
- Update order status (pending → processing → completed)
- Add admin notes
- View payment details
- Access customer information

### Payment Management
- View all payment transactions
- Check payment status
- Process refunds
- Download payment reports
- Track GST collections

### Status Update Options
- **Pending**: Initial state after payment
- **Processing**: Payment verified, work not started
- **In Progress**: Work is ongoing
- **Completed**: Order fulfilled
- **Cancelled**: Order cancelled
- **Refunded**: Payment refunded

---

## 👤 User Features

### Checkout Experience
1. Select pricing plan
2. Enter YouTube video URL (mandatory)
3. Enter optional channel details
4. Review price breakdown (Base + GST)
5. Agree to terms
6. Secure Razorpay checkout
7. Multiple payment methods (Cards, UPI, Net Banking, Wallets)

### Dashboard Features
- View order history
- Track order status
- View payment details
- Download invoices
- Check progress

---

## 🔄 Refund Process

### Admin Initiates Refund

1. Navigate to order details
2. Click "Process Refund"
3. Enter refund amount (full or partial)
4. Add reason
5. Confirm refund

### Automatic Updates
- Payment status → "Refunded"
- Order status → "Refunded"
- User notified via email
- Refund processed by Razorpay (5-7 days)

---

## 📧 Email Notifications

Automated emails are sent for:
- ✉️ Payment confirmation
- ✉️ Order confirmation
- ✉️ Order status updates
- ✉️ Refund processed
- ✉️ Invoice generation

---

## 🐛 Troubleshooting

### Payment Fails but Money Deducted
- **Cause**: Network timeout during verification
- **Solution**: Payment will auto-refund in 5-7 days
- **Action**: Check Razorpay dashboard for payment status

### Webhook Not Working
- **Check**: Webhook URL is publicly accessible
- **Check**: Webhook secret is correct
- **Check**: Server is running and accessible
- **Debug**: Check webhook logs in Razorpay dashboard

### Signature Verification Failed
- **Check**: RAZORPAY_KEY_SECRET is correct
- **Check**: No extra spaces in .env file
- **Check**: Payment response not tampered

### Order Created but Payment Not Initiated
- **Check**: Razorpay script loaded (check browser console)
- **Check**: API keys are correct
- **Check**: No JavaScript errors

---

## 📊 Database Schema

### Orders Table
```javascript
{
  id, orderNumber, userId, pricingId,
  amount, baseAmount, gstAmount, gstRate,
  paymentStatus, paymentMethod, paymentId,
  status, channelDetails (videoUrl required),
  customerDetails, createdAt, updatedAt
}
```

### Payments Table
```javascript
{
  id, orderId, userId,
  razorpayOrderId, razorpayPaymentId, razorpaySignature,
  amount, baseAmount, gstAmount,
  status, paymentMode, invoiceNumber,
  paymentResponse, metadata,
  createdAt, updatedAt
}
```

---

## 🚀 Going Live

### Checklist Before Production

- [ ] Complete Razorpay KYC
- [ ] Switch to Live API keys
- [ ] Update webhook URL to production domain
- [ ] Configure production webhook secret
- [ ] Set up SSL certificate (HTTPS required)
- [ ] Update CLIENT_URL in .env
- [ ] Test live payment with small amount
- [ ] Set up payment monitoring/alerts
- [ ] Configure automated backups
- [ ] Set up error tracking (Sentry, etc.)

### Live Mode Configuration

```bash
# server/.env (Production)
NODE_ENV=production
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret_key
RAZORPAY_WEBHOOK_SECRET=your_live_webhook_secret
CLIENT_URL=https://yourdomain.com
```

---

## 📞 Support & Resources

### Razorpay Resources
- **Documentation**: https://razorpay.com/docs/
- **API Reference**: https://razorpay.com/docs/api/
- **Dashboard**: https://dashboard.razorpay.com
- **Support**: https://razorpay.com/support/

### Implementation Support
- Check webhook logs in Razorpay dashboard
- Review server logs for errors
- Test with different payment methods
- Use Razorpay test mode extensively

---

## ✅ What's Included

### Backend (Node.js/Express)
- ✅ Razorpay utility service
- ✅ Payment controller with verification
- ✅ Order controller with status management
- ✅ Webhook handling
- ✅ Refund processing
- ✅ Payment history API
- ✅ Invoice generation
- ✅ Email notifications

### Frontend (React)
- ✅ Checkout page with video URL validation
- ✅ Razorpay integration
- ✅ Payment history page
- ✅ Order management dashboard
- ✅ Admin status update modal
- ✅ GST breakdown display
- ✅ Responsive design

### Database
- ✅ Order model with GST fields
- ✅ Payment model with Razorpay fields
- ✅ Proper associations
- ✅ Indexes for performance

---

## 🎯 Best Practices Followed

1. **Security First**: All payments verified with signatures
2. **Error Handling**: Comprehensive error handling and logging
3. **User Experience**: Clear checkout flow with validation
4. **Admin Control**: Full order and payment management
5. **Transparency**: GST breakdown shown to users
6. **Reliability**: Webhook support for payment updates
7. **Compliance**: Proper invoice generation with GST
8. **Scalability**: Efficient database queries with indexes
9. **Testing**: Support for test mode before going live
10. **Documentation**: Comprehensive guides and comments

---

## 📝 Notes

- All amounts are stored in INR
- GST rate is 18% (configurable in .env)
- Video URL is mandatory before payment
- Payments are auto-captured
- Invoices have unique invoice numbers
- Webhook events are logged for debugging
- Refunds can be full or partial
- Admin can update order status manually
- Payment history available for users and admins

---

## 🆘 Need Help?

If you encounter any issues:

1. Check server and client console for errors
2. Verify all environment variables are set correctly
3. Ensure Razorpay keys are for correct mode (test/live)
4. Check webhook configuration in Razorpay dashboard
5. Review payment logs in Razorpay dashboard
6. Test with different payment methods
7. Verify database connections and migrations

For Razorpay-specific issues, contact Razorpay support with:
- Your merchant ID
- Transaction ID
- Error logs
- Screenshots (if applicable)

---

**🎉 You're all set! Start accepting payments with Razorpay!**
