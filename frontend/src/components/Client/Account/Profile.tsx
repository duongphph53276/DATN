import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCamera, FaCalendar, FaShieldAlt, FaEdit } from 'react-icons/fa';
import { User, Address } from '../../../interfaces/user';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy thông tin hồ sơ từ backend
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Bạn cần đăng nhập để xem hồ sơ');
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
          setUser(data.user);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Lỗi khi tải thông tin hồ sơ');
      } finally {
        setLoading(false);
      }
    };

    const fetchAddresses = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:5000/addresses', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.status) {
          setAddresses(data.data);
        }
      } catch (err) {
        console.error('Lỗi khi tải địa chỉ:', err);
      }
    };

    fetchProfile();
    fetchAddresses();
  }, []);



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

  // Lấy địa chỉ mặc định
  const getDefaultAddress = () => {
    return addresses.find(addr => addr.is_default) || addresses[0];
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500 text-lg">Đang tải hồ sơ...</div>;
  }

  if (error || !user) {
    return <div className="text-center py-10 text-red-500 text-lg">{error || 'Không tìm thấy hồ sơ người dùng.'}</div>;
  }

  const defaultAddress = getDefaultAddress();

  return (
    <div className="max-w-2xl mx-auto mt-14 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 transition-all duration-300 hover:shadow-pink-100">
        <div className="flex flex-col items-center space-y-4 relative">
          <div className="relative group">
            <img
              src={user.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqMZXi12fBQGZpQvD27ZJvSGmn-oNCXI9Etw&s'}
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover ring-4 ring-rose-400 shadow-md transition-transform group-hover:scale-105"
            />
          </div>

          <h2 className="text-2xl font-semibold text-gray-800">Hồ sơ cá nhân</h2>

          <div className="flex gap-2">
            <button
              onClick={() => navigate('/profile/edit')}
              className="text-sm text-white bg-rose-500 hover:bg-rose-600 px-4 py-1.5 rounded-full shadow transition"
            >
              Chỉnh sửa
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-5 text-gray-700">
          {/* Thông tin cơ bản */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin cơ bản</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaUser className="text-pink-500 text-lg" />
                <span className="text-base"><strong>Tên:</strong> {user.name}</span>
              </div>

              <div className="flex items-center gap-3">
                <FaEnvelope className="text-blue-500 text-lg" />
                <span className="text-base"><strong>Email:</strong> {user.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <FaPhone className="text-green-500 text-lg" />
                <span className="text-base"><strong>SĐT:</strong> {user.phone || user.phoneNumber || 'Chưa cập nhật'}</span>
              </div>

              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-orange-500 text-lg" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-base"><strong>Địa chỉ:</strong></span>
                    <Link
                      to="/addresses"
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <FaEdit /> Quản lý địa chỉ
                    </Link>
                  </div>
                  {defaultAddress ? (
                    <div className="mt-1 text-sm text-gray-600">
                      <p className="font-medium">{defaultAddress.street}</p>
                      <p>{defaultAddress.city}, {defaultAddress.country}</p>
                      {defaultAddress.postal_code && <p>Mã bưu điện: {defaultAddress.postal_code}</p>}
                      {defaultAddress.is_default && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                          Địa chỉ mặc định
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="mt-1 text-sm text-gray-500">
                      Chưa có địa chỉ. 
                      <Link to="/addresses" className="text-blue-600 hover:text-blue-700 ml-1">
                        Thêm địa chỉ ngay
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin tài khoản */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin tài khoản</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaShieldAlt className="text-purple-500 text-lg" />
                <span className="text-base">
                  <strong>Trạng thái:</strong> 
                  <span className={`ml-1 ${getStatusColor(user.status)}`}>
                    {getStatusText(user.status)}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FaCalendar className="text-indigo-500 text-lg" />
                <span className="text-base"><strong>Ngày tạo:</strong> {formatDate(user.createdAt)}</span>
              </div>

              <div className="flex items-center gap-3">
                <FaCalendar className="text-indigo-500 text-lg" />
                <span className="text-base"><strong>Cập nhật lần cuối:</strong> {formatDate(user.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;