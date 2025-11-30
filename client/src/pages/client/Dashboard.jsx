import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaShoppingBag, FaClock, FaCheckCircle, FaRocket, FaPlus } from 'react-icons/fa'
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
              <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">{order.serviceName}</h4>
                    <p className="text-sm text-gray-600 mt-1">Order #{order.id}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                    <p className="text-sm text-gray-600 mt-2">₹{order.amount?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
