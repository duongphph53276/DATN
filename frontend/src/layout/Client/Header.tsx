import { FaPhoneAlt, FaSearch, FaUser, FaSignOutAlt, FaUserCircle, FaClipboardList, FaChevronDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import CartCountBadge from "./CartCountBadge";
import NotificationBell from '../../components/common/NotificationBell';
import api from "../../middleware/axios";
import { User } from "../../interfaces/user";
import { clearCartDisplay } from "../../utils/cartUtils";

const Header = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/category");
        if (response.data.status) {
          console.log("Fetched Categories:", response.data.data);
          // Lấy tất cả danh mục để có thể tạo dropdown
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchUserProfile = async () => {
      if (isLoggedIn) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/profile`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          if (data.status) {
            setUser(data.user);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchCategories();
    fetchUserProfile();
  }, [isLoggedIn]);

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setShowUserMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    clearCartDisplay(); // Chỉ clear hiển thị, GIỮ cart trong localStorage

    setShowUserMenu(false);
    navigate("/");
  };

  // Lấy danh mục cha theo display_limit
  const parentCategories = categories.filter((cat) => !cat.parent_id);
  const displayLimit = parentCategories[0]?.display_limit || 6;
  const limitedParentCategories = parentCategories.slice(0, displayLimit);

  // Hàm lấy subcategories cho một category cha
  const getSubCategories = (parentId: string) => {
    return categories.filter((cat) => 
      cat.parent_id && 
      (typeof cat.parent_id === 'string' 
        ? cat.parent_id === parentId 
        : cat.parent_id._id === parentId)
    );
  };

  console.log("Limited Parent Categories:", limitedParentCategories);

  return (
    <header className="shadow-lg z-50 bg-white relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo Bemori" className="h-10 w-auto" />
          <span className="text-2xl font-bold text-pink-500">FUZZYBEAR</span>
        </Link>
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Nhập sản phẩm cần tìm"
              className="w-full border border-rose-300 rounded-md py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-rose-500 hover:text-rose-700">
              <FaSearch size={18} />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-6 relative">
          <div className="flex items-center text-rose-300 font-medium space-x-2">
            <FaPhoneAlt size={18} />
            <span>097.989.6616</span>
          </div>
          <CartCountBadge />
          <NotificationBell isLoggedIn={isLoggedIn} />
          <div className="relative" ref={dropdownRef}>
            {isLoggedIn ? (
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-rose-200 hover:border-rose-400 transition-all duration-200"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-rose-400 text-lg" />
                )}
              </button>
            ) : (
              <button
                className="text-rose-400 hover:text-rose-600 transition-colors duration-200"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <FaUser size={20} />
              </button>
            )}
            
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                {isLoggedIn ? (
                  <>
                    {/* User Info Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-rose-200">
                          {user?.avatar ? (
                            <img
                              src={user.avatar}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FaUser className="text-rose-400 text-lg w-full h-full flex items-center justify-center" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {user?.name || 'Người dùng'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email || 'user@example.com'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition-colors duration-150"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FaUserCircle className="mr-3 text-rose-500" />
                        Hồ sơ
                      </Link>
                      <Link
                        to="/my-orders"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition-colors duration-150"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FaClipboardList className="mr-3 text-rose-500" />
                        Đơn hàng của tôi
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt className="mr-3" />
                        Đăng xuất
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-3 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">Tài khoản</p>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/login"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition-colors duration-150"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FaUser className="mr-3 text-rose-500" />
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition-colors duration-150"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FaUserCircle className="mr-3 text-rose-500" />
                        Đăng ký
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <nav className="bg-gradient-to-r from-rose-400 to-pink-500 text-white text-sm font-medium shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-2 py-4 px-4">
          <Link to="/" className="hover:text-rose-100 transition-colors duration-200 font-semibold">
            TRANG CHỦ
          </Link>
          {limitedParentCategories.map((category) => {
            const subCategories = getSubCategories(category._id);
            const hasSubCategories = subCategories.length > 0;
            
            return (
              <div key={category._id} className="relative group">
                <Link
                  to={`/category/${category.slug}`}
                  className={`flex items-center gap-1 hover:text-rose-100 transition-colors duration-200 ${
                    hasSubCategories ? 'cursor-pointer' : ''
                  }`}
                >
                  {category.name}
                  {hasSubCategories && (
                    <FaChevronDown className="text-xs transition-transform duration-200 group-hover:rotate-180" />
                  )}
                </Link>
                {hasSubCategories && (
                  <div className="absolute left-0 top-full mt-2 bg-white text-gray-800 shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20 min-w-[200px] border border-gray-100 overflow-hidden">
                    <div className="py-2">
                      {subCategories.map((subCat) => (
                        <Link
                          key={subCat._id}
                          to={`/category/${subCat.slug}`}
                          className="block px-4 py-3 text-sm hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 hover:text-rose-600 transition-colors duration-150 border-b border-gray-50 last:border-b-0"
                        >
                          {subCat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          <Link to="/all-products" className="hover:text-rose-100 transition-colors duration-200 font-semibold">
            TẤT CẢ SP ▾
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;