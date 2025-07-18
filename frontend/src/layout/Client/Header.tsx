import { FaPhoneAlt, FaSearch, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; // 👈 thêm useNavigate
import { useState } from "react";
import CartCountBadge from "./CartCountBadge";

const Header = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate(); // 👈 khởi tạo navigate
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowUserMenu(false); // 👈 ẩn menu
    navigate("/"); // 👈 chuyển về trang chủ
  };

  return (
    <header className="shadow z-50 bg-white relative">
      {/* Top bar: Logo – Search – Hotline */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo Bemori" className="h-10 w-auto" />
          <span className="text-2xl font-bold text-pink-500">FUZZYBEAR</span>
        </Link>

        {/* Search bar */}
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

        {/* Hotline + Cart + User */}
        <div className="flex items-center space-x-6 relative">
          <div className="flex items-center text-rose-300 font-medium space-x-2">
            <FaPhoneAlt size={18} />
            <span>097.989.6616</span>
          </div>
          <CartCountBadge />

          {/* User Icon */}
          <div className="relative">
            <button
              className="text-rose-400 hover:text-rose-600"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <FaUser size={20} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md z-50 text-sm">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-rose-50"
                    >
                      Hồ sơ
                    </Link>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-rose-50"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-rose-50"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 hover:bg-rose-50"
                    >
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <nav className="bg-rose-300 text-white text-sm font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-2 py-3 px-4">
          <Link to="/" className="hover:text-rose-100 transition">TRANG CHỦ</Link>
          <Link to="/blindbox" className="hover:text-rose-100 transition">BLINDBOX</Link>

          {/* GẤU TEDDY */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-rose-100 transition">
              GẤU TEDDY ▾
            </button>
            <ul className="absolute left-0 top-full mt-1 bg-white text-gray-800 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[180px]">
              <li><Link to="#" className="block px-4 py-2 hover:bg-rose-100">Teddy nhỏ</Link></li>
              <li><Link to="#" className="block px-4 py-2 hover:bg-rose-100">Teddy lớn</Link></li>
            </ul>
          </div>

          {/* BỘ SƯU TẬP */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-rose-100 transition">
              BỘ SƯU TẬP ▾
            </button>
            <ul className="absolute left-0 top-full mt-1 bg-white text-gray-800 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[180px]">
              <li><Link to="#" className="block px-4 py-2 hover:bg-rose-100">Valentine</Link></li>
              <li><Link to="#" className="block px-4 py-2 hover:bg-rose-100">Sinh nhật</Link></li>
              <li><Link to="#" className="block px-4 py-2 hover:bg-rose-100">Noel</Link></li>
            </ul>
          </div>

          {/* HOẠT HÌNH */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-rose-100 transition">
              HOẠT HÌNH ▾
            </button>
            <ul className="absolute left-0 top-full mt-1 bg-white text-gray-800 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[180px]">
              <li><Link to="#" className="block px-4 py-2 hover:bg-rose-100">Doraemon</Link></li>
              <li><Link to="#" className="block px-4 py-2 hover:bg-rose-100">Kitty</Link></li>
              <li><Link to="#" className="block px-4 py-2 hover:bg-rose-100">Pokemon</Link></li>
            </ul>
          </div>

          {/* THÚ BÔNG */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-rose-100 transition">
              THÚ BÔNG ▾
            </button>
            <ul className="absolute left-0 top-full mt-1 bg-white text-gray-800 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[180px]">
              <li><Link to="#" className="block px-4 py-2 hover:bg-rose-100">Size nhỏ</Link></li>
              <li><Link to="#" className="block px-4 py-2 hover:bg-rose-100">Size lớn</Link></li>
            </ul>
          </div>

          <Link to="/goi-bong" className="hover:text-rose-100 transition">GỐI BÔNG & PHỤ KIỆN</Link>
          <Link to="/goc-cua-gau" className="hover:text-rose-100 transition">GÓC CỦA GẤU ▾</Link>
          <Link to="/all-products" className="hover:text-rose-100 transition">TẤT CẢ SP ▾</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
