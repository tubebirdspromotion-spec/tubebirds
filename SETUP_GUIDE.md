# 🚀 TubeBirds - Quick Start Guide

This guide will help you set up and run the TubeBirds project step by step.

## ✅ Prerequisites Checklist

Before starting, make sure you have:

- [ ] **Node.js** installed (version 18 or higher)
  - Download from: https://nodejs.org/
  - Verify: Run `node --version` in PowerShell
  
- [ ] **MongoDB** installed and running
  - Option 1: Local MongoDB (https://www.mongodb.com/try/download/community)
  - Option 2: MongoDB Atlas (Cloud) - https://www.mongodb.com/cloud/atlas
  - Verify: Run `mongod --version` in PowerShell (if local)
  
- [ ] **Git** installed (optional, for version control)
  - Download from: https://git-scm.com/

- [ ] **Razorpay Account** (for payment integration)
  - Sign up at: https://razorpay.com/
  - Get your API keys from Dashboard

## 📥 Step 1: Install Dependencies

Open PowerShell and navigate to the project directory:

```powershell
cd "C:\Users\himan\OneDrive\Desktop\TubeBirds"

# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Return to root
cd ..
```

Or use the convenient script:

```powershell
npm run install-all
```

## ⚙️ Step 2: Configure Environment Variables

### Server Configuration

1. Navigate to the server folder:
```powershell
cd server
```

2. Copy the example env file:
```powershell
copy .env.example .env
```

3. Edit `server/.env` with your values:

**Required Variables:**
```env
MONGODB_URI=mongodb://localhost:27017/tubebirds
JWT_SECRET=change_this_to_a_very_long_random_string_123456789
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

**Optional Variables** (for production):
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Client Configuration

1. Navigate to the client folder:
```powershell
cd ../client
```

2. Copy the example env file:
```powershell
copy .env.example .env
```

3. Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

## 🗄️ Step 3: Setup Database

### Option A: Using Local MongoDB

1. Start MongoDB service:
```powershell
# Windows - Run as Administrator
net start MongoDB
```

2. Seed the database:
```powershell
cd "C:\Users\himan\OneDrive\Desktop\TubeBirds"
npm run seed
```

### Option B: Using MongoDB Atlas (Cloud)

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Get your connection string
3. Update `MONGODB_URI` in `server/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tubebirds
```
4. Seed the database:
```powershell
npm run seed
```

### ✅ Expected Seed Output

You should see:
```
✅ MongoDB Connected
✅ Admin user created successfully
   Email: admin@tubebirds.com
   Password: Admin@123
✅ Services seeded successfully
✅ Pricing plans seeded successfully
✅ Portfolio items seeded successfully
✅ Database seeding completed!
```

## 🏃 Step 4: Run the Application

### Option A: Run Everything Together (Recommended)

```powershell
cd "C:\Users\himan\OneDrive\Desktop\TubeBirds"
npm run dev
```

This starts both backend and frontend servers simultaneously.

### Option B: Run Separately

**Terminal 1 - Backend:**
```powershell
cd "C:\Users\himan\OneDrive\Desktop\TubeBirds"
npm run server
```

**Terminal 2 - Frontend:**
```powershell
cd "C:\Users\himan\OneDrive\Desktop\TubeBirds"
npm run client
```

## 🌐 Step 5: Access the Application

Once running, open your browser and visit:

### Public Website
- **Homepage:** http://localhost:5173
- **About:** http://localhost:5173/about
- **Services:** http://localhost:5173/services
- **Pricing:** http://localhost:5173/pricing
- **Portfolio:** http://localhost:5173/portfolio
- **Contact:** http://localhost:5173/contact

### Authentication
- **Login:** http://localhost:5173/login
- **Register:** http://localhost:5173/register

### Admin Panel
- **URL:** http://localhost:5173/admin
- **Email:** admin@tubebirds.com
- **Password:** Admin@123

### Client Dashboard
- **URL:** http://localhost:5173/dashboard
- First create a client account via registration

## 🧪 Step 6: Test the Application

### Test Admin Access

1. Go to http://localhost:5173/login
2. Login with:
   - Email: `admin@tubebirds.com`
   - Password: `Admin@123`
3. You should be redirected to http://localhost:5173/admin

### Test Client Registration

1. Go to http://localhost:5173/register
2. Create a new account
3. Login with your credentials
4. Access dashboard at http://localhost:5173/dashboard

### Test Order Flow

1. Login as a client
2. Go to Pricing page
3. Select a plan
4. Fill in the order form
5. Complete payment (test mode)

## 📝 Development Workflow

### Making Changes

1. **Backend Changes:**
   - Edit files in `server/` folder
   - Server auto-restarts with nodemon

2. **Frontend Changes:**
   - Edit files in `client/src/` folder
   - Browser auto-refreshes with Vite HMR

### Viewing Logs

- **Backend logs:** Check the terminal where server is running
- **Frontend logs:** Check browser console (F12)

## 🐛 Common Issues & Solutions

### Issue 1: MongoDB Connection Error

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
```powershell
# Start MongoDB service
net start MongoDB

# Or check if MongoDB is running:
mongod
```

### Issue 2: Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```powershell
# Find and kill the process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or change the port in server/.env:
PORT=5001
```

### Issue 3: Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```powershell
# Reinstall dependencies
cd server
rm -rf node_modules
npm install

cd ../client
rm -rf node_modules
npm install
```

### Issue 4: React Router Blank Page

**Solution:**
- Clear browser cache
- Check browser console for errors
- Ensure all page components are created

### Issue 5: API Calls Failing

**Solution:**
1. Check if backend is running
2. Verify `VITE_API_URL` in `client/.env`
3. Check Network tab in browser DevTools
4. Verify CORS settings in `server/server.js`

## 🔐 Important Security Notes

### Before Production:

1. **Change JWT Secret:**
   ```env
   JWT_SECRET=generate_a_very_long_random_string_at_least_32_characters
   ```

2. **Change Admin Password:**
   - Login to admin panel
   - Go to Profile
   - Change password from default

3. **Update Environment:**
   ```env
   NODE_ENV=production
   ```

4. **Use Production Database:**
   ```env
   MONGODB_URI=your_production_mongodb_url
   ```

5. **Get Production API Keys:**
   - Razorpay production keys
   - Email service credentials
   - Cloudinary production account

## 📚 Next Steps

1. **Customize Content:**
   - Update services in database
   - Add your pricing plans
   - Upload portfolio items
   - Customize about page content

2. **Add Your Branding:**
   - Replace logo
   - Update colors in `tailwind.config.js`
   - Add your social media links

3. **Configure Payment:**
   - Complete Razorpay KYC
   - Get production API keys
   - Set up webhook URL

4. **Deploy:**
   - See DOCUMENTATION.md for deployment guide
   - Configure production environment
   - Set up CI/CD pipeline

## 💡 Tips for Development

1. **Use Browser DevTools:**
   - F12 to open DevTools
   - Check Console for errors
   - Use Network tab to debug API calls

2. **Install Extensions:**
   - React Developer Tools
   - Redux DevTools
   - MongoDB Compass (Database GUI)

3. **Code Editor:**
   - VS Code recommended
   - Install ESLint extension
   - Install Prettier extension

## 📖 Additional Resources

- **React Documentation:** https://react.dev/
- **MongoDB Documentation:** https://docs.mongodb.com/
- **Express Documentation:** https://expressjs.com/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Razorpay Docs:** https://razorpay.com/docs/

## ❓ Getting Help

If you encounter issues:

1. Check error messages carefully
2. Review DOCUMENTATION.md
3. Check browser console
4. Verify environment variables
5. Ensure all services are running

## 🎉 Success!

If everything is working:
- ✅ Frontend loads at http://localhost:5173
- ✅ You can see the homepage
- ✅ Admin login works
- ✅ API responds at http://localhost:5000/api/health

**Congratulations! Your TubeBirds application is ready for development!**

---

**Happy Coding! 🚀**
