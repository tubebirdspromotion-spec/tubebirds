import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaShoppingBag, FaClock, FaCheckCircle, FaRocket, FaPlus, FaEye } from 'react-icons/fa'
import api from '../../services/api'

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/client')
      setStats(response.data.data.stats)
      setRecentOrders(response.data.data.recentOrders || [])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { 
      title: 'Total Orders', 
      value: stats.totalOrders || 0, 
      icon: <FaShoppingBag className="text-2xl" />,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Pending Orders', 
      value: stats.pendingOrders || 0, 
      icon: <FaClock className="text-2xl" />,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50'
    },
    { 
      title: 'Completed Orders', 
      value: stats.completedOrders || 0, 
      icon: <FaCheckCircle className="text-2xl" />,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Total Spent', 
      value: `₹${stats.totalSpent?.toLocaleString() || 0}`, 
      icon: <FaRocket className="text-2xl" />,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    },
  ]

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return '✅'
      case 'processing':
      case 'in-progress':
        return '⏳'
      case 'pending':
        return '⏸️'
      default:
        return '❓'
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name}! 👋</h2>
        <p className="text-gray-600 mt-2">Here's an overview of your YouTube growth journey.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Link 
          to="/services" 
          className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Browse Services</h3>
              <p className="text-red-100">Explore our YouTube growth packages</p>
            </div>
            <FaPlus className="text-3xl" />
          </div>
        </Link>

        <Link 
          to="/dashboard/orders" 
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">View All Orders</h3>
              <p className="text-gray-600">Track your order progress</p>
            </div>
            <FaShoppingBag className="text-3xl text-blue-600" />
          </div>
        </Link>

        <Link 
          to="/dashboard/profile" 
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Update Profile</h3>
              <p className="text-gray-600">Manage your account settings</p>
            </div>
            <FaCheckCircle className="text-3xl text-green-600" />
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
          <Link to="/dashboard/orders" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
            <Link 
              to="/services" 
              className="inline-block px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <Link key={order.id} to={`/dashboard/orders/${order.id}`} className="block">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-600 hover:bg-gray-50 transition-all cursor-pointer">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getStatusIcon(order.status)}</span>
                        <h4 className="font-semibold text-gray-800">{order.serviceName}</h4>
                        <span className="text-xs text-gray-500">({order.orderNumber})</span>
                      </div>
                      <p className="text-sm text-gray-600">Plan: {order.planName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-600">₹{order.amount?.toLocaleString('en-IN')}</div>
                      <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3 text-xs">
                    <div className="bg-blue-50 rounded p-2">
                      <div className="text-gray-600">Order Status</div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status.replace('-', ' ').charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                    <div className="bg-green-50 rounded p-2">
                      <div className="text-gray-600">Payment Status</div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getPaymentStatusBadge(order.paymentStatus)}`}>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </span>
                    </div>
                    <div className="bg-purple-50 rounded p-2">
                      <div className="text-gray-600">Progress</div>
                      <div className="text-lg font-bold text-purple-600 mt-1">{order.progress || 0}%</div>
                    </div>
                  </div>

                  {order.targetQuantity && (
                    <div className="mb-3">
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold">{order.completedQuantity || 0} / {order.targetQuantity}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${((order.completedQuantity || 0) / order.targetQuantity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Created: {new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                    <FaEye className="text-blue-500" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
