# Testing Guide - MongoDB to MySQL Migration

## Prerequisites Checklist

Before testing, ensure you have:

### 1. Database Credentials (Hostinger MySQL)
- [ ] `DB_HOST` - Get from Hostinger cPanel → MySQL Databases
- [ ] `DB_PASSWORD` - MySQL password for user `u422058511_vishal`
- [ ] Remote MySQL access enabled (if connecting from local machine)

### 2. Email Credentials (Hostinger SMTP)
- [ ] `SMTP_PASSWORD` - Email password for `noreply@tubebirdspromotion.com`
- [ ] Email account verified and active

### 3. Update `.env` File
```bash
# Update these values in server/.env:
DB_HOST=mysql-host-from-hostinger.com  # Get from cPanel
DB_PASSWORD=your_actual_mysql_password
SMTP_PASSWORD=your_actual_email_password
```

---

## Testing Steps

### Step 1: Database Connection Test

```bash
cd server
npm run dev
```

**Expected Output:**
```
✅ MySQL Database connected successfully
✅ Database synced
✅ Email service is ready to send messages
🚀 Server running on port 5000
```

**If Connection Fails:**
1. Check `DB_HOST` - should be from Hostinger cPanel, not "localhost"
2. Verify `DB_PASSWORD` is correct
3. Enable remote MySQL access in Hostinger:
   - cPanel → Remote MySQL
   - Add your IP or use wildcard `%` (less secure)

### Step 2: Check Database Tables Created

After successful connection, Sequelize should auto-create tables:

**Expected Tables:**
- users
- orders
- services
- pricings
- portfolios
- contacts
- consultations
- reviews
- payments

**Verify in Hostinger:**
- cPanel → phpMyAdmin
- Database: `u422058511_tubebirds`
- Check if all 9 tables exist

### Step 3: Test API Endpoints

Use Postman or Thunder Client:

#### Test 1: Health Check
```http
GET http://localhost:5000/api/health
```
**Expected Response:**
```json
{
  "status": "success",
  "message": "Server is running",
  "database": "connected",
  "timestamp": "2025-01-XX..."
}
```

#### Test 2: User Registration (with Email Verification)
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test@123",
  "phone": "1234567890"
}
```

**Expected:**
1. User created in database
2. Verification email sent to `test@example.com`
3. Check email inbox (and spam folder)

**Response:**
```json
{
  "status": "success",
  "token": "jwt_token_here...",
  "data": {
    "user": {
      "id": 1,
      "name": "Test User",
      "email": "test@example.com",
      "role": "client",
      "isVerified": false
    }
  }
}
```

#### Test 3: Contact Form Submission (Admin Notification)
```http
POST http://localhost:5000/api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "subject": "Test Contact",
  "message": "Testing contact form"
}
```

**Expected:**
1. Contact saved in database
2. Admin notification email sent to `admin@tubebirdspromotion.com`

#### Test 4: Consultation Request (Admin Notification)
```http
POST http://localhost:5000/api/consultations
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "1122334455",
  "serviceInterest": "YouTube Views",
  "message": "I want to grow my channel"
}
```

**Expected:**
1. Consultation saved in database
2. Admin notification email sent

#### Test 5: Get Services (Public)
```http
GET http://localhost:5000/api/services
```

**Expected:**
Empty array (no data seeded yet)

---

## Email Testing

### 1. Check Email Delivery

After registration/contact/consultation:
- Check recipient inbox
- Check spam/junk folder
- Verify HTML rendering

### 2. Email Template Checklist

- [ ] Welcome Email - Professional design
- [ ] Verification Email - Link works (when clicked)
- [ ] Contact Notification - Admin receives
- [ ] Consultation Notification - Admin receives

### 3. Common Email Issues

**If emails not sending:**
1. Check SMTP credentials in `.env`
2. Verify `SMTP_USER` and `SMTP_PASSWORD`
3. Check Hostinger email account is active
4. Review server console for email errors

**If emails in spam:**
- Normal for new domains
- Add SPF/DKIM records in Hostinger DNS (production)
- Use domain email (noreply@tubebirdspromotion.com) not Gmail

---

## Database Query Testing

### Test Sequelize Queries

Create a test file: `server/test-db.js`

```javascript
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Order from './models/Order.js';
import Service from './models/Service.js';
import './models/index.js'; // Load associations

async function testDatabase() {
  try {
    await connectDB();
    
    // Test 1: Count users
    const userCount = await User.count();
    console.log('Total users:', userCount);
    
    // Test 2: Find all services
    const services = await Service.findAll({
      where: { isActive: true },
      order: [['order', 'ASC']]
    });
    console.log('Active services:', services.length);
    
    // Test 3: Test association (Order with User)
    const orders = await Order.findAll({
      include: [
        { model: User, as: 'customer', attributes: ['name', 'email'] }
      ],
      limit: 5
    });
    console.log('Orders with customers:', orders.length);
    
    console.log('✅ All database tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
}

testDatabase();
```

Run:
```bash
node server/test-db.js
```

---

## Troubleshooting

### Issue: "Access denied for user"
**Solution:**
- Verify DB_PASSWORD in .env
- Check MySQL user permissions in cPanel

### Issue: "Can't connect to MySQL server"
**Solution:**
- Update DB_HOST with correct Hostinger host
- Enable remote MySQL access
- Check firewall settings

### Issue: "Emails not sending"
**Solution:**
- Verify SMTP_PASSWORD
- Check email account quota in Hostinger
- Review server logs for specific errors

### Issue: "Table doesn't exist"
**Solution:**
- Ensure `sequelize.sync({ alter: true })` runs
- Check server startup logs
- Manually create tables using phpMyAdmin if needed

---

## Production Checklist

Before deploying to production:

### Database:
- [ ] Change `DB_HOST` to production host
- [ ] Use strong `DB_PASSWORD`
- [ ] Set `sequelize.sync({ force: false })`
- [ ] Enable SSL for MySQL connection

### Email:
- [ ] Use production email account
- [ ] Configure SPF/DKIM records
- [ ] Test all email templates
- [ ] Set up email monitoring

### Security:
- [ ] Change `JWT_SECRET` to strong random string
- [ ] Enable HTTPS only
- [ ] Configure CORS for production domain
- [ ] Rate limiting configured

### Environment:
- [ ] Set `NODE_ENV=production`
- [ ] Remove development logging
- [ ] Configure error monitoring (Sentry)
- [ ] Set up backup strategy

---

## Next Steps After Testing

1. **Seed Sample Data:**
   - Create sample services, pricing plans
   - Add portfolio items
   - Test order flow end-to-end

2. **Frontend Integration:**
   - Update API endpoints
   - Test new routes (consultations, reviews)
   - Implement email verification UI

3. **Deployment:**
   - Follow DEPLOYMENT_PLAN.md
   - Deploy to Render (backend)
   - Deploy to Netlify (frontend)
   - Configure domain on Hostinger

---

**Current Status:** ✅ Migration Complete - Ready for Testing  
**Required:** DB credentials, Email credentials  
**Next:** Test → Frontend Updates → Deploy
