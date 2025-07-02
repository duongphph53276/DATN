import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Folder,
  Plus,
  Ticket,
  Pencil,
  ShoppingCart,
} from 'lucide-react'

const Sidebar = () => {
  const location = useLocation()

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/admin' },
    { label: 'Danh mục', icon: <Folder size={18} />, path: '/admin/category' },
    { label: 'Thêm danh mục', icon: <Plus size={18} />, path: '/admin/category/add' },
    { label: 'Voucher', icon: <Ticket size={18} />, path: '/admin/voucher' },
    { label: 'Thêm Voucher', icon: <Plus size={18} />, path: '/admin/voucher/add' },
    { label: 'Sửa Voucher', icon: <Pencil size={18} />, path: '/admin/voucher/edit/1' }, // chú ý: ":id" nên dùng động bên route, không cần hardcode
    { label: 'Giỏ hàng', icon: <ShoppingCart size={18} />, path: '/admin/cart' }, 
  ]

  return (
    <aside className="w-64 bg-white border-r h-screen sticky top-0 shadow-sm">
      <div className="p-6 text-2xl font-bold text-blue-600 border-b">
      FUZZYBEAR
      </div>
      <nav className="p-4 space-y-1">
        {navItems.map((item, index) => {
          const isActive = location.pathname.startsWith(item.path)
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all 
                ${
                  isActive
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-500'
                }`}
            >
              {item.icon}   
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
  