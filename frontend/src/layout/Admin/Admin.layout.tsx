import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import Nav from './Nav'
import Test from './listproduct'
import FormAdd from './FormAdd'


const AdminLayout = () => {
  return (
    // <div className="flex min-h-screen bg-gray-100">
    //   <Sidebar />
    //   <div className="flex flex-col flex-1">
    //     <Header />
    //     <main className="flex-1 p-6">
    //       <Outlet />
    //     </main>
    //     <Footer />
    //   </div>
    // </div>
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
          <Sidebar />
        </aside>
        <div className="layout-page">
          <Nav />
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <Outlet />
              {/* <Test/> */}
              {/* <FormAdd/> */}
            </div>
          </div>
        </div>
      </div>
    </div>


  )
}

export default AdminLayout