import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../middleware/axios';
import { FaBan, FaUserShield, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const EditUser: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [user, setUser] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role_id: '',
    address_id: '',
    avatar: '',
    status: 'active',
  });
  const [banInfo, setBanInfo] = useState({
    isBanned: false,
    banDuration: '',
    banReason: '',
    banUntil: null as Date | null,
  });
  const [roles, setRoles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('ID không hợp lệ');
        return;
      }
      try {
        setLoading(true);
        
        // Lấy thông tin admin hiện tại
        const currentUserResponse = await api.get('/profile');
        if (currentUserResponse.data && currentUserResponse.data.user) {
          setCurrentUser(currentUserResponse.data.user);
        }

        // Lấy thông tin user
        const userResponse = await api.get(`/admin/users/${id}`);
        if (userResponse.data && userResponse.data.data) {
          const userData = userResponse.data.data;
          setUser({
            email: userData.email || '',
            password: '', // Không lấy password từ API vì đã select('-password')
            name: userData.name || '',
            phone: userData.phone || '',
            role_id: userData.role_id?._id || '',
            address_id: userData.address_id?._id || '',
            avatar: userData.avatar || '',
            status: userData.status || 'active',
          });

          // Thiết lập thông tin ban nếu user bị cấm
          if (userData.status === 'block') {
            setBanInfo({
              isBanned: true,
              banDuration: userData.banDuration || '',
              banReason: userData.banReason || '',
              banUntil: userData.banUntil ? new Date(userData.banUntil) : null,
            });
          }
        } else {
          setError('Dữ liệu người dùng không hợp lệ');
        }

        // Lấy danh sách role
        const rolesResponse = await api.get('/roles');
        if (rolesResponse.data && Array.isArray(rolesResponse.data)) {
          setRoles(rolesResponse.data);
        } else {
          setError('Dữ liệu role không hợp lệ');
        }
      } catch (err: any) {
        setError('Failed to fetch data: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const calculateBanUntil = (duration: string): Date | null => {
    if (duration === 'permanent') return null;
    
    const now = new Date();
    switch (duration) {
      case '1d':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case '3d':
        return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      case '7d':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case '1m':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      case '1y':
        return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
      default:
        return null;
    }
  };

  const handleBanChange = (isBanned: boolean) => {
    setBanInfo({
      isBanned,
      banDuration: '',
      banReason: '',
      banUntil: null,
    });
    setUser({ ...user, status: isBanned ? 'block' : 'active' });
  };

  const handleBanDurationChange = (duration: string) => {
    const banUntil = calculateBanUntil(duration);
    setBanInfo({
      ...banInfo,
      banDuration: duration,
      banUntil,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      setError('ID không hợp lệ');
      return;
    }

    // Kiểm tra quyền thay đổi password
    if (user.password && currentUser?.role_id?.name !== 'admin') {
      setError('Bạn không có quyền thay đổi mật khẩu của người khác');
      return;
    }

    // Kiểm tra thông tin ban
    if (banInfo.isBanned && (!banInfo.banDuration || !banInfo.banReason)) {
      setError('Vui lòng chọn thời gian cấm và nhập lý do cấm');
      return;
    }

    try {
      const updateData: any = {
        email: user.email,
        name: user.name,
        phone: user.phone,
        status: user.status,
      };

      // Chỉ gửi role_id nếu có giá trị hợp lệ
      if (user.role_id && user.role_id.trim() !== '') {
        updateData.role_id = user.role_id;
      }

      // Chỉ gửi address_id nếu có giá trị hợp lệ
      if (user.address_id && user.address_id.trim() !== '') {
        updateData.address_id = user.address_id;
      }

      // Chỉ gửi avatar nếu có giá trị
      if (user.avatar && user.avatar.trim() !== '') {
        updateData.avatar = user.avatar;
      }

      // Chỉ gửi password nếu có giá trị mới và là admin
      if (user.password && user.password.trim() !== '' && currentUser?.role_id?.name === 'admin') {
        updateData.password = user.password;
      }

      // Thêm thông tin ban nếu user bị cấm
      if (banInfo.isBanned) {
        updateData.banDuration = banInfo.banDuration;
        updateData.banReason = banInfo.banReason;
        updateData.banUntil = banInfo.banUntil;
      } else {
        // Xóa thông tin ban nếu user được mở khóa
        updateData.banDuration = null;
        updateData.banReason = null;
        updateData.banUntil = null;
      }

      console.log('Sending update data:', updateData);
      const response = await api.put(`/admin/users/${id}`, updateData);
      console.log('Update response:', response.data);
      alert('Cập nhật người dùng thành công');
    } catch (err: any) {
      console.error('Update user error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Unknown error';
      setError('Failed to update user: ' + errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isCurrentUserAdmin = currentUser?.role_id?.name === 'admin';
  const isEditingOwnAccount = currentUser?._id === id;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaUserShield className="text-blue-500" />
          Chỉnh sửa người dùng
        </h1>
        <p className="text-gray-500 mt-1">Cập nhật thông tin người dùng</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 font-medium flex items-center gap-2">
            <FaExclamationTriangle />
            {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin cơ bản */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Chỉ hiển thị password field cho admin hoặc khi sửa tài khoản của chính mình */}
          {(isCurrentUserAdmin || isEditingOwnAccount) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
              <input
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập để thay đổi mật khẩu"
              />
              {!isCurrentUserAdmin && (
                <p className="text-xs text-gray-500 mt-1">Chỉ có thể thay đổi mật khẩu của chính mình</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
            <input
              type="text"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
            <select
              value={user.role_id}
              onChange={(e) => setUser({ ...user, role_id: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Chọn vai trò</option>
              {roles.map((role: any) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
            <input
              type="text"
              value={user.avatar}
              onChange={(e) => setUser({ ...user, avatar: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
        </div>

        {/* Trạng thái và cấm người dùng */}
        <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaBan className="text-red-500" />
            Trạng thái tài khoản
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select
                value={user.status}
                onChange={(e) => handleBanChange(e.target.value === 'block')}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Hoạt động</option>
                <option value="block">Cấm đăng nhập</option>
              </select>
            </div>

            {/* Thông tin cấm */}
            {banInfo.isBanned && (
              <div className="space-y-4 p-4 bg-red-50/50 rounded-xl border border-red-200/50">
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-2 flex items-center gap-2">
                    <FaClock />
                    Thời gian cấm
                  </label>
                  <select
                    value={banInfo.banDuration}
                    onChange={(e) => handleBanDurationChange(e.target.value)}
                    className="w-full p-3 border border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Chọn thời gian cấm</option>
                    <option value="1d">1 ngày</option>
                    <option value="3d">3 ngày</option>
                    <option value="7d">7 ngày</option>
                    <option value="1m">1 tháng</option>
                    <option value="1y">1 năm</option>
                    <option value="permanent">Vĩnh viễn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-red-700 mb-2">Lý do cấm</label>
                  <textarea
                    value={banInfo.banReason}
                    onChange={(e) => setBanInfo({ ...banInfo, banReason: e.target.value })}
                    className="w-full p-3 border border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={3}
                    placeholder="Nhập lý do cấm người dùng..."
                    required
                  />
                </div>

                {banInfo.banUntil && (
                  <div className="text-sm text-red-600">
                    <strong>Thời gian cấm đến:</strong> {banInfo.banUntil.toLocaleString('vi-VN')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-xl hover:bg-blue-600 transition-all duration-200 font-medium"
          >
            Cập nhật người dùng
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;