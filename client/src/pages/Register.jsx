import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FaYoutube, FaUser, FaEnvelope, FaPhone, FaLock, FaRocket, FaStar, FaTrophy, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { register as registerUser } from '../store/slices/authSlice'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [emailValidation, setEmailValidation] = useState({
    isValid: null,
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailValidation({ isValid: null, message: '' })
      return
    }
    
    if (!emailRegex.test(email)) {
      setEmailValidation({ 
        isValid: false, 
        message: 'Invalid email format' 
      })
      return
    }

    // Check for common email providers
    const commonProviders = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'protonmail.com']
    const domain = email.split('@')[1]?.toLowerCase()
    
    if (commonProviders.includes(domain)) {
      setEmailValidation({ 
        isValid: true, 
        message: 'Valid email address' 
      })
    } else {
      setEmailValidation({ 
        isValid: true, 
        message: 'Email looks valid' 
      })
    }
  }

  // Email change handler with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      validateEmail(formData.email)
    }, 500)
    return () => clearTimeout(timer)
  }, [formData.email])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate email
    if (!emailValidation.isValid) {
      toast.error('Please enter a valid email address')
      return
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    // Validate password strength
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      setIsSubmitting(true)
      const result = await dispatch(registerUser(formData)).unwrap()
      
      // Show success message
      toast.success('Registration successful! Welcome to TubeBirds!')
      
      // Wait a brief moment for the auth state to update
      setTimeout(() => {
        // Navigate based on user role
        if (result?.data?.user?.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/dashboard')
        }
      }, 500)
    } catch (error) {
      toast.error(error || 'Registration failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const features = [
    { icon: <FaRocket className="text-2xl" />, title: 'Quick Growth', desc: 'See results in 24-48 hours' },
    { icon: <FaStar className="text-2xl" />, title: '100% Safe', desc: 'YouTube policy compliant' },
    { icon: <FaTrophy className="text-2xl" />, title: 'Premium Support', desc: '24/7 expert assistance' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 270, 360],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-400 to-red-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [360, 270, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-red-400 to-orange-400 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen py-8 sm:py-12 px-4">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl w-full">
          {/* Left Side - Branding & Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex flex-col justify-center text-white"
          >
            <div className="bg-gradient-to-br from-orange-600 via-red-600 to-red-700 rounded-3xl p-12 shadow-2xl">
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

              <h1 className="text-4xl font-bold mb-4">Join TubeBirds Today!</h1>
              <p className="text-white/90 text-lg mb-8">Create your account and start your YouTube growth journey with India's most trusted promotion service.</p>

              <div className="space-y-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-2xl"
                  >
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                      <p className="text-white/80 text-sm">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
                <p className="text-sm text-white/90 italic">
                  "TubeBirds helped me reach 100K subscribers in just 6 months! Highly recommended!"
                </p>
                <p className="text-white font-semibold mt-2">- Rohit Kumar, Tech YouTuber</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Registration Form */}
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
                <p className="text-gray-600">Start your YouTube growth journey</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

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
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl outline-none transition-all ${
                        emailValidation.isValid === null 
                          ? 'border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                          : emailValidation.isValid
                          ? 'border-green-400 focus:ring-2 focus:ring-green-500 focus:border-green-500'
                          : 'border-red-400 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                      }`}
                      placeholder="your@email.com"
                    />
                    {emailValidation.isValid !== null && (
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        {emailValidation.isValid ? (
                          <FaCheckCircle className="text-green-500 text-xl" />
                        ) : (
                          <FaTimesCircle className="text-red-500 text-xl" />
                        )}
                      </div>
                    )}
                  </div>
                  {emailValidation.message && (
                    <p className={`text-sm mt-1 ${emailValidation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                      {emailValidation.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                      placeholder="9876543210"
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

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-sm mt-1 text-red-600">
                      Passwords do not match
                    </p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting || !emailValidation.isValid}
                  className="w-full bg-gradient-to-r from-orange-600 via-red-600 to-red-700 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    'Creating Account...'
                  ) : (
                    <>
                      <span>Create Account</span>
                      <FaRocket />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-red-600 hover:text-red-700 font-bold hover:underline">
                    Sign in
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

export default Register
