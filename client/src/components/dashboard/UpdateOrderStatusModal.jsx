import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaSave, FaSpinner } from 'react-icons/fa'
import toast from 'react-hot-toast'
import api from '../../services/api'

const UpdateOrderStatusModal = ({ order, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    status: order?.status || 'pending',
    adminNotes: order?.adminNotes || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'processing', label: 'Processing', color: 'blue' },
    { value: 'in-progress', label: 'In Progress', color: 'purple' },
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' },
    { value: 'refunded', label: 'Refunded', color: 'gray' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await api.put(`/orders/${order.id}/status`, formData)
      toast.success('Order status updated successfully')
      onUpdate(response.data.data.order)
      onClose()
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error(error.response?.data?.message || 'Failed to update order status')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-gray-900">Update Order Status</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Order Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Order Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Order Number:</span>
                  <p className="font-medium text-gray-900">{order.orderNumber}</p>
                </div>
                <div>
                  <span className="text-gray-600">Customer:</span>
                  <p className="font-medium text-gray-900">{order.customer?.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Service:</span>
                  <p className="font-medium text-gray-900">{order.service?.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Plan:</span>
                  <p className="font-medium text-gray-900">{order.pricing?.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Amount:</span>
                  <p className="font-medium text-gray-900">₹{order.amount}</p>
                </div>
                <div>
                  <span className="text-gray-600">Payment Status:</span>
                  <p className={`font-medium ${
                    order.paymentStatus === 'paid' ? 'text-green-600' : 
                    order.paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {order.paymentStatus}
                  </p>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Status
              </label>
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-blue-700 font-medium capitalize">
                  {order.status.replace('-', ' ')}
                </span>
              </div>
            </div>

            {/* New Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Update Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Select the new status for this order
              </p>
            </div>

            {/* Admin Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Notes
              </label>
              <textarea
                value={formData.adminNotes}
                onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                rows={4}
                placeholder="Add any notes or comments about this status update..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                These notes will be visible to admins only
              </p>
            </div>

            {/* Video URL Info (if available) */}
            {order.channelDetails?.videoUrl && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-2">Video Information</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-gray-600">Video URL:</span>{' '}
                    <a
                      href={order.channelDetails.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {order.channelDetails.videoUrl}
                    </a>
                  </p>
                  {order.channelDetails.channelName && (
                    <p>
                      <span className="text-gray-600">Channel:</span>{' '}
                      <span className="font-medium">{order.channelDetails.channelName}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-semibold hover:from-red-700 hover:to-orange-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Update Status
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default UpdateOrderStatusModal
