import * as React from 'react';
import { useEffect, useState } from 'react';
import api from '../../../middleware/axios';
import { Link, useNavigate } from 'react-router-dom';
import { ICategory, ICategoryResponse } from '../../../interfaces/category';
import { FaFilter, FaSearch, FaUndo, FaEdit, FaTrash, FaPlus, FaFolder } from 'react-icons/fa';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

const ListCategory: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ICategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get<ICategoryResponse>('/admin/category');
        if (response.data.status) {
          setCategories(response.data.data || []);
          setFilteredCategories(response.data.data || []);
        } else {
          setError(response.data.message);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải danh mục');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let result = [...categories];

    // Apply search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (category) =>
          category.name.toLowerCase().includes(lowerQuery) ||
          category.slug.toLowerCase().includes(lowerQuery) ||
          (category.description && category.description.toLowerCase().includes(lowerQuery))
      );
    }

    // Apply level filter
    if (levelFilter) {
      result = result.filter((category) => {
        const level = getCategoryLevel(category);
        if (levelFilter === 'root') return level === 0;
        if (levelFilter === 'sub') return level > 0;
        return true;
      });
    }

    setFilteredCategories(result);
  }, [searchQuery, levelFilter, categories]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (searchQuery) count++;
    if (levelFilter) count++;
    setActiveFilters(count);
  }, [searchQuery, levelFilter]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setLevelFilter("");
    setShowFilters(false);
  };

  // Get category level
  const getCategoryLevel = (category: ICategory): number => {
    let level = 0;
    let currentCategory = category;
    
    while (currentCategory.parent_id) {
      level++;
      const parentId = typeof currentCategory.parent_id === 'string' 
        ? currentCategory.parent_id 
        : currentCategory.parent_id._id;
      currentCategory = categories.find(c => c._id === parentId) || currentCategory;
      if (level > 10) break; // Prevent infinite loop
    }
    
    return level;
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      try {
        const response = await api.delete(`admin/category/${id}`);
        if (response.data.status) {
          setCategories((prev) => prev.filter((c) => c._id !== id));
        } else {
          setError(response.data.message);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Xóa danh mục thất bại');
      }
    }
  };

  // Lấy _id của danh mục cha (có thể là object hoặc string)
  const getParentId = (category: ICategory): string | null => {
    if (!category.parent_id) return null;
    if (typeof category.parent_id === 'string') return category.parent_id;
    return category.parent_id._id;
  };

  // Đệ quy xây cây danh mục
  const buildCategoryTree = (items: ICategory[], parentId: string | null = null, level = 0): JSX.Element[] => {
    return items
      .filter((item) => getParentId(item) === parentId)
      .map((item) => (
        <div key={item._id} className="ml-4">
          <div className="flex justify-between items-center py-3 px-4 bg-white rounded-xl border border-gray-200/50 hover:bg-gray-50/50 transition-all duration-200 mb-2">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${level === 0 ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
              <div>
                <span className={`${level > 0 ? 'text-gray-700' : 'font-semibold text-gray-900'}`}>
                  {level > 0 && '↳'} {item.name}
                </span>
                <span className="ml-2 text-gray-400 text-sm">({item.slug})</span>
                {item.description && (
                  <p className="text-gray-500 text-xs mt-1">{item.description}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/admin/category/edit/${item._id}`)}
                className="p-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all duration-200 shadow-sm hover:shadow-md"
                title="Chỉnh sửa"
              >
                <FaEdit size={14} />
              </button>
              <button
                onClick={() => handleDelete(item._id!)}
                className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                title="Xóa"
              >
                <FaTrash size={14} />
              </button>
            </div>
          </div>
          {buildCategoryTree(items, item._id!, level + 1)}
        </div>
      ));
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
                placeholder="Tìm kiếm theo tên hoặc slug..."
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



            {/* Add Category Button */}
            <button
              onClick={() => navigate('/admin/category/add')}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-blue-500/25"
            >
              <FaPlus className="text-sm" />
              <span className="hidden sm:inline">Thêm danh mục</span>
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilters > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-sm text-gray-600">Bộ lọc đang hoạt động:</span>
            {levelFilter && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Cấp độ: {levelFilter === 'root' ? 'Danh mục gốc' : 'Danh mục con'}
                <button
                  onClick={() => setLevelFilter("")}
                  className="ml-1 hover:text-blue-600"
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
            {/* Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cấp độ danh mục
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                <option value="">Tất cả cấp độ</option>
                <option value="root">Danh mục gốc</option>
                <option value="sub">Danh mục con</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Categories Tree Section */}
      <div className="p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaFolder className="text-gray-400 text-xl" />
                </div>
                <p className="text-gray-500 font-medium">Không tìm thấy danh mục nào</p>
                <p className="text-gray-400 text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {buildCategoryTree(filteredCategories)}
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-600">
          Hiển thị <span className="font-semibold">{filteredCategories.length}</span> trong tổng số <span className="font-semibold">{categories.length}</span> danh mục
        </div>
      </div>
    </div>
  );
};

export default ListCategory;
