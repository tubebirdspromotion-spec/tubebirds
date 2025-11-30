import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'
import AdminLayout from './layouts/AdminLayout'

// Public Pages
import HomePage from './pages/Home'
import AboutPage from './pages/About'
import ServicesPage from './pages/Services'
import ServiceDetailPage from './pages/ServiceDetail'
import PricingPage from './pages/Pricing'
import PortfolioPage from './pages/Portfolio'
import ContactPage from './pages/Contact'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import CheckoutPage from './pages/Checkout'

// Policy Pages
import PrivacyPolicyPage from './pages/PrivacyPolicy'
import TermsConditionsPage from './pages/TermsConditions'
import RefundPolicyPage from './pages/RefundPolicy'
import DisclaimerPage from './pages/Disclaimer'

// Client Dashboard Pages
import ClientDashboard from './pages/client/Dashboard'
import ClientOrders from './pages/client/Orders'
import ClientOrderDetail from './pages/client/OrderDetail'
import ClientProfile from './pages/client/Profile'

// Admin Dashboard Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminOrders from './pages/admin/Orders'
import AdminOrderDetail from './pages/admin/OrderDetail'
import AdminUsers from './pages/admin/Users'
import AdminServices from './pages/admin/Services'
import AdminPricing from './pages/admin/Pricing'
import AdminPortfolio from './pages/admin/Portfolio'
import AdminContacts from './pages/admin/Contacts'

import ProtectedRoute from './components/ProtectedRoute'
import { loadUser } from './store/slices/authSlice'

function App() {
  const dispatch = useDispatch()
  const { token, user } = useSelector((state) => state.auth)

  useEffect(() => {
    // Load user data if token exists but user data is missing
    if (token && !user) {
      dispatch(loadUser())
    }
  }, [dispatch, token, user])

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="services/:slug" element={<ServiceDetailPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        {/* Policy Pages */}
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="terms-conditions" element={<TermsConditionsPage />} />
        <Route path="refund-policy" element={<RefundPolicyPage />} />
        <Route path="disclaimer" element={<DisclaimerPage />} />
      </Route>

      {/* Checkout Route - Protected */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute allowedRoles={['client', 'admin']}>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />

      {/* Client Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ClientDashboard />} />
        <Route path="orders" element={<ClientOrders />} />
        <Route path="orders/:id" element={<ClientOrderDetail />} />
        <Route path="profile" element={<ClientProfile />} />
      </Route>

      {/* Admin Dashboard Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<AdminOrderDetail />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="pricing" element={<AdminPricing />} />
        <Route path="portfolio" element={<AdminPortfolio />} />
        <Route path="contacts" element={<AdminContacts />} />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary-600">404</h1>
          <p className="text-2xl mt-4">Page Not Found</p>
          <a href="/" className="btn btn-primary mt-6">Go Home</a>
        </div>
      </div>} />
    </Routes>
  )
}

export default App
