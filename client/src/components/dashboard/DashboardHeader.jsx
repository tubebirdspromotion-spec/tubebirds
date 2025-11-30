import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaBell, FaSignOutAlt } from 'react-icons/fa'
import { logout } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'

const DashboardHeader = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-40">
      <div>
        <h1 className="text-xl font-bold text-gray-800">
          {user?.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-600 hover:text-gray-800">
          <FaBell className="text-xl" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </header>
  )
}

export default DashboardHeader
