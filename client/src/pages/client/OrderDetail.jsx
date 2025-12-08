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
      const orderData = response.data.data.order
      console.log('📦 Full Order Data:', orderData)
      console.log('🎯 Service:', orderData.service)
      console.log('💳 Pricing:', orderData.pricing)
      console.log('📺 Channel Details:', orderData.channelDetails)
      setOrder(orderData)
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
    <div className="max-w-6xl mx-auto">
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
          {/* Order & Payment Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order & Payment Status</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase">Order Status</label>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-semibold mt-2 ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status?.replace(/_|-/g, ' ')}</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase">Payment Status</label>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-semibold mt-2 ${
                  order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800 border-green-300' :
                  order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                  order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800 border-red-300' :
                  'bg-gray-100 text-gray-800 border-gray-300'
                }`}>
                  <span className="capitalize">{order.paymentStatus}</span>
                </div>
              </div>
            </div>
            
            {order.estimatedCompletionDate && (
              <div className="mt-4 text-sm text-gray-600">
                <FaClock className="inline mr-2" />
                Expected completion: {new Date(order.estimatedCompletionDate).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Plan Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Plan Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-600">Plan Name</label>
                <p className="text-lg font-medium text-gray-900 mt-1">{order.pricing?.planName || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Service</label>
                <p className="text-lg font-medium text-gray-900 mt-1">{order.service?.title || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Initial Target</label>
                <p className="text-lg font-medium text-gray-900 mt-1">{order.targetQuantity || 0}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Category</label>
                <p className="text-lg font-medium text-gray-900 mt-1 capitalize">{order.pricing?.category || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Channel Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaYoutube className="text-red-600" />
              Channel Details
            </h2>
            {order.channelDetails && (typeof order.channelDetails === 'object' && Object.keys(order.channelDetails).length > 0) ? (
              <div className="space-y-3">
                {order.channelDetails.channelName && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Channel Name</label>
                    <p className="text-gray-900 mt-1">{order.channelDetails.channelName}</p>
                  </div>
                )}
                {order.channelDetails.channelUrl && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Channel URL</label>
                    <a 
                      href={order.channelDetails.channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all block"
                    >
                      {order.channelDetails.channelUrl}
                    </a>
                  </div>
                )}
                {order.channelDetails.videoUrl && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Video URL</label>
                    <a 
                      href={order.channelDetails.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all block"
                    >
                      {order.channelDetails.videoUrl}
                    </a>
                  </div>
                )}
                {order.channelDetails.videoId && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Video ID</label>
                    <p className="text-gray-900 mt-1 font-mono text-sm">{order.channelDetails.videoId}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No channel details available</p>
            )}
          </div>

          {/* Progress Tracking */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Progress Tracking</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-600">Overall Progress</label>
                  <span className="text-lg font-bold text-primary-600">{order.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${order.progress || 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Completed Quantity</label>
                  <p className="text-2xl font-bold text-green-600 mt-1">{order.completedQuantity || 0}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Target Quantity</label>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{order.targetQuantity || 0}</p>
                </div>
              </div>

              {order.completedQuantity !== undefined && order.targetQuantity && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
                  Progress: {order.completedQuantity} out of {order.targetQuantity} items delivered
                </div>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          {order.adminNotes && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-2 text-amber-900">Admin Notes</h2>
              <p className="text-amber-800">{order.adminNotes}</p>
            </div>
          )}
        </div>

        {/* Payment Receipt Sidebar */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaReceipt className="text-green-600" />
            Payment Receipt
          </h2>
          
          <div className="space-y-4">
            {/* Order Info */}
            <div className="pb-4 border-b">
              <p className="text-xs text-gray-500 mb-1">Order Number</p>
              <p className="font-mono font-semibold text-sm">{order.orderNumber}</p>
            </div>

            {/* Date */}
            <div className="pb-4 border-b">
              <p className="text-xs text-gray-500 mb-1">Order Date</p>
              <p className="font-semibold text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Base Amount</span>
                <span className="font-semibold">
                  ₹{order.baseAmount ? parseFloat(order.baseAmount).toLocaleString('en-IN') : (parseFloat(order.amount) / 1.18).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">GST ({order.gstRate || 18}%)</span>
                <span className="font-semibold">
                  ₹{order.gstAmount ? parseFloat(order.gstAmount).toLocaleString('en-IN') : (parseFloat(order.amount) - (parseFloat(order.amount) / 1.18)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t">
                <span>Total Paid</span>
                <span className="text-green-600">₹{parseFloat(order.amount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500 mb-1">Payment Method</p>
              <p className="font-semibold capitalize text-sm">{order.paymentMethod || 'Razorpay'}</p>
            </div>

            {/* Status Badge */}
            <div className="pt-4 border-t">
              {order.paymentStatus === 'paid' ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <FaCheckCircle className="text-green-600 text-2xl mx-auto mb-2" />
                  <p className="text-sm font-semibold text-green-800">Payment Confirmed</p>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                  <FaClock className="text-yellow-600 text-2xl mx-auto mb-2" />
                  <p className="text-sm font-semibold text-yellow-800">Pending Payment</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            {(order.createdAt || order.startDate || order.completionDate) && (
              <div className="pt-4 border-t space-y-2">
                <p className="text-xs font-semibold text-gray-600 uppercase">Timeline</p>
                {order.createdAt && (
                  <div className="text-xs text-gray-600">
                    <span className="font-semibold">Created:</span> {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </div>
                )}
                {order.startDate && (
                  <div className="text-xs text-gray-600">
                    <span className="font-semibold">Started:</span> {new Date(order.startDate).toLocaleDateString('en-IN')}
                  </div>
                )}
                {order.completionDate && (
                  <div className="text-xs text-gray-600">
                    <span className="font-semibold">Completed:</span> {new Date(order.completionDate).toLocaleDateString('en-IN')}
                  </div>
                )}
              </div>
            )}
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
