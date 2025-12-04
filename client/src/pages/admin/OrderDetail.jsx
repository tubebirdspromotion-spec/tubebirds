import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaSave, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'
import api from '../../services/api'

const OrderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [formData, setFormData] = useState({
    status: '',
    progress: 0,
    completedQuantity: 0,
    adminNotes: ''
  })

  useEffect(() => {
    fetchOrderDetails()
  }, [id])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/orders/${id}`)
      const orderData = response.data.data.order
      setOrder(orderData)
      setFormData({
        status: orderData.status || '',
        progress: orderData.progress || 0,
        completedQuantity: orderData.completedQuantity || 0,
        adminNotes: orderData.adminNotes || ''
      })
    } catch (error) {
      console.error('Error fetching order:', error)
      toast.error('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'progress' || name === 'completedQuantity' ? parseInt(value) || 0 : value
    }))
  }

  const handleUpdateStatus = async () => {
    try {
      setUpdating(true)
      await api.put(`/orders/${id}/status`, {
        status: formData.status,
        adminNotes: formData.adminNotes
      })
      toast.success('Order status updated successfully')
      fetchOrderDetails()
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error(error.response?.data?.message || 'Failed to update order')
    } finally {
      setUpdating(false)
    }
  }

  const handleUpdateProgress = async () => {
    try {
      setUpdating(true)
      await api.put(`/orders/${id}/progress`, {
        progress: formData.progress,
        completedQuantity: formData.completedQuantity,
        status: formData.status
      })
      toast.success('Order progress updated successfully')
      fetchOrderDetails()
    } catch (error) {
      console.error('Error updating progress:', error)
      toast.error('Failed to update progress')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <button
          onClick={() => navigate('/admin/orders')}
          className="btn btn-primary"
        >
          Back to Orders
        </button>
      </div>
    )
  }

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return '✅'
      case 'processing':
      case 'in-progress':
        return '⏳'
      case 'pending':
        return '⏸️'
      case 'cancelled':
        return '❌'
      default:
        return '❓'
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/orders')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <FaArrowLeft />
          <span>Back to Orders</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600 mt-1">Order #{order.orderNumber}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Customer Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Name</label>
                <p className="text-gray-900 mt-1">{order.customer?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Email</label>
                <p className="text-gray-900 mt-1">{order.customer?.email || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Phone</label>
                <p className="text-gray-900 mt-1">{order.customer?.phone || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Customer ID</label>
                <p className="text-gray-900 mt-1">{order.userId}</p>
              </div>
            </div>
          </div>

          {/* Order & Service Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order & Service Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Service</label>
                <p className="text-gray-900 mt-1">{order.service?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Plan Name</label>
                <p className="text-gray-900 mt-1">{order.pricing?.planName || order.pricing?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Order Date</label>
                <p className="text-gray-900 mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Category</label>
                <p className="text-gray-900 mt-1">{order.pricing?.category || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Channel Details */}
          {order.channelDetails && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Channel Information</h2>
              <div className="space-y-3">
                {order.channelDetails.channelName && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Channel Name</label>
                    <p className="text-gray-900">{order.channelDetails.channelName}</p>
                  </div>
                )}
                {order.channelDetails.channelUrl && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Channel URL</label>
                    <a 
                      href={order.channelDetails.channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
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
                      className="text-blue-600 hover:underline"
                    >
                      {order.channelDetails.videoUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Payment Information</h2>
            <div className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Amount (Base)</label>
                  <p className="text-lg font-bold text-gray-900">₹{parseFloat(order.baseAmount || order.amount / 1.18).toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">GST ({order.gstRate || 18}%)</label>
                  <p className="text-lg font-bold text-gray-900">₹{parseFloat(order.gstAmount || order.amount - order.amount / 1.18).toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
                </div>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <label className="text-sm font-semibold text-gray-600">Total Amount</label>
                  <p className="text-lg font-bold text-green-600">₹{parseFloat(order.amount).toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 pt-3">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Payment Method</label>
                  <p className="text-gray-900 capitalize">{order.paymentMethod || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Payment Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                    order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                    order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.paymentStatus?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Tracking */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Progress Tracking</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-600">Overall Progress (%)</label>
                  <span className="text-lg font-bold text-primary-600">{formData.progress}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  name="progress"
                  value={formData.progress}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input 
                  type="number"
                  min="0"
                  max="100"
                  name="progress"
                  value={formData.progress}
                  onChange={handleInputChange}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Completed Quantity</label>
                  <input 
                    type="number"
                    min="0"
                    name="completedQuantity"
                    value={formData.completedQuantity}
                    onChange={handleInputChange}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Target Quantity</label>
                  <input 
                    type="number"
                    disabled
                    value={order.targetQuantity || 0}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
                Progress: {formData.completedQuantity} out of {order.targetQuantity || 0} items
              </div>

              <button
                onClick={handleUpdateProgress}
                disabled={updating}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                <FaSave /> Update Progress
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar - Status Management */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Status</h2>
            
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-600">Current Status</label>
              <div className={`mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full border font-semibold ${
                formData.status === 'completed' ? 'bg-green-100 text-green-800 border-green-300' :
                formData.status === 'processing' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                formData.status === 'in-progress' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                formData.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                'bg-gray-100 text-gray-800 border-gray-300'
              }`}>
                <span>{getStatusIcon(formData.status)}</span>
                <span className="capitalize">{formData.status?.replace('-', ' ')}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-600">Change Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-600">Admin Notes</label>
              <textarea
                name="adminNotes"
                value={formData.adminNotes}
                onChange={handleInputChange}
                rows="4"
                placeholder="Add notes for the customer or internal reference..."
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <button
              onClick={handleUpdateStatus}
              disabled={updating}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400"
            >
              <FaSave /> Update Status
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded p-3">
                <p className="text-xs text-gray-600">Order Number</p>
                <p className="font-mono font-semibold text-sm">{order.orderNumber}</p>
              </div>
              <div className="bg-green-50 rounded p-3">
                <p className="text-xs text-gray-600">Payment Status</p>
                <p className="font-semibold text-sm capitalize text-green-700">{order.paymentStatus}</p>
              </div>
              <div className="bg-purple-50 rounded p-3">
                <p className="text-xs text-gray-600">Order Value</p>
                <p className="font-bold text-lg text-purple-600">₹{parseFloat(order.amount).toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-orange-50 rounded p-3">
                <p className="text-xs text-gray-600">Created</p>
                <p className="font-semibold text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Assigned Editor */}
          {order.editor && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-3">Assigned Editor</h2>
              <div className="bg-gray-50 rounded p-3">
                <p className="font-semibold text-gray-900">{order.editor.name}</p>
                <p className="text-sm text-gray-600">{order.editor.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
