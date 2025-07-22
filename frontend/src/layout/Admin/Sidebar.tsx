
import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Home,
  Folder,
  Plus,
  Package,
  Settings,
  User,
  ShieldCheck,
  PercentCircle,
} from 'lucide-react'

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <Home size={18} /> },
    { name: 'Danh mục', path: '/admin/category', icon: <Folder size={18} /> },
    { name: 'Thêm danh mục', path: '/admin/category/add', icon: <Plus size={18} /> },
    { name: 'Sản phẩm', path: '/admin/product', icon: <Package size={18} /> },
    { name: 'Thuộc tính', path: '/admin/attribute', icon: <Settings size={18} /> },
    { name: 'Quản lý User', path: '/admin/users', icon: <User size={18} /> },
    { name: 'Quản lý Role', path: '/admin/roles', icon: <ShieldCheck size={18} /> },
    { name: 'Thêm Role', path: '/admin/roles/create', icon: <Plus size={18} /> },
    { name: 'Quản lý Permission', path: '/admin/permissions', icon: <ShieldCheck size={18} /> }, // Thêm mục mới
    { name: 'Mã giảm giá', path: `/admin/voucher`, icon: <PercentCircle size={18} /> },
  ]

  return (
    <aside className="w-64 h-screen bg-white shadow-md sticky top-0">
      <div className="p-6 text-xl font-bold border-b text-black">Quản trị</div>
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm transition 
              ${
                isActive
                  ? 'bg-gray-200 text-black font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}


export default Sidebar

