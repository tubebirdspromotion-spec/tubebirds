import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaShoppingBag, FaUser, FaGlobe, FaChartLine } from 'react-icons/fa'

const ClientSidebar = () => {
  const location = useLocation()

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaChartLine /> },
    { name: 'My Orders', path: '/dashboard/orders', icon: <FaShoppingBag /> },
    { name: 'Profile', path: '/dashboard/profile', icon: <FaUser /> },
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
        </div>
      </nav>
    </aside>
  )
}

export default ClientSidebar
