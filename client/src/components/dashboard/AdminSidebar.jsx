import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FaHome, FaShoppingBag, FaUsers, FaCog, FaDollarSign, FaImages, FaEnvelope, FaGlobe, FaChartLine, FaSignOutAlt, FaCalendarCheck, FaStar } from 'react-icons/fa'
import { logout } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'

const AdminSidebar = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const links = [
    { name: 'Dashboard', path: '/admin', icon: <FaChartLine /> },
    { name: 'Orders', path: '/admin/orders', icon: <FaShoppingBag /> },
    { name: 'Users', path: '/admin/users', icon: <FaUsers /> },
    { name: 'Services', path: '/admin/services', icon: <FaCog /> },
    { name: 'Pricing', path: '/admin/pricing', icon: <FaDollarSign /> },
    { name: 'Portfolio', path: '/admin/portfolio', icon: <FaImages /> },
    { name: 'Contacts', path: '/admin/contacts', icon: <FaEnvelope /> },
    { name: 'Consultations', path: '/admin/consultations', icon: <FaCalendarCheck /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <FaStar /> },
  ]

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg overflow-y-auto">
      <nav className="p-4">
        {/* Home Button */}
        <Link
          to="/"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg mb-4 transition-colors bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md"
        >
          <span className="text-xl"><FaGlobe /></span>
          <span className="font-semibold">Back to Website</span>
        </Link>
        
        <div className="border-t border-gray-200 pt-4 mt-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                location.pathname === link.path
                  ? 'bg-primary-100 text-primary-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          ))}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors text-red-600 hover:bg-red-50 w-full mt-4"
          >
            <span className="text-xl"><FaSignOutAlt /></span>
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  )
}

export default AdminSidebar
