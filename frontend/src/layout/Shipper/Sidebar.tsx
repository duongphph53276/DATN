import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Package,
  Truck,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('shipper-sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('shipper-sidebar-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const menuItems = [
    {
      title: 'Quản lý giao hàng',
      items: [
        { 
          name: 'Đơn hàng của tôi', 
          path: '/shipper', 
          icon: <Package size={20} />,
        },
        { 
          name: 'Đang giao hàng', 
          path: '/shipper/shipping', 
          icon: <Truck size={20} />,
        },
        { 
          name: 'Đã giao hàng', 
          path: '/shipper/delivered', 
          icon: <CheckCircle size={20} />,
        },
        { 
          name: 'Đơn hàng đã hủy', 
          path: '/shipper/cancelled', 
          icon: <X size={20} />,
        }
      ]
    }
  ]

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} h-[calc(100vh-64px)] bg-white/90 backdrop-blur-md border-r border-gray-200/50 sticky top-16 transition-all duration-300 ease-in-out group`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-4 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg"
        title={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Navigation */}
      <nav className="p-4 space-y-6 overflow-y-auto h-full">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-2">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <div key={item.name} className="relative group/item">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 relative
                      ${
                        isActive
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-green-600'
                      }
                      ${isCollapsed ? 'justify-center' : ''}`
                    }
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
                  
                  {/* Tooltip khi thu gọn */}
                  {isCollapsed && (
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                      {item.name}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm">
        {!isCollapsed ? (
          <div className="text-xs text-gray-500 text-center">
            © Shipper Panel
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-md flex items-center justify-center" title="Shipper Panel">
              <Package className="text-white" size={12} />
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar

