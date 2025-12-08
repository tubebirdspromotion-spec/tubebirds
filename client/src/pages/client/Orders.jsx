import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEye, FaDownload, FaClock, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa'
import api from '../../services/api'
import toast from 'react-hot-toast'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await api.get('/orders')
      setOrders(response.data.data.orders)
    } catch (error) {
      toast.error('Failed to fetch orders')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FaClock className="text-yellow-500" />,
      processing: <FaSpinner className="text-blue-500 animate-spin" />,
      completed: <FaCheckCircle className="text-green-500" />,
      cancelled: <FaTimesCircle className="text-red-500" />
    }
    return icons[status] || icons.pending
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return badges[status] || badges.pending
  }

  const getPaymentStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    }
    return badges[status] || badges.pending
  }

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `invoice-${orderId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Invoice downloaded successfully')
    } catch (error) {
      toast.error('Failed to download invoice')
      console.error(error)
    }
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">My Orders</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm ${filter === 'all' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('processing')}
            className={`px-4 py-2 rounded-lg text-sm ${filter === 'processing' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Processing
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm ${filter === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            Completed
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-bold mb-2">No Orders Found</h3>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
          <Link to="/services" className="btn bg-red-600 text-white hover:bg-red-700">
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">Order #{order.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusBadge(order.paymentStatus)}`}>
                        Payment: {order.paymentStatus}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">
                      ₹{order.totalAmount?.toLocaleString('en-IN')}
                    </div>
                    {order.gstAmount > 0 && (
                      <div className="text-xs text-gray-600">
                        (incl. GST ₹{order.gstAmount?.toLocaleString('en-IN')})
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Service Details</h4>
                      <p className="text-gray-900">{order.service?.title || order.serviceName || 'N/A'}</p>
                      {order.package && (
                        <p className="text-sm text-gray-600 mt-1">Package: {order.package}</p>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Video Details</h4>
                      {order.videoUrl ? (
                        <a 
                          href={order.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm break-all"
                        >
                          {order.videoUrl}
                        </a>
                      ) : (
                        <p className="text-gray-500 text-sm">No video URL provided</p>
                      )}
                    </div>
                  </div>
                </div>

                {order.notes && (
                  <div className="border-t pt-4 mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Additional Notes</h4>
                    <p className="text-gray-600 text-sm">{order.notes}</p>
                  </div>
                )}

                <div className="border-t pt-4 flex flex-wrap gap-3">
                  <Link
                    to={`/dashboard/orders/${order.id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <FaEye /> View Details
                  </Link>
                  {order.paymentStatus === 'paid' && (
                    <button
                      onClick={() => handleDownloadInvoice(order.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <FaDownload /> Download Invoice
                    </button>
                  )}
                  {order.status === 'pending' && order.paymentStatus === 'pending' && (
                    <Link
                      to={`/checkout?orderId=${order.id}`}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Complete Payment
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Statistics */}
      {orders.length > 0 && (
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">📦</div>
            <div className="text-2xl font-bold">{orders.length}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'processing').length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-red-600">
              ₹{orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString('en-IN')}
            </div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
