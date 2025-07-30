import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { userInfo, loading } = usePermissions();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
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
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center relative">
      <h1 className="text-xl font-semibold text-black">Admin Dashboard</h1>
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        {loading ? (
          <span className="text-sm text-gray-700">Đang tải...</span>
        ) : (
          <span className="text-sm text-gray-700">
            Xin chào, {userInfo?.name || 'Admin'} 
            {userInfo?.role && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {userInfo.role.name}
              </span>
            )}
          </span>
        )}
        <div className="relative">
          <img
            src={userInfo?.avatar || "https://picsum.photos/200"}
            alt="Avatar"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-50">
              <div className="px-4 py-2 border-b">
                <div className="text-sm font-medium text-gray-900">{userInfo?.name || 'Admin'}</div>
                <div className="text-xs text-gray-500">{userInfo?.email}</div>
                {userInfo?.role && (
                  <div className="text-xs text-blue-600 mt-1">Role: {userInfo.role.name}</div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;

