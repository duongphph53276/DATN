import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

const AdminLayout = () => {
  return (
    <main className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 flex-shrink-0 bg-white shadow-lg">
          <Sidebar />
        </div>
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <Outlet />
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default AdminLayout
