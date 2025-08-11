import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { FaUser, FaSignOutAlt, FaBell, FaCog } from 'react-icons/fa';
import NotificationAdmin from '../../components/Admin/common/NotificationAdmin';
import { clearCartDisplay } from '../../utils/cartUtils';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { userInfo, loading } = usePermissions();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    clearCartDisplay(); // Chỉ clear hiển thị, GIỮ cart trong localStorage
    navigate('/');
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
      {/* Left Section */}
      <div className="flex items-center space-x-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý hệ thống</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4" ref={dropdownRef}>
        {/* Notifications */}
        <NotificationAdmin isLoggedIn={!!userInfo} />

        {/* Settings */}
        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
          <FaCog className="text-lg" />
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          {loading ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : (
            <>
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {userInfo?.name || 'Admin'}
                </p>
                {userInfo?.role && (
                  <span className="text-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2 py-1 rounded-full">
                    {userInfo.role.name}
                  </span>
                )}
              </div>
              
              <div className="relative">
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {userInfo?.avatar ? (
                    <img
                      src={userInfo.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <FaUser className="text-white text-sm" />
                    </div>
                  )}
                </button>
                
                {isOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden backdrop-blur-sm">
                    {/* User Info Header */}
                    <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-200 shadow-sm">
                          {userInfo?.avatar ? (
                            <img
                              src={userInfo.avatar}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                              <FaUser className="text-white text-lg" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {userInfo?.name || 'Admin'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {userInfo?.email || 'admin@example.com'}
                          </p>
                          {userInfo?.role && (
                            <span className="inline-block mt-1 text-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2 py-1 rounded-full">
                              {userInfo.role.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-2">
                      <button className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                        <FaUser className="mr-3 text-blue-500" />
                        Hồ sơ
                      </button>
                      <button className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                        <FaCog className="mr-3 text-blue-500" />
                        Cài đặt
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt className="mr-3" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;

