import React, { useState, useEffect } from 'react';
import api from '../../../middleware/axios';
import { FaFilter, FaSearch, FaUndo, FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ListRole: React.FC = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<any[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const response = await api.get('/roles');
        if (response.data && Array.isArray(response.data)) {
          setRoles(response.data);
          setFilteredRoles(response.data);
        } else {
          setError('Dữ liệu role không hợp lệ');
        }
      } catch (err: any) {
        setError('Failed to fetch roles: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let result = [...roles];

    // Apply search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (role) =>
          role.name.toLowerCase().includes(lowerQuery) ||
          (role.description && role.description.toLowerCase().includes(lowerQuery))
      );
    }

    setFilteredRoles(result);
  }, [searchQuery, roles]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (searchQuery) count++;
    setActiveFilters(count);
  }, [searchQuery]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setShowFilters(false);
  };

  const handleDeleteRole = async (roleId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa role này?')) {
      try {
        const response = await api.delete(`/roles/${roleId}`);
        if (response.status === 200) {
          setRoles(roles.filter(role => role._id !== roleId));
          setFilteredRoles(filteredRoles.filter(role => role._id !== roleId));
          alert('Xóa role thành công!');
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Lỗi khi xóa role';
        alert(errorMessage);
      }
    }
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
                placeholder="Tìm kiếm theo tên hoặc mô tả..."
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

            {/* Add Role Button */}
            <button
              onClick={() => navigate("/admin/roles/add")}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-blue-500/25"
            >
              <FaPlus className="text-sm" />
              <span className="hidden sm:inline">Thêm vai trò</span>
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilters > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-sm text-gray-600">Bộ lọc đang hoạt động:</span>
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

      {/* Table Section */}
      <div className="p-6">
        <div className="overflow-x-auto rounded-xl border border-gray-200/50">
          <table className="w-full text-sm text-left text-gray-700">
                         <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/50">
               <tr>
                 <th className="p-4 font-semibold text-gray-900">Tên vai trò</th>
                 <th className="p-4 font-semibold text-gray-900">Mô tả</th>
                 <th className="p-4 font-semibold text-gray-900">Ngày tạo</th>
                 <th className="p-4 font-semibold text-gray-900">Hành động</th>
               </tr>
             </thead>
            <tbody>
              {filteredRoles.length > 0 ? (
                filteredRoles.map((role: any) => (
                  <tr key={role._id} className="hover:bg-gray-50/50 border-b border-gray-100/50 transition-colors duration-200">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                          role.name === 'admin' 
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : role.name === 'user'
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : role.name === 'moderator'
                            ? 'bg-orange-100 text-orange-700 border border-orange-200'
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}>
                          {role.name === 'admin' && '👑 '}
                          {role.name === 'user' && '👤 '}
                          {role.name === 'moderator' && '🛡️ '}
                          {role.name}
                        </span>
                      </div>
                    </td>
                                         <td className="p-4">
                       <span className="text-gray-700 max-w-xs truncate block">
                         {role.description || 'Không có mô tả'}
                       </span>
                     </td>
                     <td className="p-4">
                       <span className="text-gray-600 text-sm">
                         {role.createdAt ? new Date(role.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                       </span>
                     </td>
                     <td className="p-4">
                       <div className="flex gap-2">
                         <button
                           className="p-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all duration-200 shadow-sm hover:shadow-md"
                           onClick={() => navigate(`/admin/roles/edit/${role._id}`)}
                           title="Chỉnh sửa"
                         >
                           <FaEdit size={14} />
                         </button>
                         <button
                           className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                           onClick={() => handleDeleteRole(role._id)}
                           title="Xóa"
                         >
                           <FaTrash size={14} />
                         </button>
                       </div>
                     </td>
                  </tr>
                ))
                             ) : (
                 <tr>
                   <td colSpan={4} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <FaSearch className="text-gray-400 text-xl" />
                      </div>
                      <p className="text-gray-500 font-medium">Không tìm thấy vai trò nào</p>
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
          Hiển thị <span className="font-semibold">{filteredRoles.length}</span> trong tổng số <span className="font-semibold">{roles.length}</span> vai trò
        </div>
      </div>
    </div>
  );
};

export default ListRole;