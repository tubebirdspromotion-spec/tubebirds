# TubeBirds - Complete Project Documentation

## 📚 Project Overview

TubeBirds is a full-stack MERN application for a YouTube promotion agency. The project includes a public-facing website, client dashboard, and admin panel with payment integration.

## 🏗️ Architecture

### Technology Stack

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Razorpay Payment Integration
- Security: Helmet, Rate Limiting, XSS Protection

**Frontend:**
- React 18
- Vite (Build Tool)
- Redux Toolkit (State Management)
- React Router v6
- Tailwind CSS
- Framer Motion (Animations)
- React Parallax
- Recharts (Analytics)

## 📁 Project Structure

```
TubeBirds/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── dashboard/         # Dashboard components
│   │   │   └── home/              # Home page components
│   │   ├── pages/                 # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Pricing.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── client/           # Client dashboard pages
│   │   │   └── admin/            # Admin dashboard pages
│   │   ├── layouts/              # Layout components
│   │   ├── store/                # Redux store
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   ├── services/             # API services
│   │   └── utils/                # Utility functions
│   ├── public/
│   └── package.json
│
├── server/                         # Node.js Backend
│   ├── models/                    # MongoDB models
│   │   ├── User.js
│   │   ├── Service.js
│   │   ├── Pricing.js
│   │   ├── Order.js
│   │   ├── Portfolio.js
│   │   └── Contact.js
│   ├── routes/                    # API routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── pricingRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── portfolioRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── dashboardRoutes.js
│   ├── controllers/               # Route controllers
│   ├── middleware/                # Custom middleware
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── config/                    # Configuration
│   │   └── db.js
│   ├── utils/                     # Utility functions
│   ├── seeds/                     # Database seeders
│   │   └── seed.js
│   ├── server.js                  # Entry point
│   └── package.json
│
└── package.json                   # Root package.json
```

## 🚀 Installation & Setup

### Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (v6 or higher) - Running locally or MongoDB Atlas
3. **Git**

### Step 1: Clone & Install

```powershell
# Navigate to your project directory
cd "C:\Users\himan\OneDrive\Desktop\TubeBirds"

# Install all dependencies (root, server, and client)
npm run install-all
```

### Step 2: Environment Configuration

#### Server Environment (.env in server folder)

Create `server/.env` file:

```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/tubebirds

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d

# Frontend URL
CLIENT_URL=http://localhost:5173

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Credentials (for seeding)
ADMIN_EMAIL=admin@tubebirds.com
ADMIN_PASSWORD=Admin@123
ADMIN_NAME=Admin User
```

#### Client Environment (.env in client folder)

Create `client/.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Step 3: Database Setup

```powershell
# Make sure MongoDB is running
# Then seed the database with initial data
npm run seed
```

This will create:
- Admin user (admin@tubebirds.com / Admin@123)
- 6 Service entries
- 9 Pricing plans
- Sample portfolio items

### Step 4: Start Development Servers

```powershell
# Start both frontend and backend concurrently
npm run dev
```

Or start them separately:

```powershell
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

## 🌐 Access Points

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Admin Panel:** http://localhost:5173/admin
- **Client Dashboard:** http://localhost:5173/dashboard

## 🔐 Default Credentials

**Admin Login:**
- Email: admin@tubebirds.com
- Password: Admin@123

## 📋 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user
- PUT `/api/auth/update-profile` - Update profile
- PUT `/api/auth/update-password` - Update password

### Services
- GET `/api/services` - Get all services
- GET `/api/services/:slug` - Get service by slug
- POST `/api/services` - Create service (Admin)
- PUT `/api/services/:id` - Update service (Admin)
- DELETE `/api/services/:id` - Delete service (Admin)

### Pricing
- GET `/api/pricing` - Get all pricing plans
- GET `/api/pricing/:id` - Get single plan
- POST `/api/pricing` - Create plan (Admin)
- PUT `/api/pricing/:id` - Update plan (Admin)
- DELETE `/api/pricing/:id` - Delete plan (Admin)

