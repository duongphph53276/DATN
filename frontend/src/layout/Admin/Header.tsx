import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // hoặc sessionStorage tùy bạn dùng gì
    navigate('/login');
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
        <span className="text-sm text-gray-700">Xin chào, Admin</span>
        <div className="relative">
          <img
            src="https://picsum.photos/200"
            alt="Avatar"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50">
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
