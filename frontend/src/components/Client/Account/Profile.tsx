import React, { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCamera } from 'react-icons/fa';

interface User {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const { name, value } = e.target;
    const updatedUser = { ...user, [name]: value };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedUser = { ...user, avatar: reader.result as string };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500 text-lg">Đang tải hồ sơ...</div>;
  }

  if (!user) {
    return <div className="text-center py-10 text-red-500 text-lg">Không tìm thấy hồ sơ người dùng.</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-14 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 transition-all duration-300 hover:shadow-pink-100">
        <div className="flex flex-col items-center space-y-4 relative">
          <div className="relative group">
            <img
              src={user.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqMZXi12fBQGZpQvD27ZJvSGmn-oNCXI9Etw&s'}
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

          <h2 className="text-2xl font-semibold text-gray-800">Hồ sơ cá nhân</h2>

          <button
            onClick={() => setEditing(!editing)}
            className="text-sm text-white bg-rose-500 hover:bg-rose-600 px-4 py-1.5 rounded-full shadow transition"
          >
            {editing ? 'Lưu thay đổi' : 'Chỉnh sửa'}
          </button>
        </div>

        <div className="mt-8 space-y-5 text-gray-700">
          <div className="flex items-center gap-3">
            <FaUser className="text-pink-500 text-lg" />
            {editing ? (
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            ) : (
              <span className="text-base"><strong>Tên:</strong> {user.name}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <FaEnvelope className="text-blue-500 text-lg" />
            <span className="text-base"><strong>Email:</strong> {user.email}</span>
          </div>

          <div className="flex items-center gap-3">
            <FaPhone className="text-green-500 text-lg" />
            {editing ? (
              <input
                type="text"
                name="phone"
                value={user.phone || ''}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            ) : (
              <span className="text-base"><strong>SĐT:</strong> {user.phone || 'Chưa cập nhật'}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-orange-500 text-lg" />
            {editing ? (
              <input
                type="text"
                name="address"
                value={user.address || ''}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Nhập địa chỉ giao hàng..."
              />
            ) : (
              <span className="text-base"><strong>Địa chỉ:</strong> {user.address || 'Chưa có'}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