### Orders
- GET `/api/orders` - Get all orders (filtered by role)
- GET `/api/orders/:id` - Get single order
- POST `/api/orders` - Create order
- PUT `/api/orders/:id` - Update order (Admin)
- PUT `/api/orders/:id/progress` - Update progress (Admin)
- POST `/api/orders/:id/notes` - Add note
- DELETE `/api/orders/:id` - Delete order (Admin)

### Payment
- POST `/api/payment/create-order` - Create Razorpay order
- POST `/api/payment/verify` - Verify payment
- GET `/api/payment/:paymentId` - Get payment details (Admin)
- POST `/api/payment/refund` - Process refund (Admin)

### Portfolio
- GET `/api/portfolio` - Get portfolio items
- GET `/api/portfolio/:id` - Get single item
- POST `/api/portfolio` - Create item (Admin)
- PUT `/api/portfolio/:id` - Update item (Admin)
- DELETE `/api/portfolio/:id` - Delete item (Admin)

### Contact
- POST `/api/contact` - Submit contact form
- GET `/api/contact` - Get all contacts (Admin)
- GET `/api/contact/:id` - Get single contact (Admin)
- PUT `/api/contact/:id` - Update status (Admin)
- DELETE `/api/contact/:id` - Delete contact (Admin)

### Dashboard
- GET `/api/dashboard/admin/stats` - Admin statistics
- GET `/api/dashboard/client/stats` - Client statistics

## 🎨 Features Implementation

### Frontend Features

1. **Landing Pages**
   - Home with parallax hero and enquiry form
   - About Us
   - Services (6 service detail pages)
   - Pricing (4 categories: Views, Subscribers, Monetization, Revenue)
   - Portfolio (Reports & Reviews)
   - Contact Us

2. **Client Dashboard**
   - Order tracking
   - Progress visualization
   - Payment history
   - Analytics charts

3. **Admin Panel**
   - Order management
   - Client management
   - Service management
   - Pricing management
   - Portfolio management
   - Analytics (monthly/yearly/all-time)
   - Revenue tracking

4. **UI/UX**
   - Parallax effects
   - Framer Motion animations
   - Smooth transitions
   - Responsive design
   - Modern Tailwind CSS styling

### Backend Features

1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control (Admin/Client)
   - Password hashing with bcrypt

2. **Payment Integration**
   - Razorpay integration
   - Order creation
   - Payment verification
   - Refund processing

3. **Database**
   - MongoDB with Mongoose
   - Data validation
   - Relationships between collections

4. **Security**
   - Helmet.js for security headers
   - Rate limiting
   - XSS protection
   - MongoDB sanitization

## 🔧 Development Workflow

### Adding New Features

1. **Backend (API)**
   - Create model in `server/models/`
   - Create controller in `server/controllers/`
   - Create routes in `server/routes/`
   - Add routes to `server/server.js`

2. **Frontend (React)**
   - Create Redux slice in `client/src/store/slices/`
   - Add to store in `client/src/store/store.js`
   - Create components in `client/src/components/`
   - Create pages in `client/src/pages/`
   - Add routes in `client/src/App.jsx`

### Testing

```powershell
# Test API endpoints
# Use Postman or Thunder Client

# Test frontend
npm run client
```

## 📦 Deployment

### Backend Deployment (Railway/Render/Heroku)

1. Set environment variables
2. Update `MONGODB_URI` to production database
3. Update `CLIENT_URL` to production frontend URL
4. Deploy using platform-specific commands

### Frontend Deployment (Vercel/Netlify)

1. Build the client:
```powershell
cd client
npm run build
```

2. Deploy `client/dist` folder
3. Set environment variables in platform settings

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **Port Already in Use**
   - Change PORT in server `.env`
   - Check if another process is using the port

3. **CORS Issues**
   - Verify CLIENT_URL in server `.env`
   - Check CORS configuration in `server/server.js`

4. **Payment Integration Issues**
   - Verify Razorpay credentials
   - Check webhook URL configuration

## 📞 Support

For issues or questions, please check:
1. README.md file
2. Code comments
3. API documentation in this file

## 🔄 Future Enhancements

- Email notifications
- SMS notifications
- Advanced analytics
- Multi-language support
- Dark mode
- PWA features
- Social media integration
- Blog section
- Affiliate program
- API documentation with Swagger

## 📄 License

MIT License
