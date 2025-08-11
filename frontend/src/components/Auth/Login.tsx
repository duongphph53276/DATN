import React, { useState } from 'react';
import api from '../../middleware/axios';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaSpinner, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { migrateOldCart } from '../../utils/cartUtils';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState<{ message: string; banReason: string; bannedUntil: string } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await api.post('/login', { email, password });
      const data = response.data;

      if (data.token) {
        localStorage.setItem('token', data.token);
        const roleFromUser = data.user?.role;
        const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
        const role = roleFromUser || tokenPayload.role || 'client';
        localStorage.setItem('role', role);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Migrate cart cũ sau khi login
        migrateOldCart();
        
        // Trigger event để các component biết user đã login
        window.dispatchEvent(new Event("cartUpdated"));
        
        setSuccessMessage('Đăng nhập thành công! Đang chuyển hướng...');
        
        setTimeout(() => {
          if (role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 1500);
      } else {
        setErrorMessage('Đăng nhập thất bại: Không nhận được token');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.response?.status === 403) {
        const { message, banReason, bannedUntil } = error.response.data;
        const banDate = bannedUntil ? new Date(bannedUntil).toLocaleString('vi-VN') : 'không xác định';
        setPopupContent({ message, banReason, bannedUntil: banDate });
        setIsPopupOpen(true);
      } else if (error.response?.status === 401) {
        setErrorMessage('Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.');
      } else if (error.response?.status === 400) {
        setErrorMessage('Vui lòng nhập đầy đủ thông tin đăng nhập.');
      } else if (error.response?.status === 500) {
        setErrorMessage('Lỗi server. Vui lòng thử lại sau.');
      } else if (!error.response) {
        setErrorMessage('Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.');
      } else {
        setErrorMessage(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupContent(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Helmet>
        <title>Đăng nhập - Gấu Bông Shop</title>
        <meta name="description" content="Đăng nhập vào tài khoản Gấu Bông Shop" />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>
      
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-8"
        style={{
          backgroundImage: "url('https://img.lovepik.com/bg/20240224/Captivating-3D-Rendered-Illustration-with-Charming-Teddy-Bears-and-Fluffy_3695349_wh300.jpg')",
        }}
      >
        <div className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaLock className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Chào mừng trở lại!</h2>
            <p className="text-gray-600">Đăng nhập để tiếp tục mua sắm</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <FaCheckCircle className="text-green-500 text-lg flex-shrink-0" />
              <p className="text-green-700 font-medium">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <FaExclamationTriangle className="text-red-500 text-lg flex-shrink-0" />
              <p className="text-red-700 font-medium">{errorMessage}</p>
            </div>
          )}

          {/* Ban Popup */}
          {isPopupOpen && popupContent && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-red-200">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaExclamationTriangle className="text-red-500 text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">Tài khoản bị cấm</h3>
                  <p className="text-gray-600 text-sm">Tài khoản của bạn đã bị tạm khóa</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-700">
                      <strong>Lý do:</strong> {popupContent.banReason}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-700">
                      <strong>Thời gian mở khóa:</strong> {popupContent.bannedUntil}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={closePopup}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg"
                >
                  Đã hiểu
                </button>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaEnvelope className="text-rose-500" />
                Địa chỉ email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all duration-200 bg-white/80"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaLock className="text-rose-500" />
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all duration-200 bg-white/80"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-rose-500 border-gray-300 rounded focus:ring-rose-400" 
                  disabled={loading}
                />
                Ghi nhớ đăng nhập
              </label>
              <Link 
                to="/forgotpassword" 
                className="text-sm text-rose-500 hover:text-rose-600 font-medium transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Đang đăng nhập...
                </div>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Chưa có tài khoản?{' '}
              <Link 
                to="/register" 
                className="text-rose-500 hover:text-rose-600 font-semibold transition-colors"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-xs text-blue-700 text-center">
              🔒 Thông tin đăng nhập của bạn được bảo mật an toàn
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;