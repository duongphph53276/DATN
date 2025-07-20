import React, { useState } from 'react';
import api from '../../middleware/axios';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState<{ message: string; banReason: string; bannedUntil: string } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const response = await api.post('/login', { email, password });
      console.log('Response data:', response.data);
      const data = response.data;
      if (data.token) {
        localStorage.setItem('token', data.token);
        // Lấy role từ data.user nếu có, hoặc giải mã từ token
        const roleFromUser = data.user?.role;
        const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
        const role = roleFromUser || tokenPayload.role || 'client';
        localStorage.setItem('role', role);
        if (role === 'admin') {
          alert('Đăng nhập thành công');
          navigate('/admin');
        } else {
          alert('Đăng nhập thành công');
          navigate('/');
        }
      } else {
        setErrorMessage('Login failed: No token');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.status === 403) {
        const { message, banReason, bannedUntil } = error.response.data;
        const banDate = bannedUntil ? new Date(bannedUntil).toLocaleString() : 'không xác định';
        setPopupContent({ message, banReason, bannedUntil: banDate });
        setIsPopupOpen(true);
      } else {
        setErrorMessage(error.response?.data?.message || 'Lỗi kết nối hoặc server');
      }
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupContent(null);
  };

  return (
    <>
      <Helmet>
        <title>Đăng nhập</title>
        <meta name="description" content="Đăng nhập login" />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
        style={{
          backgroundImage: "url('https://img.lovepik.com/bg/20240224/Captivating-3D-Rendered-Illustration-with-Charming-Teddy-Bears-and-Fluffy_3695349_wh300.jpg')",
        }}
      >
        <div className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-rose-600 mb-6">Đăng nhập</h2>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {errorMessage}
            </div>
          )}

          {isPopupOpen && popupContent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h3 className="text-lg font-bold mb-2">Tài khoản bị cấm</h3>
                <p className="mb-2"><strong>Thông báo:</strong> {popupContent.message}</p>
                <p className="mb-2"><strong>Lý do:</strong> {popupContent.banReason}</p>
                <p className="mb-4"><strong>Thời gian mở khóa:</strong> {popupContent.bannedUntil}</p>
                <button
                  onClick={closePopup}
                  className="w-full bg-rose-500 text-white p-2 rounded-md hover:bg-rose-600 transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-rose-500" />
                Ghi nhớ đăng nhập
              </label>
              <a href="#" className="hover:underline text-rose-500">
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 rounded-lg shadow-lg transition duration-300"
            >
              Đăng nhập
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-600">
            Chưa có tài khoản?{' '}
            <a href="/register" className="text-rose-600 font-semibold hover:underline">
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;