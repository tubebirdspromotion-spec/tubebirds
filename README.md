# TubeBirds - YouTube Promotion Agency

A full-stack MERN application for YouTube promotion services with client dashboard and admin panel.

## 🚀 Features

### Frontend Features
- **Landing Pages**: Home, About Us, Services, Pricing, Portfolio, Contact Us
- **Animations**: Parallax effects, smooth transitions, Framer Motion animations
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Client Dashboard**: Order tracking, progress visualization, payment history
- **Admin Panel**: Order management, analytics, revenue tracking

### Backend Features
- **RESTful API**: Express.js with MongoDB
- **Authentication**: JWT-based authentication with role-based access control
- **Payment Integration**: Razorpay/Stripe payment gateway
- **Database**: MongoDB with Mongoose ODM

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository
2. Install all dependencies:
```bash
npm run install-all
```

3. Setup environment variables (see `.env.example` files in client and server folders)

4. Seed the database with admin user:
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:5173/admin
- **Client Dashboard**: http://localhost:5173/dashboard

## 📁 Project Structure

```
TubeBirds/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── layouts/       # Layout components
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   ├── utils/         # Utility functions
│   │   └── assets/        # Static assets
│   └── public/            # Public assets
├── server/                # Node.js + Express backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── config/           # Configuration files
│   ├── utils/            # Utility functions
│   └── seeds/            # Database seeders
└── package.json          # Root package.json

```

## 🔐 Default Admin Credentials

After running the seed script:
- **Email**: admin@tubebirds.com
- **Password**: Admin@123

## 🎨 Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Redux Toolkit
- React Router v6
- Axios
- Recharts / Chart.js

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Razorpay/Stripe

## 📝 License

MIT
