# Database Seeding Instructions

## 🔒 Secure Seeding Process

### ⭐ RECOMMENDED: Sync Pricing Only (Safe - No Data Loss)

**Use this if you already have data in database:**

1. **Login as admin** at https://tubebirdspromotion.com/login
2. **Open browser console** (Press F12)
3. **Run this command:**

   ```javascript
   fetch('https://tubebirds-api.onrender.com/api/seed/sync-pricing', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': 'Bearer ' + localStorage.getItem('token')
     }
   })
   .then(res => res.json())
   .then(data => console.log('✅ Sync Result:', data))
   ```

   **What it does:**
   - ✅ Updates existing pricing plans
   - ✅ Creates missing plans
   - ✅ **NO data loss** - keeps existing orders, users, etc.
   - ✅ Matches frontend prices exactly

---

### Option 1: Full Database Seed (⚠️ Clears All Data)

1. **Deploy your changes to Render** (already pushed)
2. **Wait for deployment** to complete (~5-10 minutes)
3. **Login as admin** at https://tubebirdspromotion.com/login
   - Email: `tubebirdspromotion@gmail.com` or your admin email
   - Password: Your admin password

4. **Call the seed endpoint** using browser console or Postman:

   **Using Browser Console (F12):**
   ```javascript
   fetch('https://tubebirds-api.onrender.com/api/seed/initialize', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': 'Bearer ' + localStorage.getItem('token')
     }
   })
   .then(res => res.json())
   .then(data => console.log(data))
   ```

   **Using Postman:**
   - URL: `POST https://tubebirds-api.onrender.com/api/seed/initialize`
   - Headers: 
     - `Authorization: Bearer YOUR_ADMIN_TOKEN`
     - `Content-Type: application/json`
   - Click Send

### Option 2: Direct Script (Local Development)

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Run the seed script:**
   ```bash
   npm run seed
   ```

   Or directly:
   ```bash
   node seeds/seedData.js
   ```

## 📊 What Gets Seeded

### Services (4 items):
- YouTube Views
- YouTube Subscribers
- YouTube Likes
- YouTube Watch Time

### Pricing Plans (5+ items per category):

**Views Plans:**
- ₹750 - Starter Views (5,000+ Views)
- ₹1,500 - Growth Booster (10,000+ Views) ⭐ POPULAR
- ₹2,600 - Pro Package (20,000+ Views)
- ₹5,500 - Elite Package (50,000+ Views) ⭐ POPULAR
- ₹10,000 - Mega Viral (1 Lakh+ Views)

**Subscribers Plans:**
- Coming soon (use frontend hardcoded data for now)

### Portfolio Items:
- Sample success stories
- Client testimonials

### Admin User:
- Email: `tubebirdspromotion@gmail.com`
- Password: Set in `.env` file

## ✅ Verification

After seeding, verify:

1. **Check Services:**
   ```
   GET https://tubebirds-api.onrender.com/api/services
   ```

2. **Check Pricing:**
   ```
   GET https://tubebirds-api.onrender.com/api/pricing
   ```

3. **Login to admin dashboard** and navigate to:
   - Services management
   - Pricing management
   - Portfolio management

## 🔐 Security Features

- ✅ Admin authentication required
- ✅ No public seed endpoint
- ✅ JWT token verification
- ✅ Role-based access control
- ✅ Prevents duplicate seeding

## 🚨 Important Notes

1. **One-time operation**: Seeding clears existing data (use `force: true`)
2. **Backup data first** if you have production data
3. **Update prices** via admin dashboard after seeding
4. **Frontend plans** will work even without database (uses planDetails)

## 🛠️ Troubleshooting

**Error: "Invalid secret key"**
- Solution: Old version, update to use admin auth (already fixed)

**Error: "Pricing plan not found"**
- Solution: Frontend uses planDetails fallback (already implemented)

**Error: "401 Unauthorized"**
- Solution: Login as admin first, get token from localStorage

**Database connection error:**
- Solution: Check Render database is running
- Verify DB credentials in Render environment variables
