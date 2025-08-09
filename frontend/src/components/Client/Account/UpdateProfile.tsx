import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCamera, FaCalendar, FaShieldAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { User } from '../../../interfaces/user';
import instance from '../../../../api/instance';

const UpdateProfile: React.FC = () => {
  const [formData, setFormData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  // Lấy thông tin hồ sơ từ backend
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Bạn cần đăng nhập để chỉnh sửa hồ sơ');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.status) {
          setFormData(data.user);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Lỗi khi tải thông tin hồ sơ');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý upload avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && formData) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phoneNumber: formData.phone || formData.phoneNumber,
          avatar: formData.avatar,
        }),
      });
      const data = await response.json();
      if (data.status) {
        setSuccess('Cập nhật hồ sơ thành công!');
        setTimeout(() => navigate('/profile'), 2000); // Chuyển về profile sau 2 giây
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Lỗi khi cập nhật hồ sơ');
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa có thông tin';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status text
  const getStatusText = (status?: string) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'block':
        return 'Bị khóa';
      default:
        return 'Chưa xác định';
    }
  };

  // Get status color
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'block':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500 text-lg">Đang tải...</div>;
  }

  if (error || !formData) {
    return <div className="text-center py-10 text-red-500 text-lg">{error || 'Không tìm thấy hồ sơ người dùng.'}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-14 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 transition-all duration-300 hover:shadow-pink-100">
        <div className="flex flex-col items-center space-y-4 relative">
          <div className="relative group">
            <img
              src={formData.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqMZXi12fBQGZpQvD27ZJvSGmn-oNCXI9Etw&s'}
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover ring-4 ring-rose-400 shadow-md transition-transform group-hover:scale-105"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-100 transition"
              title="Đổi ảnh đại diện"
            >
              <FaCamera className="text-gray-600" />
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800">Chỉnh sửa hồ sơ</h2>
          
          {success && <div className="text-green-500 text-center">{success}</div>}
          {error && <div className="text-red-500 text-center">{error}</div>}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Thông tin cơ bản */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin cơ bản</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaUser className="text-pink-500 text-lg" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder="Nhập tên của bạn..."
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <FaEnvelope className="text-blue-500 text-lg" />
                <input
                  type="email"
                  value={formData.email}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-gray-100 cursor-not-allowed"
                  disabled
                  title="Email không thể thay đổi"
                />
              </div>

              <div className="flex items-center gap-3">
                <FaPhone className="text-green-500 text-lg" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || formData.phoneNumber || ''}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Nhập số điện thoại..."
                />
              </div>

                             <div className="flex items-center gap-3">
                 <FaMapMarkerAlt className="text-orange-500 text-lg" />
                 <div className="flex-1">
                   <p className="text-sm text-gray-600 mb-2">
                     <strong>Quản lý địa chỉ:</strong> Vui lòng sử dụng trang quản lý địa chỉ riêng biệt
                   </p>
                   <Link
                     to="/addresses"
                     className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                   >
                     <FaMapMarkerAlt /> Đi đến quản lý địa chỉ
                   </Link>
                 </div>
               </div>
            </div>
          </div>

          {/* Thông tin tài khoản (chỉ đọc) */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin tài khoản</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaShieldAlt className="text-purple-500 text-lg" />
                <span className="text-base">
                  <strong>Trạng thái:</strong> 
                  <span className={`ml-1 ${getStatusColor(formData.status)}`}>
                    {getStatusText(formData.status)}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FaCalendar className="text-indigo-500 text-lg" />
                <span className="text-base"><strong>Ngày tạo:</strong> {formatDate(formData.createdAt)}</span>
              </div>

              <div className="flex items-center gap-3">
                <FaCalendar className="text-indigo-500 text-lg" />
                <span className="text-base"><strong>Cập nhật lần cuối:</strong> {formatDate(formData.updatedAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <button
              type="submit"
              className="text-sm text-white bg-green-500 hover:bg-green-600 px-6 py-2 rounded-full shadow transition"
            >
              Lưu thay đổi
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="text-sm text-white bg-gray-500 hover:bg-gray-600 px-6 py-2 rounded-full shadow transition"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;