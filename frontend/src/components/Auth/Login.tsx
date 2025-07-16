import React, { useState } from 'react';
import api from '../../middleware/axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, password });
      const data = response.data;
      if (data.token) {
        localStorage.setItem('token', data.token);
        const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
        const role = tokenPayload.role;

        if (role === 'admin') {
          window.location.href = '/admin';
        } else if (role === 'client') {
          window.location.href = '/';
        } else {
          setError('Unknown role. Please contact support.');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
      if (errorMessage === 'Invalid credentials') {
        const userExists = await api.get(`/check-email?email=${email}`);
        if (!userExists.data.exists) {
          setError('Email không tồn tại, tài khoản chưa được đăng ký');
        } else {
          setError('Bạn đã nhập sai mật khẩu, xin vui lòng nhập lại');
          setPassword('');
        }
      } else {
        setError(errorMessage);
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage:
          "url('https://img.lovepik.com/bg/20240224/Captivating-3D-Rendered-Illustration-with-Charming-Teddy-Bears-and-Fluffy_3695349_wh300.jpg')",
      }}
    >
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-rose-600 mb-6">Đăng nhập</h2>

        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

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
          <a
            href="/register"
            className="text-rose-600 font-semibold hover:underline"
          >
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
