import { useSelector } from 'react-redux'
import { FaBell } from 'react-icons/fa'

const DashboardHeader = () => {
  const { user } = useSelector((state) => state.auth)

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
      </div>
    </header>
  )
}

export default DashboardHeader
