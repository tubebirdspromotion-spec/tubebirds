import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FaSearch, 
  FaFilter, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock,
  FaMoneyBillWave,
  FaReceipt,
  FaExternalLinkAlt
} from 'react-icons/fa'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../services/api'

const PaymentHistory = () => {
  const { user } = useSelector((state) => state.auth)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await api.get('/payment/history')
      setPayments(response.data.data.payments)
    } catch (error) {
      console.error('Error fetching payments:', error)
      toast.error('Failed to fetch payment history')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      success: 'bg-green-100 text-green-800 border-green-300',
      captured: 'bg-green-100 text-green-800 border-green-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      authorized: 'bg-blue-100 text-blue-800 border-blue-300',
      failed: 'bg-red-100 text-red-800 border-red-300',
      refunded: 'bg-gray-100 text-gray-800 border-gray-300'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const getStatusIcon = (status) => {
    const icons = {
      success: <FaCheckCircle />,
      captured: <FaCheckCircle />,
      pending: <FaClock />,
      authorized: <FaClock />,
      failed: <FaTimesCircle />,
      refunded: <FaMoneyBillWave />
    }
    return icons[status] || <FaClock />
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.razorpayPaymentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.order?.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaReceipt className="text-red-600" />
            Payment History
          </h2>
          <p className="text-gray-600 mt-1">
            {user.role === 'admin' 
              ? 'View all payment transactions' 
              : 'Track your payment transactions'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by invoice, payment ID, order..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none"
            >
              <option value="all">All Payments</option>
              <option value="success">Successful</option>
              <option value="captured">Captured</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Successful</p>
              <p className="text-2xl font-bold text-gray-900">
                {payments.filter(p => p.status === 'success' || p.status === 'captured').length}
              </p>
            </div>
            <FaCheckCircle className="text-3xl text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {payments.filter(p => p.status === 'pending').length}
              </p>
            </div>
            <FaClock className="text-3xl text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-gray-900">
                {payments.filter(p => p.status === 'failed').length}
              </p>
            </div>
            <FaTimesCircle className="text-3xl text-red-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{payments
                  .filter(p => p.status === 'success' || p.status === 'captured')
                  .reduce((sum, p) => sum + parseFloat(p.amount), 0)
                  .toLocaleString()}
              </p>
            </div>
            <FaMoneyBillWave className="text-3xl text-blue-500" />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Invoice
                </th>
                {user.role === 'admin' && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                )}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  GST
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Payment ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={user.role === 'admin' ? 8 : 7} className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <FaReceipt className="mx-auto text-5xl mb-4" />
                      <p className="text-lg font-medium">No payments found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FaReceipt className="text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {payment.invoiceNumber || 'N/A'}
                        </span>
                      </div>
                    </td>
                    {user.role === 'admin' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">
                            {payment.user?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.user?.email}
                          </div>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">
                          {payment.order?.orderNumber}
                        </span>
                        {payment.order?.id && (
                          <a
                            href={`/dashboard/${user.role === 'admin' ? 'admin' : 'client'}/orders/${payment.order.id}`}
                            className="text-blue-600 hover:text-blue-800"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaExternalLinkAlt className="text-xs" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">
                        ₹{parseFloat(payment.amount).toLocaleString()}
                      </div>
                      {payment.baseAmount && (
                        <div className="text-xs text-gray-500">
                          Base: ₹{parseFloat(payment.baseAmount).toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {payment.gstAmount ? `₹${parseFloat(payment.gstAmount).toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs font-mono text-gray-600">
                        {payment.razorpayPaymentId ? (
                          payment.razorpayPaymentId.substring(0, 20) + '...'
                        ) : (
                          'N/A'
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PaymentHistory
