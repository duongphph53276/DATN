import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaPhone, FaMapMarkerAlt, FaCamera } from 'react-icons/fa';
import { User } from '../../../interfaces/user';

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
          phoneNumber: formData.phoneNumber,
          avatar: formData.avatar,
          address_id: formData.address_id,
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

  if (loading) {
    return <div className="text-center py-10 text-gray-500 text-lg">Đang tải...</div>;
  }

  if (error || !formData) {
    return <div className="text-center py-10 text-red-500 text-lg">{error || 'Không tìm thấy hồ sơ người dùng.'}</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-14 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 transition-all duration-300 hover:shadow-pink-100">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Chỉnh sửa hồ sơ</h2>
        {success && <div className="text-green-500 mb-4 text-center">{success}</div>}
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5 text-gray-700">
          <div className="flex items-center gap-3">
            <FaUser className="text-pink-500 text-lg" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Nhập họ tên"
              required
            />
          </div>
          <div className="flex items-center gap-3">
            <FaPhone className="text-green-500 text-lg" />
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-orange-500 text-lg" />
            <input
              type="text"
              name="address_id"
              value={formData.address_id || ''}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Nhập địa chỉ giao hàng"
            />
          </div>
          <div className="flex items-center gap-3">
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
          </div>
          <button
            type="submit"
            className="w-full text-sm text-white bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-full shadow transition"
          >
            Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;