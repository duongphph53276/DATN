import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../middleware/axios';
import { FaArrowLeft, FaEdit, FaUser, FaEnvelope, FaPhone, FaCalendar, FaShieldAlt, FaBan } from 'react-icons/fa';

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/users/${id}`);
        setUser(response.data);
      } catch (err: any) {
        setError('Failed to fetch user: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <p className="text-yellow-600 font-medium">Không tìm thấy thông tin người dùng</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/users')}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              <FaArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Chi tiết người dùng</h1>
              <p className="text-gray-500">Xem thông tin chi tiết của người dùng</p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/admin/users/edit/${user._id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200"
          >
            <FaEdit size={16} />
            Chỉnh sửa
          </button>
        </div>
      </div>

      {/* User Information */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="bg-gray-50/50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaUser className="text-blue-500" />
                Thông tin cơ bản
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 font-medium min-w-[100px]">Tên:</span>
                  <span className="text-gray-900">{user.name || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 font-medium min-w-[100px]">Email:</span>
                  <span className="text-gray-900 flex items-center gap-2">
                    <FaEnvelope className="text-gray-400" />
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 font-medium min-w-[100px]">Số điện thoại:</span>
                  <span className="text-gray-900 flex items-center gap-2">
                    <FaPhone className="text-gray-400" />
                    {user.phone || 'Chưa cập nhật'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 font-medium min-w-[100px]">Vai trò:</span>
                                           <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                           user.role_id?.name === 'admin' 
                             ? 'bg-purple-100 text-purple-700 border border-purple-200'
                             : user.role_id?.name === 'user'
                             ? 'bg-blue-100 text-blue-700 border border-blue-200'
                             : user.role_id?.name === 'moderator'
                             ? 'bg-orange-100 text-orange-700 border border-orange-200'
                             : 'bg-gray-100 text-gray-700 border border-gray-200'
                         }`}>
                           <FaShieldAlt className="mr-1" />
                           {user.role_id?.name || 'Chưa phân quyền'}
                         </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 font-medium min-w-[100px]">Trạng thái:</span>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                    user.status === "active"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : user.status === "block"
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : "bg-gray-100 text-gray-700 border border-gray-200"
                  }`}>
                    {user.status === "active" && "Hoạt động"}
                    {user.status === "block" && "Bị cấm"}
                    {user.status === "inactive" && "Không hoạt động"}
                  </span>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-gray-50/50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaCalendar className="text-blue-500" />
                Thông tin thời gian
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 font-medium min-w-[100px]">Ngày tạo:</span>
                  <span className="text-gray-900">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 font-medium min-w-[100px]">Cập nhật lần cuối:</span>
                  <span className="text-gray-900">
                    {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Avatar and Additional Info */}
          <div className="space-y-6">
            {/* Avatar */}
            <div className="bg-gray-50/50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ảnh đại diện</h2>
              <div className="flex justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-4 border-white shadow-lg">
                    <FaUser className="text-white text-4xl" />
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50/50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bổ sung</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 font-medium min-w-[100px]">ID người dùng:</span>
                  <span className="text-gray-900 font-mono text-sm">{user._id}</span>
                </div>
                {user.address_id && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 font-medium min-w-[100px]">Địa chỉ ID:</span>
                    <span className="text-gray-900 font-mono text-sm">{user.address_id}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Ban Information */}
            {user.status === 'block' && (
              <div className="bg-red-50/50 rounded-xl p-6 border border-red-200/50">
                <h2 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
                  <FaBan className="text-red-500" />
                  Thông tin cấm
                </h2>
                <div className="space-y-4">
                  {user.banDuration && (
                    <div className="flex items-center gap-3">
                      <span className="text-red-700 font-medium min-w-[100px]">Thời gian cấm:</span>
                      <span className="text-red-900">
                        {user.banDuration === '1d' && '1 ngày'}
                        {user.banDuration === '3d' && '3 ngày'}
                        {user.banDuration === '7d' && '7 ngày'}
                        {user.banDuration === '1m' && '1 tháng'}
                        {user.banDuration === '1y' && '1 năm'}
                        {user.banDuration === 'permanent' && 'Vĩnh viễn'}
                      </span>
                    </div>
                  )}
                  {user.banReason && (
                    <div className="flex items-start gap-3">
                      <span className="text-red-700 font-medium min-w-[100px]">Lý do cấm:</span>
                      <span className="text-red-900">{user.banReason}</span>
                    </div>
                  )}
                  {user.banUntil && (
                    <div className="flex items-center gap-3">
                      <span className="text-red-700 font-medium min-w-[100px]">Cấm đến:</span>
                      <span className="text-red-900">
                        {new Date(user.banUntil).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail; 