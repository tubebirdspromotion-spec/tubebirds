import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FaYoutube, FaLock, FaCheckCircle, FaArrowLeft, FaCreditCard, FaShieldAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'
import api from '../services/api'

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

const Checkout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, token } = useSelector((state) => state.auth)
  
  const [plan, setPlan] = useState(null)
  const [formData, setFormData] = useState({
    videoUrl: '',
    channelName: '',
    channelUrl: '',
    agreeTerms: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [gstDetails, setGstDetails] = useState(null)

  useEffect(() => {
    // Load Razorpay script
    loadRazorpayScript().then((loaded) => {
      setScriptLoaded(loaded)
      if (!loaded) {
        toast.error('Failed to load payment gateway. Please refresh the page.')
      }
    })
  }, [])

  useEffect(() => {
    // Get plan from location state
    if (location.state?.plan) {
      console.log('📦 Checkout: Plan received from location.state:', location.state.plan)
      setPlan(location.state.plan)
      // Calculate GST: Base price + 18% GST = Total
      const baseAmount = parseFloat(location.state.plan.price)
      const gstAmount = baseAmount * 0.18 // 18% of base price
      const totalAmount = baseAmount + gstAmount
      setGstDetails({
        baseAmount: baseAmount.toFixed(2),
        gstAmount: gstAmount.toFixed(2),
        gstRate: 18,
        totalAmount: totalAmount.toFixed(2)
      })
    } else {
      console.log('❌ Checkout: No plan in location.state, redirecting to pricing')
      toast.error('No plan selected. Please select a plan first.')
      navigate('/pricing')
    }
  }, [location.state, navigate])

  useEffect(() => {
    // Set auth check as complete since ProtectedRoute handles authentication
    setHasCheckedAuth(true)
  }, [])

  const validateYoutubeUrl = (url) => {
    const patterns = [
      /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/[\w-]+/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]+/,
      /^(https?:\/\/)?youtu\.be\/[\w-]+/
    ]
    return patterns.some(pattern => pattern.test(url))
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
    
    if (!formData.videoUrl.trim()) {
      errors.videoUrl = 'YouTube video URL is required'
    } else if (!validateYoutubeUrl(formData.videoUrl)) {
      errors.videoUrl = 'Please enter a valid YouTube video URL'
    }
    
    if (!formData.agreeTerms) {
      errors.agreeTerms = 'You must agree to terms and conditions'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handlePayment = async (orderData) => {
    if (!scriptLoaded) {
      toast.error('Payment gateway not loaded. Please refresh the page.')
      return
    }

    const options = {
      key: orderData.razorpayKeyId,
      amount: Math.round(orderData.amount * 100), // Amount in paise
      currency: orderData.currency,
      name: 'TubeBirds',
      description: `${plan.name} - ${plan.quantity}`,
      order_id: orderData.razorpayOrderId,
      prefill: {
        name: orderData.customerDetails.name,
        email: orderData.customerDetails.email,
        contact: orderData.customerDetails.phone || ''
      },
      theme: {
        color: '#DC2626' // Red-600
      },
      modal: {
        ondismiss: function() {
          setIsSubmitting(false)
          toast.error('Payment cancelled')
        }
      },
      handler: async function (response) {
        try {
          // Verify payment on server
          const verifyResponse = await api.post('/payment/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: orderData.orderId
          })

          toast.success('Payment successful! 🎉')
          
          // Redirect to order details page
          navigate(`/dashboard/orders/${orderData.orderId}`, { 
            state: { 
              paymentSuccess: true,
              orderId: orderData.orderId
            } 
          })
        } catch (error) {
          console.error('Payment verification error:', error)
          toast.error(error.response?.data?.message || 'Payment verification failed')
          setIsSubmitting(false)
        }
      }
    }

    const razorpay = new window.Razorpay(options)
    razorpay.open()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly')
      return
    }
    
    if (!scriptLoaded) {
      toast.error('Payment gateway not loaded. Please refresh the page.')
      return
    }

    setIsSubmitting(true)
    
    try {
      console.log('💳 Creating payment order with plan:', plan)
      
      // Create Razorpay order on server
      const response = await api.post('/payment/create-order', {
        pricingId: typeof plan.id === 'number' ? plan.id : null, // Only send if numeric DB ID
        planDetails: {
          name: plan.name,
          price: parseFloat(plan.price),
          quantity: plan.quantity || plan.views,
          category: plan.category
        },
        videoUrl: formData.videoUrl,
        channelName: formData.channelName || '',
        channelUrl: formData.channelUrl || ''
      })

      const orderData = response.data.data
      console.log('✅ Order created:', orderData)

      // Open Razorpay checkout
      await handlePayment(orderData)
      
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(error.response?.data?.message || 'Failed to initiate payment')
      setIsSubmitting(false)
    }
  }

  if (!plan || !gstDetails) {
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
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <FaArrowLeft />
            <span>Back to Pricing</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Secure Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order to get started</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Order Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6 md:p-8"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaYoutube className="text-red-600" />
              Order Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* YouTube URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  YouTube Video URL *
                </label>
                <input
                  type="text"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/watch?v=xxxxx or https://youtu.be/xxxxx"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                    validationErrors.videoUrl ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {validationErrors.videoUrl && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.videoUrl}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  📹 Paste the full URL of your YouTube video (required before payment)
                </p>
              </div>

              {/* Channel Name (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Channel Name <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="channelName"
                  value={formData.channelName}
                  onChange={handleInputChange}
                  placeholder="Your YouTube Channel Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  disabled={isSubmitting}
                />
              </div>

              {/* Channel URL (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Channel URL <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="channelUrl"
                  value={formData.channelUrl}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/@yourchannel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  disabled={isSubmitting}
                />
              </div>

              {/* User Info (Read-only) */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FaCheckCircle className="text-blue-600" />
                  Billing Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium text-gray-600">Name:</span> <span className="text-gray-900">{user?.name}</span></p>
                  <p><span className="font-medium text-gray-600">Email:</span> <span className="text-gray-900">{user?.email}</span></p>
                  {user?.phone && <p><span className="font-medium text-gray-600">Phone:</span> <span className="text-gray-900">{user.phone}</span></p>}
                </div>
              </div>

              {/* Terms & Conditions */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    disabled={isSubmitting}
                  />
                  <span className={`text-sm ${validationErrors.agreeTerms ? 'text-red-500' : 'text-gray-600'}`}>
                    I agree to the{' '}
                    <a href="/terms-conditions" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline font-medium">
                      Terms & Conditions
                    </a>
                    {' '}and{' '}
                    <a href="/refund-policy" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline font-medium">
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
                disabled={isSubmitting || !scriptLoaded}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 rounded-lg font-bold text-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
              >
                <FaCreditCard />
                {isSubmitting ? 'Processing...' : !scriptLoaded ? 'Loading...' : 'Proceed to Secure Payment'}
              </button>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <FaLock className="text-green-600" />
                <span>256-bit SSL Encrypted Payment via Razorpay</span>
              </div>
              
              {/* Payment Methods */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 text-center mb-2">We accept</p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <span className="text-xs bg-white px-3 py-1 rounded-full border">Cards</span>
                  <span className="text-xs bg-white px-3 py-1 rounded-full border">UPI</span>
                  <span className="text-xs bg-white px-3 py-1 rounded-full border">Net Banking</span>
                  <span className="text-xs bg-white px-3 py-1 rounded-full border">Wallets</span>
                </div>
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
              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-lg border border-red-100">
                <div className="flex items-center gap-2 mb-2">
                  {plan.icon}
                  <h3 className="font-bold text-lg text-gray-900">{plan.name}</h3>
                </div>
                <p className="text-2xl font-bold text-red-600">{plan.quantity}</p>
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Amount:</span>
                  <span className="font-semibold">₹{gstDetails.baseAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST ({gstDetails.gstRate}%):</span>
                  <span className="font-semibold">₹{gstDetails.gstAmount}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total Amount:</span>
                  <span className="text-red-600">₹{parseFloat(gstDetails.totalAmount).toLocaleString()}</span>
                </div>
              </div>

              {/* Features Preview */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 text-sm text-gray-700">What's Included:</h4>
                <ul className="space-y-2">
                  {plan.features.slice(0, 5).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                      <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust Badges */}
              <div className="space-y-2 border-t pt-4">
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2 text-green-700 text-sm font-semibold">
                    <FaShieldAlt />
                    <span>100% Safe & Secure</span>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-700 text-sm font-semibold">
                    <FaCheckCircle />
                    <span>Instant Order Confirmation</span>
                  </div>
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
