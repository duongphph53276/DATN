import React, { useState, useEffect } from 'react';
import api from '../../middleware/axios';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setError('Passwords do not match');
    } else if (error === 'Passwords do not match') {
      setError(null);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    try {
      const response = await api.post('/register', {name, email, password });
      const data = response.data;
      if (data.token) {
        localStorage.setItem('token', data.token);
        alert("Đăng ký thành công");
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
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
          <h1 className="text-3xl font-semibold text-center mb-8">Register</h1>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="relative w-full h-[50px] mb-6">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-full bg-transparent border border-white/20 rounded-full text-white px-5 pr-12 outline-none placeholder-white"
            />
            <i className="bx bxs-user absolute right-5 top-1/2 transform -translate-y-1/2 text-xl"></i>
          </div>

          <div className="relative w-full h-[50px] mb-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-full bg-transparent border border-white/20 rounded-full text-white px-5 pr-12 outline-none placeholder-white"
            />
            <i className="bx bxs-envelope absolute right-5 top-1/2 transform -translate-y-1/2 text-xl"></i>
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

          <div className="relative w-full h-[50px] mb-6">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`w-full h-full bg-transparent border border-white/20 rounded-full text-white px-5 pr-12 outline-none placeholder-white ${error === 'Passwords do not match' ? 'border-red-500' : ''}`}
            />
            <i className="bx bxs-lock-open-alt absolute right-5 top-1/2 transform -translate-y-1/2 text-xl"></i>
          </div>

          <button
            type="submit"
            className="w-full h-[45px] rounded-full bg-white text-gray-800 font-semibold shadow-md hover:bg-gray-100 transition"
            disabled={!!error} // Vô hiệu hóa nút nếu có lỗi
          >
            Register
          </button>

          <div className="text-center text-sm mt-6">
            <p>
              Already have an account?{' '}
              <a href="/login" className="font-semibold hover:underline">
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;