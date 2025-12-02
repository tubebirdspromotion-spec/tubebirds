import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FaYoutube, FaEnvelope, FaLock, FaArrowRight, FaCheckCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { login } from '../store/slices/authSlice'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const result = await dispatch(login(formData)).unwrap()
      toast.success('Login successful!')
      
      // Redirect based on role
      if (result.data.user.role === 'admin') {
        navigate('/admin')
      } else {
        // Regular users stay on main website
        navigate('/')
      }
    } catch (error) {
      toast.error(error || 'Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const benefits = [
    'Boost Your YouTube Views',
    'Grow Subscribers Organically',
    'Monetize Your Channel Faster',
    '24/7 Expert Support'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-red-400 to-orange-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-orange-400 to-red-400 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen py-8 sm:py-12 px-4">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl w-full">
          {/* Left Side - Branding & Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex flex-col justify-center text-white"
          >
            <div className="bg-gradient-to-br from-red-600 via-red-700 to-orange-600 rounded-3xl p-12 shadow-2xl">
              {/* TubeBirds Logo */}
              <Link to="/" className="flex items-center gap-3 mb-8 group">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow"
                >
                  <FaYoutube className="text-white text-3xl" />
                </motion.div>
                <div>
                  <div className="text-3xl font-extrabold tracking-tight">
                    <span className="text-white">Tube</span>
                    <span className="text-orange-300">Birds</span>
                  </div>
                  <div className="text-sm text-white/80 font-semibold tracking-wide">Grow With Confidence</div>
                </div>
              </Link>

              <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
              <p className="text-white/90 text-lg mb-8">Sign in to continue growing your YouTube channel with our premium services.</p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                      <FaCheckCircle className="text-orange-300" />
                    </div>
                    <span className="text-white/90 font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center"
          >
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
              {/* Mobile Logo */}
              <Link to="/" className="flex lg:hidden items-center justify-center gap-3 mb-8 group">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="w-14 h-14 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow"
                >
                  <FaYoutube className="text-white text-2xl" />
                </motion.div>
                <div>
                  <div className="text-2xl font-extrabold tracking-tight">
                    <span className="text-gray-900">Tube</span>
                    <span className="text-red-600">Birds</span>
                  </div>
                  <div className="text-xs text-gray-500 font-semibold -mt-1 tracking-wide">Grow With Confidence</div>
                </div>
              </Link>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
                <p className="text-gray-600">Sign in to access your dashboard</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {/* Remember me checkbox can go here */}
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-red-600 via-red-700 to-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    'Signing in...'
                  ) : (
                    <>
                      <span>Sign In</span>
                      <FaArrowRight />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-red-600 hover:text-red-700 font-bold hover:underline">
                    Sign up now
                  </Link>
                </p>
              </div>

              <div className="mt-6 text-center">
                <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  ← Back to Home
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Login
