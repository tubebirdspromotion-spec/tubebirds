import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaArrowLeft, FaCheckCircle, FaClock, FaTimesCircle, 
  FaYoutube, FaReceipt, FaDownload, FaPrint, FaInfoCircle 
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import api from '../../services/api'

const OrderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrderDetails()
    
    // Show success message if coming from successful payment
    if (location.state?.paymentSuccess) {
      toast.success('Payment successful! Your order is being processed.', {
        duration: 5000,
        icon: '🎉'
      })
    }
  }, [id])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/orders/${id}`)
      setOrder(response.data.data.order)
    } catch (error) {
      console.error('Error fetching order:', error)
      toast.error('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'processing':
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <FaCheckCircle />
      case 'processing':
      case 'in_progress':
        return <FaClock />
      case 'pending':
        return <FaClock />
      case 'cancelled':
      case 'failed':
        return <FaTimesCircle />
      default:
        return <FaInfoCircle />
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <button
          onClick={() => navigate('/dashboard/orders')}
          className="btn btn-primary mt-4"
        >
          Back to Orders
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 print:hidden">
        <button
          onClick={() => navigate('/dashboard/orders')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <FaArrowLeft />
          <span>Back to Orders</span>
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600 mt-1">Order #{order.orderNumber}</p>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          >
            <FaPrint />
            Print Receipt
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {location.state?.paymentSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 print:hidden"
        >
          <div className="flex items-center gap-3">
            <FaCheckCircle className="text-green-600 text-2xl" />
            <div>
              <h3 className="font-semibold text-green-900">Payment Successful!</h3>
              <p className="text-sm text-green-700">
                Your order has been placed successfully and is being processed.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Order Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Status</h2>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-semibold ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="capitalize">{order.status?.replace('_', ' ')}</span>
            </div>
            
            {order.estimatedCompletionDate && (
              <div className="mt-4 text-sm text-gray-600">
                <FaClock className="inline mr-2" />
                Expected completion: {new Date(order.estimatedCompletionDate).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Service Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaYoutube className="text-red-600" />
              Service Details
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-600">Plan Name</label>
                <p className="text-lg font-medium">{order.planName || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Quantity</label>
                <p className="text-lg font-medium">{order.quantity || 'N/A'}</p>
              </div>
              {order.requirements?.youtubeUrl && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">YouTube URL</label>
                  <a 
                    href={order.requirements.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all block"
                  >
                    {order.requirements.youtubeUrl}
                  </a>
                </div>
              )}
              {order.requirements?.channelName && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">Channel Name</label>
                  <p className="text-lg font-medium">{order.requirements.channelName}</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Requirements */}
          {order.requirements && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Additional Information</h2>
              <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(order.requirements, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Payment Receipt */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaReceipt className="text-green-600" />
            Payment Receipt
          </h2>
          
          <div className="space-y-4">
            {/* Order Info */}
            <div className="pb-4 border-b">
              <p className="text-xs text-gray-500 mb-1">Order Number</p>
              <p className="font-mono font-semibold">{order.orderNumber}</p>
            </div>

            {/* Date */}
            <div className="pb-4 border-b">
              <p className="text-xs text-gray-500 mb-1">Order Date</p>
              <p className="font-semibold">{new Date(order.createdAt).toLocaleString()}</p>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Base Amount</span>
                <span className="font-semibold">
                  ₹{order.baseAmount ? parseFloat(order.baseAmount).toFixed(2) : (order.amount / 1.18).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">GST ({order.gstRate || 18}%)</span>
                <span className="font-semibold">
                  ₹{order.gstAmount ? parseFloat(order.gstAmount).toFixed(2) : (order.amount - (order.amount / 1.18)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t">
                <span>Total Paid</span>
                <span className="text-green-600">₹{parseFloat(order.amount).toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500 mb-1">Payment Method</p>
              <p className="font-semibold">Test Payment (Demo)</p>
            </div>

            {/* Transaction ID */}
            {order.Payment && (
              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                <p className="font-mono text-xs break-all">{order.Payment.transactionId}</p>
              </div>
            )}

            {/* Status Badge */}
            <div className="pt-4 border-t">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <FaCheckCircle className="text-green-600 text-2xl mx-auto mb-2" />
                <p className="text-sm font-semibold text-green-800">Payment Confirmed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          #root, #root * {
            visibility: visible;
          }
          #root {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default OrderDetail
