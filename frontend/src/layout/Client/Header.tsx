import { FaPhoneAlt, FaSearch, FaUser, FaSignOutAlt, FaUserCircle, FaClipboardList, FaChevronDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import CartCountBadge from "./CartCountBadge";
import NotificationBell from '../../components/common/NotificationBell';
import api from "../../middleware/axios";
import { User } from "../../interfaces/user";
import { clearCartDisplay } from "../../utils/cartUtils";
import { IProduct } from "../../interfaces/product";

const Header = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IProduct[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Debounced search function
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await api.get(`/product?search=${encodeURIComponent(query)}`);
      if (response.data.status) {
        // Sắp xếp kết quả theo độ phù hợp
        const sortedResults = response.data.data
          .sort((a: IProduct, b: IProduct) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            const queryLower = query.toLowerCase();
            
            // Ưu tiên kết quả bắt đầu bằng query
            const aStartsWith = aName.startsWith(queryLower);
            const bStartsWith = bName.startsWith(queryLower);
            
            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
            
            // Sau đó ưu tiên theo độ dài tên (ngắn hơn = phù hợp hơn)
            return aName.length - bName.length;
          })
          .slice(0, 5); // Limit to 5 results
        
        setSearchResults(sortedResults);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Function để highlight text trong kết quả tìm kiếm
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-semibold">
          {part}
        </span>
      ) : part
    );
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSearchResults || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleProductSelect(searchResults[selectedIndex]);
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        setShowSearchResults(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Reset selected index when search results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchResults]);

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      performSearch(query);
    }, 300); // 300ms delay

    setSearchTimeout(timeout);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowSearchResults(false);
    }
  };

  // Handle click outside search results
  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setShowUserMenu(false);
    }
    if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
      setShowSearchResults(false);
    }
  };

  // Handle product selection from search results
  const handleProductSelect = (product: IProduct) => {
    navigate(`/product/${product._id}`);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/category");
        if (response.data.status) {
          console.log("Fetched Categories:", response.data.data);
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

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    clearCartDisplay();

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
        <div className="flex-1 max-w-md mx-6" ref={searchRef}>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm (có thể gõ không dấu)..."
              className="w-full border border-rose-300 rounded-md py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-rose-200"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                if (searchResults.length > 0) {
                  setShowSearchResults(true);
                }
              }}
              onKeyDown={handleKeyDown}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-rose-500 hover:text-rose-700"
            >
              <FaSearch size={18} />
            </button>
            
            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-500 mx-auto"></div>
                    <p className="mt-2">Đang tìm kiếm...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    {searchResults.map((product, index) => (
                                              <div
                          key={product._id}
                          className={`flex items-center p-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150 ${
                            selectedIndex === index 
                              ? 'bg-rose-100 border-rose-200' 
                              : 'hover:bg-rose-50'
                          }`}
                          onClick={() => handleProductSelect(product)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          onMouseLeave={() => setSelectedIndex(-1)}
                        >
                        <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                          {product.images ? (
                            <img
                              src={product.images}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <FaSearch className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {highlightText(product.name, searchQuery)}
                          </h4>
                          {product.variants && product.variants.length > 0 && (
                            <p className="text-xs text-rose-600 font-medium">
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                              }).format(product.variants[0].price)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                                         <div className="p-3 border-t border-gray-100">
                       <div className="text-xs text-gray-500 mb-2">
                         Tìm thấy {searchResults.length} kết quả
                       </div>
                       <button
                         type="submit"
                         className="w-full text-center text-sm text-rose-600 hover:text-rose-700 font-medium"
                         onClick={handleSearch}
                       >
                         Xem tất cả kết quả cho "{searchQuery}"
                       </button>
                     </div>
                  </>
                ) : searchQuery.trim() ? (
                  <div className="p-4 text-center text-gray-500">
                    <p>Không tìm thấy sản phẩm nào</p>
                  </div>
                ) : null}
              </div>
            )}
          </form>
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
                  className={`flex items-center gap-1 hover:text-rose-100 transition-colors duration-200 ${hasSubCategories ? 'cursor-pointer' : ''
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