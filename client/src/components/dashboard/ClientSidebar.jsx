import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaShoppingBag, FaUser } from 'react-icons/fa'

const ClientSidebar = () => {
  const location = useLocation()

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaHome /> },
    { name: 'My Orders', path: '/dashboard/orders', icon: <FaShoppingBag /> },
    { name: 'Profile', path: '/dashboard/profile', icon: <FaUser /> },
  ]

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg overflow-y-auto">
      <nav className="p-4">
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
      </nav>
    </aside>
  )
}

export default ClientSidebar
