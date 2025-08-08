import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000', // hoặc URL server backend của bạn
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor để thêm token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor để xử lý token hết hạn
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.response?.data?.expired) {
      // Token hết hạn - xóa token và chuyển về trang đăng nhập
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      
      // Hiển thị thông báo cho người dùng
      alert('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      
      // Chuyển hướng về trang đăng nhập
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
