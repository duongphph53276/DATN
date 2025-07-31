import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Home,
  Folder,
  Plus,
  Package,
  Settings,
  User,
  ShieldCheck,
  PercentCircle,
  Truck,
  BarChart3,
  ShoppingCart,
  Users,
  Key,
  Tag,
  Menu,
  X
} from 'lucide-react'
import { usePermissions } from '../../hooks/usePermissions'

const Sidebar = () => {
  const { hasPermission, loading } = usePermissions();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      title: 'Tổng quan',
      items: [
        { 
          name: 'Dashboard', 
          path: '/admin', 
          icon: <BarChart3 size={20} />,
          permission: null
        }
      ]
    },
    {
      title: 'Quản lý sản phẩm',
      items: [
        { 
          name: 'Danh mục', 
          path: '/admin/category', 
          icon: <Folder size={20} />,
          permission: 'view_categories'
        },
        { 
          name: 'Thêm danh mục', 
          path: '/admin/category/add', 
          icon: <Plus size={20} />,
          permission: 'create_category'
        },
        { 
          name: 'Sản phẩm', 
          path: '/admin/product', 
          icon: <Package size={20} />,
          permission: 'view_products'
        },
        { 
          name: 'Thuộc tính', 
          path: '/admin/attribute', 
          icon: <Settings size={20} />,
          permission: 'view_attributes'
        }
      ]
    },
    {
      title: 'Quản lý đơn hàng',
      items: [
        { 
          name: 'Đơn hàng', 
          path: '/admin/order-list', 
          icon: <ShoppingCart size={20} />,
          permission: 'view_orders'
        }
      ]
    },
    {
      title: 'Quản lý người dùng',
      items: [
        { 
          name: 'Người dùng', 
          path: '/admin/users', 
          icon: <Users size={20} />,
          permission: 'view_users'
        },
        { 
          name: 'Vai trò', 
          path: '/admin/roles', 
          icon: <ShieldCheck size={20} />,
          permission: 'view_roles'
        },
        { 
          name: 'Thêm vai trò', 
          path: '/admin/roles/create', 
          icon: <Plus size={20} />,
          permission: 'create_role'
        },
        { 
          name: 'Quyền hạn', 
          path: '/admin/permissions', 
          icon: <Key size={20} />,
          permission: 'view_permissions'
        }
      ]
    },
    {
      title: 'Khuyến mãi',
      items: [
        { 
          name: 'Mã giảm giá', 
          path: '/admin/voucher', 
          icon: <Tag size={20} />,
          permission: 'view_vouchers'
        }
      ]
    }
  ]

  // Lọc menu items dựa trên permissions
  const filteredMenuItems = menuItems.map(section => ({
    ...section,
    items: section.items.filter(item => {
      if (loading) return false;
      if (item.permission === null) return true;
      return hasPermission(item.permission);
    })
  })).filter(section => section.items.length > 0);

  if (loading) {
    return (
      <aside className="w-64 h-screen bg-white/90 backdrop-blur-md border-r border-gray-200/50 sticky top-0">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} h-screen bg-white/90 backdrop-blur-md border-r border-gray-200/50 sticky top-0 transition-all duration-300 ease-in-out`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-white text-sm" />
              </div>
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Admin
                </h2>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {isCollapsed ? <Menu size={16} /> : <X size={16} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-80px)]">
        {filteredMenuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-2">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 group relative
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                    }
                    ${isCollapsed ? 'justify-center' : ''}`
                  }
                  title={isCollapsed ? item.name : ''}
                >
                  {({ isActive }) => (
                    <>
                      <div className={`${isCollapsed ? 'w-5 h-5' : 'w-5 h-5'} flex items-center justify-center`}>
                        {item.icon}
                      </div>
                      {!isCollapsed && (
                        <span className="flex-1">{item.name}</span>
                      )}
                      {isActive && !isCollapsed && (
                        <div className="absolute right-2 w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm">
          <div className="text-xs text-gray-500 text-center">
            © Admin Panel
          </div>
        </div>
      )}
    </aside>
  )
}

export default Sidebar