import React, { useState, useEffect } from 'react';
import api from '../../../middleware/axios';
import { FaFilter, FaSearch, FaUndo, FaEdit, FaEye, FaUserPlus } from 'react-icons/fa';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ListUser: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/users');
        // Kiểm tra và trích xuất mảng data từ response
        if (response.data && Array.isArray(response.data.data)) {
          setUsers(response.data.data);
          setFilteredUsers(response.data.data);
        } else {
          setError('Dữ liệu người dùng không hợp lệ');
        }
      } catch (err: any) {
        setError('Failed to fetch users: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let result = [...users];

    // Apply search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.email.toLowerCase().includes(lowerQuery) ||
          (user.name && user.name.toLowerCase().includes(lowerQuery))
      );
    }

    // Apply role filter
    if (roleFilter) {
      result = result.filter((user) => {
        const userRole = user.role_id?.name || 'N/A';
        return userRole.toLowerCase() === roleFilter.toLowerCase();
      });
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(result);
  }, [searchQuery, roleFilter, statusFilter, users]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (searchQuery) count++;
    if (roleFilter) count++;
    if (statusFilter) count++;
    setActiveFilters(count);
  }, [searchQuery, roleFilter, statusFilter]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setRoleFilter("");
    setStatusFilter("");
    setShowFilters(false);
  };

  // Get unique roles from users
  const getUniqueRoles = () => {
    const roles = users.map(user => user.role_id?.name || 'N/A');
    return [...new Set(roles)];
  };

  // Get unique statuses from users
  const getUniqueStatuses = () => {
    const statuses = users.map(user => user.status);
    return [...new Set(statuses)];
  };

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

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
      {/* Header with Search and Actions */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                className="w-full lg:w-96 pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                placeholder="Tìm kiếm theo email hoặc tên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 ${
                showFilters || activeFilters > 0
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FaFilter className="text-sm" />
              <span className="hidden sm:inline">Bộ lọc</span>
              {activeFilters > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {activeFilters}
                </span>
              )}
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* Reset Filters Button */}
            {activeFilters > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-3 bg-gray-100 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200"
                title="Đặt lại bộ lọc"
              >
                <FaUndo className="text-sm" />
                <span className="hidden sm:inline">Đặt lại</span>
              </button>
            )}



            {/* Add User Button */}
            <button
              onClick={() => navigate("/admin/users/add")}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-blue-500/25"
            >
              <FaUserPlus className="text-sm" />
              <span className="hidden sm:inline">Thêm người dùng</span>
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilters > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-sm text-gray-600">Bộ lọc đang hoạt động:</span>
            {roleFilter && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Vai trò: {roleFilter}
                <button
                  onClick={() => setRoleFilter("")}
                  className="ml-1 hover:text-blue-600"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {statusFilter && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Trạng thái: {statusFilter === "active" ? "Hoạt động" : statusFilter === "block" ? "Bị cấm" : statusFilter === "inactive" ? "Không hoạt động" : statusFilter}
                <button
                  onClick={() => setStatusFilter("")}
                  className="ml-1 hover:text-green-600"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                Tìm kiếm: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-1 hover:text-orange-600"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-6 bg-gray-50/50 border-b border-gray-200/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vai trò
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">Tất cả vai trò</option>
                {getUniqueRoles().map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                {getUniqueStatuses().map((status) => (
                  <option key={status} value={status}>
                    {status === "active" && "Hoạt động"}
                    {status === "block" && "Bị cấm"}
                    {status === "inactive" && "Không hoạt động"}
                    {!["active", "block", "inactive"].includes(status) && status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="p-6">
        <div className="overflow-x-auto rounded-xl border border-gray-200/50">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/50">
              <tr>
                <th className="p-4 font-semibold text-gray-900">Email</th>
                <th className="p-4 font-semibold text-gray-900">Tên</th>
                <th className="p-4 font-semibold text-gray-900">Vai trò</th>
                <th className="p-4 font-semibold text-gray-900">Trạng thái</th>
                <th className="p-4 font-semibold text-gray-900">Ngày tạo</th>
                <th className="p-4 font-semibold text-gray-900">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user: any) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 border-b border-gray-100/50 transition-colors duration-200">
                    <td className="p-4">
                      <span className="font-medium text-gray-900">{user.email}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-700">{user.name || 'N/A'}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                        user.role_id?.name === 'admin' 
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : user.role_id?.name === 'user'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : user.role_id?.name === 'moderator'
                          ? 'bg-orange-100 text-orange-700 border border-orange-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {user.role_id?.name === 'admin' && '👑 '}
                        {user.role_id?.name === 'user' && '👤 '}
                        {user.role_id?.name === 'moderator' && '🛡️ '}
                        {user.role_id?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${
                          user.status === "active"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : user.status === "block"
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {user.status === "active" && "Hoạt động"}
                        {user.status === "block" && "Bị cấm"}
                        {user.status === "inactive" && "Không hoạt động"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-600 text-sm">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                          onClick={() => navigate(`/admin/users/${user._id}`)}
                          title="Xem chi tiết"
                        >
                          <FaEye size={14} />
                        </button>
                        <button
                          className="p-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all duration-200 shadow-sm hover:shadow-md"
                          onClick={() => navigate(`/admin/users/edit/${user._id}`)}
                          title="Chỉnh sửa"
                        >
                          <FaEdit size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <FaSearch className="text-gray-400 text-xl" />
                      </div>
                      <p className="text-gray-500 font-medium">Không tìm thấy người dùng nào</p>
                      <p className="text-gray-400 text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-600">
          Hiển thị <span className="font-semibold">{filteredUsers.length}</span> trong tổng số <span className="font-semibold">{users.length}</span> người dùng
        </div>
      </div>
    </div>
  );
};

export default ListUser;