import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { FaUsers, FaShoppingBag, FaDollarSign, FaChartLine, FaEye, FaClock } from 'react-icons/fa'
import api from '../../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    pendingOrders: 0,
    completedOrders: 0,
    activeServices: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/dashboard/admin')
      setStats(response.data.data)
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { 
      title: 'Total Revenue', 
      value: `₹${stats.totalRevenue?.toLocaleString() || 0}`, 
      icon: <FaDollarSign className="text-3xl" />,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Total Orders', 
      value: stats.totalOrders || 0, 
      icon: <FaShoppingBag className="text-3xl" />,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Total Users', 
      value: stats.totalUsers || 0, 
      icon: <FaUsers className="text-3xl" />,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    },
    { 
      title: 'Pending Orders', 
      value: stats.pendingOrders || 0, 
      icon: <FaClock className="text-3xl" />,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50'
    },
    { 
      title: 'Completed Orders', 
      value: stats.completedOrders || 0, 
      icon: <FaChartLine className="text-3xl" />,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50'
    },
    { 
      title: 'Active Services', 
      value: stats.activeServices || 0, 
      icon: <FaEye className="text-3xl" />,
      color: 'bg-red-500',
      bgColor: 'bg-red-50'
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
        <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
              </div>
              <div className={`${stat.color} text-white p-4 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a href="/admin/orders" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">View All Orders</span>
                <FaShoppingBag className="text-blue-600" />
              </div>
            </a>
            <a href="/admin/users" className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">Manage Users</span>
                <FaUsers className="text-purple-600" />
              </div>
            </a>
            <a href="/admin/services" className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">Manage Services</span>
                <FaChartLine className="text-green-600" />
              </div>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">System Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Order Completion Rate</span>
              <span className="font-bold text-green-600">
                {stats.totalOrders > 0 ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Pending Orders</span>
              <span className="font-bold text-orange-600">{stats.pendingOrders || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total Registered Users</span>
              <span className="font-bold text-purple-600">{stats.totalUsers || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
