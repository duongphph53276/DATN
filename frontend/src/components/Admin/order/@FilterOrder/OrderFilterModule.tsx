import { FC, useState, useEffect } from "react";
import styles from "./OrderFilterModule.module.scss";
import classnames from "classnames/bind";
import { OrderFilterProps } from "../../../../interfaces/props";
import { paymentMethods, statuses, getVietnameseStatus, paymentMethodVietnamese } from "../../../../utils/constant";
import { FaFilter, FaSearch, FaUndo } from "react-icons/fa";
import { ChevronDown, ChevronUp, X } from "lucide-react";

const cx = classnames.bind(styles);

const OrderFilterModule: FC<OrderFilterProps> = ({ filters, onFiltersChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filters.name) count++;
    if (filters.status) count++;
    if (filters.payment_method) count++;
    if (filters.created_at) count++;
    setActiveFilters(count);
  }, [filters]);

  // Reset all filters
  const resetFilters = () => {
    onFiltersChange({
      name: "",
      status: "",
      payment_method: "",
      created_at: "",
    });
    setShowFilters(false);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg mb-6">
      {/* Header with Search and Actions */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                className="w-full lg:w-96 pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                placeholder="Tìm theo tên sản phẩm..."
                value={filters.name}
                onChange={(e) => handleFilterChange("name", e.target.value)}
              />
              {filters.name && (
                <button
                  onClick={() => handleFilterChange("name", "")}
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
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilters > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-sm text-gray-600">Bộ lọc đang hoạt động:</span>
            {filters.status && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Trạng thái: {getVietnameseStatus(filters.status)}
                <button
                  onClick={() => handleFilterChange("status", "")}
                  className="ml-1 hover:text-green-600"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.payment_method && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                Thanh toán: {paymentMethodVietnamese[filters.payment_method] || filters.payment_method}
                <button
                  onClick={() => handleFilterChange("payment_method", "")}
                  className="ml-1 hover:text-purple-600"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.created_at && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                Ngày: {new Date(filters.created_at).toLocaleDateString('vi-VN')}
                <button
                  onClick={() => handleFilterChange("created_at", "")}
                  className="ml-1 hover:text-orange-600"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.name && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Tìm kiếm: "{filters.name}"
                <button
                  onClick={() => handleFilterChange("name", "")}
                  className="ml-1 hover:text-blue-600"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái đơn hàng
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {getVietnameseStatus(s)}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phương thức thanh toán
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                value={filters.payment_method}
                onChange={(e) => handleFilterChange("payment_method", e.target.value)}
              >
                <option value="">Tất cả thanh toán</option>
                {paymentMethods.map((p) => (
                  <option key={p} value={p}>
                    {paymentMethodVietnamese[p] || p}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày tạo đơn hàng
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                value={filters.created_at}
                onChange={(e) => handleFilterChange("created_at", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderFilterModule;