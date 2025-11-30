import { Outlet } from 'react-router-dom'
import ClientSidebar from '../components/dashboard/ClientSidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <ClientSidebar />
        <main className="flex-1 p-6 ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
