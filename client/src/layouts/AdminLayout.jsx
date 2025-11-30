import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/dashboard/AdminSidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
