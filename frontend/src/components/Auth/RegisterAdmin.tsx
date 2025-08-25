import React, { useState, useEffect } from 'react';
import api from '../../middleware/axios';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaSpinner, FaExclamationTriangle, FaCheckCircle, FaShieldAlt, FaPhone } from 'react-icons/fa';

const RegisterAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
    } else if (error === 'Mật khẩu xác nhận không khớp') {
      setError(null);
    }
  }, [password, confirmPassword]);

  const validateForm = () => {
    if (!name.trim()) {
      setError('Vui lòng nhập họ và tên');
      return false;
    }
    if (!email.trim()) {
      setError('Vui lòng nhập địa chỉ email');
      return false;
    }
    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return false;
    }
    // Validate số điện thoại (chỉ 10 số)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      setError('Số điện thoại không hợp lệ (phải có đúng 10 số)');
      return false;
    }
    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      return false;
    }
    if (password.length < 8) {
      setError('Mật khẩu admin phải có ít nhất 8 ký tự');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setError(null);
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await api.post('/register/admin', { name, email, phone, password });
      const data = response.data;
      
      if (data.status) {
        setSuccessMessage('Tạo tài khoản admin thành công! Đang chuyển đến trang đăng nhập...');
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Tạo tài khoản admin thất bại');
      }
    } catch (err: any) {
      console.error('RegisterAdmin error:', err);
      
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Thông tin không hợp lệ');
      } else if (err.response?.status === 409) {
        setError('Email này đã được sử dụng. Vui lòng chọn email khác.');
      } else if (err.response?.status === 500) {
        setError('Lỗi server. Vui lòng thử lại sau.');
      } else if (!err.response) {
        setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.');
      } else {
        setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'password' | 'confirm') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <>
      <Helmet>
        <title>Đăng ký Admin - Gấu Bông Shop</title>
        <meta name="description" content="Tạo tài khoản quản trị viên cho hệ thống Gấu Bông Shop" />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>
      
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-8"
        style={{
          backgroundImage: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
        }}
      >
        <div className="w-full max-w-md bg-white/95 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaShieldAlt className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Tạo tài khoản Admin</h2>
            <p className="text-gray-600">Đăng ký tài khoản quản trị viên hệ thống</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <FaCheckCircle className="text-green-500 text-lg flex-shrink-0" />
              <p className="text-green-700 font-medium">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <FaExclamationTriangle className="text-red-500 text-lg flex-shrink-0" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Warning Notice */}
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <FaShieldAlt className="text-amber-600 text-sm" />
              <h4 className="text-amber-800 font-semibold">Lưu ý quan trọng</h4>
            </div>
            <p className="text-amber-700 text-sm">
              Chỉ tạo tài khoản admin khi chưa có admin nào trong hệ thống. 
              Tài khoản admin sẽ có quyền quản trị toàn bộ hệ thống.
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaUser className="text-purple-500" />
                Họ và tên Admin <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 bg-white/90"
                placeholder="Nhập họ và tên của admin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaEnvelope className="text-purple-500" />
                Email Admin <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 bg-white/90"
                placeholder="Nhập email admin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaPhone className="text-purple-500" />
                Số điện thoại Admin <span className="text-red-500">*</span>
              </label>
                             <input
                 type="tel"
                 className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 bg-white/90"
                 placeholder="Nhập số điện thoại (10 số)"
                 value={phone}
                 onChange={(e) => setPhone(e.target.value)}
                 maxLength={10}
                 required
                 disabled={loading}
               />
               <p className="text-xs text-gray-500 mt-1">Ví dụ: 0123456789</p>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaLock className="text-purple-500" />
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 bg-white/90"
                  placeholder="Nhập mật khẩu (ít nhất 8 ký tự)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('password')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Mật khẩu admin phải có ít nhất 8 ký tự cho bảo mật tốt hơn</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaLock className="text-purple-500" />
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`w-full border ${
                    error === 'Mật khẩu xác nhận không khớp' ? 'border-red-500' : 'border-gray-300'
                  } rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 bg-white/90`}
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            {/* Password Match Indicator */}
            {password && confirmPassword && (
              <div className={`p-3 rounded-xl text-sm ${
                password === confirmPassword
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {password === confirmPassword
                  ? '✓ Mật khẩu xác nhận khớp'
                  : '✗ Mật khẩu xác nhận không khớp'
                }
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !!error}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Đang tạo tài khoản...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <FaShieldAlt />
                  Tạo tài khoản Admin
                </div>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Đã có tài khoản?{' '}
              <Link
                to="/login"
                className="text-purple-500 hover:text-purple-600 font-semibold transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </p>
            <p className="text-gray-600 mt-2">
              Đăng ký tài khoản thường?{' '}
              <Link
                to="/register"
                className="text-blue-500 hover:text-blue-600 font-semibold transition-colors"
              >
                Đăng ký client
              </Link>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-xs text-blue-700 text-center">
              <FaShieldAlt className="inline mr-1" />
              Tài khoản admin có quyền truy cập toàn bộ hệ thống. 
              Vui lòng bảo mật thông tin đăng nhập.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterAdmin;
