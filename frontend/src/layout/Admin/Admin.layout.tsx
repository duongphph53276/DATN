import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import Navbar from './Navbar'

const AdminLayout = () => {
  return (
    <div id="app">
      <Navbar/>
      <Sidebar />
      <section className="section main-section">
        <Header />
        <div id="app">
          <Outlet />
        </div>
        <Footer />
      </section>
    </div>
  )
}

export default AdminLayout
