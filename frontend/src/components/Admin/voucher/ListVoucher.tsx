import React, { useEffect, useState } from 'react';
import { IVoucher, IVoucherResponse, IErrorResponse } from '../../../interfaces/voucher';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaFilter, FaSearch, FaUndo, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

const ListVoucher: React.FC = () => {
  const [vouchers, setVouchers] = useState<IVoucher[]>([]);
  const [filteredVouchers, setFilteredVouchers] = useState<IVoucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get<IVoucherResponse>('http://localhost:5000/vouchers');
        if (response.data.status) {
          // Sort theo _id descending (mới nhất lên đầu)
          const sortedVouchers = response.data.data.sort((a, b) => b._id.localeCompare(a._id));
          setVouchers(sortedVouchers);
          setFilteredVouchers(sortedVouchers);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        const errorResponse = err as IErrorResponse;
        setError(errorResponse.message || 'Lỗi khi tải danh sách voucher');
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let result = [...vouchers];

    // Apply search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (voucher) =>
          voucher.code.toLowerCase().includes(lowerQuery) ||
          (voucher.description && voucher.description.toLowerCase().includes(lowerQuery))
      );
    }

    // Apply type filter
    if (typeFilter) {
      result = result.filter((voucher) => voucher.discount_type === typeFilter);
    }

    // Apply status filter
    if (statusFilter) {
      const now = new Date();
      result = result.filter((voucher) => {
        const startDate = new Date(voucher.start_date);
        const endDate = new Date(voucher.end_date);
        const remaining = voucher.quantity - (voucher.used_quantity || 0);  // Tính remaining
        
        if (statusFilter === 'active') {
          return now >= startDate && now <= endDate && remaining > 0;
        } else if (statusFilter === 'expired') {
          return now > endDate;
        } else if (statusFilter === 'upcoming') {
          return now < startDate;
        } else if (statusFilter === 'out_of_stock') {
          return remaining <= 0;  // Dùng remaining <= 0
        }
        return true;
      });
    }

    setFilteredVouchers(result);
  }, [searchQuery, typeFilter, statusFilter, vouchers]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (searchQuery) count++;
    if (typeFilter) count++;
    if (statusFilter) count++;
    setActiveFilters(count);
  }, [searchQuery, typeFilter, statusFilter]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setTypeFilter("");
    setStatusFilter("");
    setShowFilters(false);
  };

  // Get voucher status
  const getVoucherStatus = (voucher: IVoucher) => {
    const now = new Date();
    const startDate = new Date(voucher.start_date);
    const endDate = new Date(voucher.end_date);
    const remaining = voucher.quantity - (voucher.used_quantity || 0);  // Tính remaining
    
    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'expired';
    if (remaining <= 0) return 'out_of_stock';  // Dùng remaining thay vì quantity === 0
    return 'active';
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa voucher này?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/vouchers/${id}`);
        if (response.data.status) {
          setVouchers(vouchers.filter(voucher => voucher._id !== id));
          alert('Xóa voucher thành công');
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        const errorResponse = err as IErrorResponse;
        setError(errorResponse.message || 'Lỗi khi xóa voucher');
      }
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/voucher/edit/${id}`);
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
                placeholder="Tìm kiếm theo mã voucher..."
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

            {/* Add Voucher Button */}
            <button
              onClick={() => navigate('/admin/voucher/add')}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-blue-500/25"
            >
              <FaPlus className="text-sm" />
              <span className="hidden sm:inline">Thêm Voucher</span>
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilters > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-sm text-gray-600">Bộ lọc đang hoạt động:</span>
            {typeFilter && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Loại: {typeFilter === 'percentage' ? 'Phần trăm' : 'Số tiền'}
                <button
                  onClick={() => setTypeFilter("")}
                  className="ml-1 hover:text-blue-600"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {statusFilter && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Trạng thái: {statusFilter === 'active' ? 'Đang hoạt động' : statusFilter === 'expired' ? 'Hết hạn' : statusFilter === 'upcoming' ? 'Sắp tới' : 'Hết hàng'}
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
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại giảm giá
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">Tất cả loại</option>
                <option value="percentage">Phần trăm (%)</option>
                <option value="fixed">Số tiền cố định</option>
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
                <option value="active">Đang hoạt động</option>
                <option value="expired">Hết hạn</option>
                <option value="upcoming">Sắp tới</option>
                <option value="out_of_stock">Hết hàng</option>
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
                <th className="p-4 font-semibold text-gray-900">Mã voucher</th>
                <th className="p-4 font-semibold text-gray-900">Loại</th>
                <th className="p-4 font-semibold text-gray-900">Giá trị</th>
                <th className="p-4 font-semibold text-gray-900">Giá trị đơn hàng tối thiểu</th>
                <th className="p-4 font-semibold text-gray-900">Số lượng</th>
                <th className="p-4 font-semibold text-gray-900">Lượt đã dùng</th> {/* THÊM: Để check used_quantity */}
                <th className="p-4 font-semibold text-gray-900">Lượt còn lại</th> {/* THÊM: Để check remaining */}
                <th className="p-4 font-semibold text-gray-900">Ngày bắt đầu</th>
                <th className="p-4 font-semibold text-gray-900">Ngày kết thúc</th>
                <th className="p-4 font-semibold text-gray-900">Trạng thái</th>
                <th className="p-4 font-semibold text-gray-900">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredVouchers.length > 0 ? (
                filteredVouchers.map(voucher => {
                  const status = getVoucherStatus(voucher);
                  const remaining = voucher.quantity - (voucher.used_quantity || 0);
                  return (
                    <tr key={voucher._id} className="hover:bg-gray-50/50 border-b border-gray-100/50 transition-colors duration-200">
                      <td className="p-4">
                        <span className="font-mono font-semibold text-gray-900">{voucher.code}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-700">{voucher.discount_type === 'percentage' ? 'Phần trăm' : 'Số tiền'}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-gray-900">
                          {voucher.discount_type === 'percentage' ? `${voucher.value}%` : `${voucher.value.toLocaleString()} VND`}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-gray-900">
                          {voucher.min_order_value?.toLocaleString() || '0'} VND
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-gray-900">{voucher.quantity}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-gray-900">{voucher.used_quantity || 0}</span> {/* THÊM */}
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-gray-900">{remaining}</span> {/* THÊM */}
                      </td>
                      <td className="p-4">
                        <span className="text-gray-600 text-sm">
                          {new Date(voucher.start_date).toLocaleDateString('vi-VN')}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-600 text-sm">
                          {new Date(voucher.end_date).toLocaleDateString('vi-VN')}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${
                            status === 'active'
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : status === 'expired'
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : status === 'upcoming'
                              ? 'bg-blue-100 text-blue-700 border border-blue-200'
                              : 'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}
                        >
                          {status === 'active' && 'Đang hoạt động'}
                          {status === 'expired' && 'Hết hạn'}
                          {status === 'upcoming' && 'Sắp tới'}
                          {status === 'out_of_stock' && 'Hết hàng'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            className="p-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all duration-200 shadow-sm hover:shadow-md"
                            onClick={() => handleEdit(voucher._id!)}
                            title="Chỉnh sửa"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                            onClick={() => handleDelete(voucher._id!)}
                            title="Xóa"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="text-center py-12"> {/* SỬA: colSpan=11 vì thêm 3 cột */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <FaSearch className="text-gray-400 text-xl" />
                      </div>
                      <p className="text-gray-500 font-medium">Không tìm thấy voucher nào</p>
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
          Hiển thị <span className="font-semibold">{filteredVouchers.length}</span> trong tổng số <span className="font-semibold">{vouchers.length}</span> voucher
        </div>
      </div>
    </div>
  );
};

export default ListVoucher;