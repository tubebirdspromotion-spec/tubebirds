import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { FaYoutube, FaLock, FaCheckCircle, FaArrowLeft, FaCreditCard } from 'react-icons/fa'
import toast from 'react-hot-toast'
import api from '../services/api'

const Checkout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  
  const [plan, setPlan] = useState(null)
  const [formData, setFormData] = useState({
    youtubeUrl: '',
    channelName: '',
    agreeTerms: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    // Get plan from location state
    if (location.state?.plan) {
      setPlan(location.state.plan)
    } else {
      toast.error('No plan selected')
      navigate('/pricing')
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please login to continue')
      navigate('/login', { state: { from: location } })
    }
  }, [location, isAuthenticated, navigate])

  const validateYoutubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
    return youtubeRegex.test(url)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.youtubeUrl.trim()) {
      errors.youtubeUrl = 'YouTube URL is required'
    } else if (!validateYoutubeUrl(formData.youtubeUrl)) {
      errors.youtubeUrl = 'Please enter a valid YouTube URL'
    }
    
    if (!formData.channelName.trim()) {
      errors.channelName = 'Channel name is required'
    }
    
    if (!formData.agreeTerms) {
      errors.agreeTerms = 'You must agree to terms and conditions'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Create order
      const orderData = {
        serviceId: plan.serviceId || 1, // Default service ID
        pricingId: plan.pricingId || plan.id,
        planName: plan.name,
        quantity: plan.quantity,
        amount: plan.price,
        baseAmount: plan.price / 1.18, // Calculate base amount (before GST)
        gstRate: 18,
        gstAmount: plan.price - (plan.price / 1.18),
        youtubeUrl: formData.youtubeUrl,
        channelName: formData.channelName,
        requirements: {
          youtubeUrl: formData.youtubeUrl,
          channelName: formData.channelName,
          plan: plan.name,
          quantity: plan.quantity
        },
        status: 'pending'
      }

      const response = await api.post('/orders', orderData)
      const order = response.data.data.order

      // Simulate test payment (no actual payment gateway)
      toast.loading('Processing test payment...')
      
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create test payment record
      const paymentData = {
        orderId: order.id,
        amount: plan.price,
        gateway: 'test',
        transactionId: `TEST_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'success'
      }
      
      await api.post('/payment/verify', paymentData)
      
      toast.dismiss()
      toast.success('Test payment successful! 🎉')
      
      // Redirect to order details
      navigate(`/dashboard/orders/${order.id}`, { 
        state: { paymentSuccess: true } 
      })
      
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(error.response?.data?.message || 'Failed to process order')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft />
            <span>Back to Pricing</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order details</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Order Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaYoutube className="text-red-600" />
              Order Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* YouTube URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  YouTube Video/Channel URL *
                </label>
                <input
                  type="text"
                  name="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/watch?v=..."
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    validationErrors.youtubeUrl ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.youtubeUrl && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.youtubeUrl}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Paste the full URL of your YouTube video or channel
                </p>
              </div>

              {/* Channel Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Channel Name *
                </label>
                <input
                  type="text"
                  name="channelName"
                  value={formData.channelName}
                  onChange={handleInputChange}
                  placeholder="Your YouTube Channel Name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    validationErrors.channelName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.channelName && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.channelName}</p>
                )}
              </div>

              {/* User Info (Read-only) */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {user?.name}</p>
                  <p><span className="font-medium">Email:</span> {user?.email}</p>
                  {user?.phone && <p><span className="font-medium">Phone:</span> {user.phone}</p>}
                </div>
              </div>

              {/* Terms & Conditions */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <span className={`text-sm ${validationErrors.agreeTerms ? 'text-red-500' : 'text-gray-600'}`}>
                    I agree to the{' '}
                    <a href="/terms-conditions" target="_blank" className="text-red-600 hover:underline">
                      Terms & Conditions
                    </a>
                    {' '}and{' '}
                    <a href="/refund-policy" target="_blank" className="text-red-600 hover:underline">
                      Refund Policy
                    </a>
                  </span>
                </label>
                {validationErrors.agreeTerms && (
                  <p className="text-red-500 text-sm mt-1 ml-7">{validationErrors.agreeTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 rounded-lg font-bold text-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaCreditCard />
                {isSubmitting ? 'Processing...' : 'Proceed to Test Payment'}
              </button>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <FaLock className="text-green-600" />
                <span>This is a TEST payment - No actual charges</span>
              </div>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-24"
          >
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              {/* Plan Details */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {plan.icon}
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                </div>
                <p className="text-2xl font-bold text-red-600">{plan.quantity}</p>
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Amount:</span>
                  <span className="font-semibold">₹{(plan.price / 1.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST (18%):</span>
                  <span className="font-semibold">₹{(plan.price - (plan.price / 1.18)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total:</span>
                  <span className="text-red-600">₹{plan.price.toLocaleString()}</span>
                </div>
              </div>

              {/* Features Preview */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2 text-sm">Included:</h4>
                <ul className="space-y-2">
                  {plan.features.slice(0, 4).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                      <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust Badge */}
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 text-sm font-semibold">
                  <FaCheckCircle />
                  <span>100% Safe & Secure</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
