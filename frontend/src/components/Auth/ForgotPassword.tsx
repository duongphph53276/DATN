import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaEnvelope, FaSpinner, FaExclamationTriangle, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import api from '../../middleware/axios';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Vui lòng nhập địa chỉ email');
      return;
    }

    setError(null);
    setSuccessMessage('');
    setLoading(true);

    try {
      // Giả lập API call - thay thế bằng API thực tế khi có
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // const response = await api.post('/forgot-password', { email });
      // const data = response.data;
      
      setSuccessMessage('Email khôi phục mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư của bạn.');
      
    } catch (err: any) {
      console.error('Forgot password error:', err);
      
      if (err.response?.status === 404) {
        setError('Email không tồn tại trong hệ thống.');
      } else if (err.response?.status === 400) {
        setError('Vui lòng nhập địa chỉ email hợp lệ.');
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

  return (
    <>
      <Helmet>
        <title>Quên mật khẩu - Gấu Bông Shop</title>
        <meta name="description" content="Khôi phục mật khẩu tài khoản Gấu Bông Shop" />
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
              <FaEnvelope className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Quên mật khẩu?</h2>
            <p className="text-gray-600">Đừng lo lắng, chúng tôi sẽ giúp bạn khôi phục</p>
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

          {/* Instructions */}
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-700 text-center">
              Nhập địa chỉ email của bạn và chúng tôi sẽ gửi link khôi phục mật khẩu
            </p>
          </div>

          {/* Forgot Password Form */}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Đang gửi email...
                </div>
              ) : (
                'Gửi link khôi phục'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-rose-500 hover:text-rose-600 font-medium transition-colors"
            >
              <FaArrowLeft size={14} />
              Quay lại đăng nhập
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">💡 Cần hỗ trợ?</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Kiểm tra thư mục spam nếu không nhận được email</li>
              <li>• Đảm bảo email đã được đăng ký trong hệ thống</li>
              <li>• Liên hệ hỗ trợ nếu gặp vấn đề</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
