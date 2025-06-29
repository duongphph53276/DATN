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
        // Giải mã token để lấy role
        const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
        const role = tokenPayload.role;

        // Chuyển hướng dựa trên role
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
      // Phân tích lỗi từ backend
      if (errorMessage === 'Invalid credentials') {
        // Kiểm tra xem email có tồn tại không (giả định backend trả về lỗi cụ thể)
        const userExists = await api.get(`/check-email?email=${email}`); // Cần endpoint check-email
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
      className="fixed inset-0 bg-cover bg-center bg-no-repeat flex justify-center items-center"
      style={{
        backgroundImage:
          'url(https://img.playbook.com/IZSaaisbuPYRUSQYBZckzA61Px-1dJx2_5pGRp3N4dk/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljLzRkZmUwYjQ2/LWRhNjAtNDQ2Yy1h/Y2UxLWM0ZTZkMGI3/NTdlMA)',
      }}
    >
      <div className="w-[420px] bg-white/10 border border-white/20 backdrop-blur-xl shadow-lg text-white rounded-xl p-10">
        <form onSubmit={handleSubmit}>
          <h1 className="text-3xl font-semibold text-center mb-8">Login</h1>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="relative w-full h-[50px] mb-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-full bg-transparent border border-white/20 rounded-full text-white px-5 pr-12 outline-none placeholder-white"
            />
            <i className="bx bxs-user absolute right-5 top-1/2 transform -translate-y-1/2 text-xl"></i>
          </div>

          <div className="relative w-full h-[50px] mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-full bg-transparent border border-white/20 rounded-full text-white px-5 pr-12 outline-none placeholder-white"
            />
            <i className="bx bxs-lock-alt absolute right-5 top-1/2 transform -translate-y-1/2 text-xl"></i>
          </div>

          <div className="flex justify-between text-sm mb-4">
            <label className="flex items-center gap-1">
              <input type="checkbox" className="accent-white" />
              Remember me
            </label>
            <a href="#" className="hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full h-[45px] rounded-full bg-white text-gray-800 font-semibold shadow-md hover:bg-gray-100 transition"
          >
            Login
          </button>

          <div className="text-center text-sm mt-6">
            <p>
              Don't have an account?{' '}
              <a href="/register" className="font-semibold hover:underline">
                Register
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;