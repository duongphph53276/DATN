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
  Truck
  
} from 'lucide-react'
import { usePermissions } from '../../hooks/usePermissions'

const Sidebar = () => {
  const { hasPermission, loading } = usePermissions();

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/admin', 
      icon: <Home size={18} />,
      permission: null // Dashboard luôn hiển thị
    },
    { 
      name: 'Danh mục', 
      path: '/admin/category', 
      icon: <Folder size={18} />,
      permission: 'view_categories'
    },
    { 
      name: 'Thêm danh mục', 
      path: '/admin/category/add', 
      icon: <Plus size={18} />,
      permission: 'create_category'
    },
    { 
      name: 'Sản phẩm', 
      path: '/admin/product', 
      icon: <Package size={18} />,
      permission: 'view_products'
    },
    { 
      name: 'Thuộc tính', 
      path: '/admin/attribute', 
      icon: <Settings size={18} />,
      permission: 'view_attributes'
    },
    { 
      name: 'Quản lý User', 
      path: '/admin/users', 
      icon: <User size={18} />,
      permission: 'view_users'
    },
    { 
      name: 'Quản lý đơn hàng', 
      path: '/admin/order-list', 
      icon: <Truck size={18} />,
      permission: 'view_orders'
    },
    { 
      name: 'Quản lý Role', 
      path: '/admin/roles', 
      icon: <ShieldCheck size={18} />,
      permission: 'view_roles'
    },
    { 
      name: 'Thêm Role', 
      path: '/admin/roles/create', 
      icon: <Plus size={18} />,
      permission: 'create_role'
    },
    { 
      name: 'Quản lý Permission', 
      path: '/admin/permissions', 
      icon: <ShieldCheck size={18} />,
      permission: 'view_permissions'
    },
    { 
      name: 'Mã giảm giá', 
      path: '/admin/voucher', 
      icon: <PercentCircle size={18} />,
      permission: 'view_vouchers'
    },
  ]

  // Lọc menu items dựa trên permissions
  const filteredMenuItems = menuItems.filter(item => {
    if (loading) return false; // Không hiển thị gì khi đang loading
    if (item.permission === null) return true; // Dashboard luôn hiển thị
    return hasPermission(item.permission);
  });

  if (loading) {
    return (
      <aside className="w-64 h-screen bg-white shadow-md sticky top-0">
        <div className="p-6 text-xl font-bold border-b text-black">Quản trị</div>
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 h-screen bg-white shadow-md sticky top-0">
      <div className="p-6 text-xl font-bold border-b text-black">Quản trị</div>
      <nav className="p-4 space-y-2">
        {filteredMenuItems.map((item) => (
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