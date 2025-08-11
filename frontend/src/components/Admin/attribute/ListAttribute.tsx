import * as React from 'react';
import { useEffect, useState } from "react";
import {
  getAllAttributes,
  deleteAttribute,
  createAttributevalue,
  getAttributeValues,
  updateAttributeValue,
  deleteAttributeValue,
} from "../../../../api/attribute.api";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaFilter, FaSearch, FaUndo, FaEdit, FaTrash, FaPlus, FaEye, FaFolder } from "react-icons/fa";
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { ToastSucess, ToastError, ToastWarning } from "../../../utils/toast";

interface AttributeValue {
  _id: string;
  value: string;
}

interface Attribute {
  _id: string;
  name: string;
  type: string;
}

const AttributeList: React.FC = () => {
  const navigate = useNavigate();
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [filteredAttributes, setFilteredAttributes] = useState<Attribute[]>([]);
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [attributeValues, setAttributeValues] = useState<AttributeValue[]>([]);
  const [editingValueId, setEditingValueId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { register, handleSubmit, reset, setValue } = useForm<{ value: string }>();

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        setLoading(true);
        const res = await getAllAttributes();
        if (res.data.status) {
          setAttributes(res.data.data || []);
          setFilteredAttributes(res.data.data || []);
        } else {
          setError(res.data.message);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải thuộc tính');
      } finally {
        setLoading(false);
      }
    };
    fetchAttributes();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let result = [...attributes];

    // Apply search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((attr) =>
        attr.name.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply type filter
    if (typeFilter) {
      result = result.filter((attr) => attr.type === typeFilter);
    }

    setFilteredAttributes(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, typeFilter, attributes]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (searchQuery) count++;
    if (typeFilter) count++;
    setActiveFilters(count);
  }, [searchQuery, typeFilter]);

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setTypeFilter("");
    setShowFilters(false);
  };

  const fetchAttributeValues = async (attributeId: string) => {
    try {
      const res = await getAttributeValues(attributeId);
      setAttributeValues(res.data.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy giá trị:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Xác nhận xóa?")) return;
    try {
      await deleteAttribute(id);
      setAttributes(attributes.filter((attr) => attr._id !== id));
      ToastSucess("Xóa thành công");
    } catch (error: any) {
          // Lấy thông báo lỗi chính xác từ response.data.message nếu có
          const msg = error.response?.data?.message || error.message;
    
          if (msg.includes("Không thể xóa")) {
            ToastWarning(msg); // Hiển thị cảnh báo từ backend
          } else {
            ToastError(msg || "Lỗi xóa sản phẩm");
          }
        }
  };

  const handleAddOrUpdateValue = async (attributeId: string, data: { value: string }) => {
    try {
      if (editingValueId) {
        await updateAttributeValue(editingValueId, data);
        ToastSucess("Cập nhật thành công");
      } else {
        await createAttributevalue({ attribute_id: attributeId, value: data.value });
        ToastSucess("Thêm thành công");
      }
      await fetchAttributeValues(attributeId);
      reset();
      setEditingValueId(null);
    } catch (err) {
      console.error(err);
      ToastError("Thao tác thất bại!");
    }
  };

  const handleDeleteValue = async (valueId: string, attributeId: string) => {
    if (!window.confirm("Xóa giá trị này?")) return;
    try {
      await deleteAttributeValue(valueId);
      fetchAttributeValues(attributeId);
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (attrId: string) => {
    setOpenModalId(attrId);
    fetchAttributeValues(attrId);
    reset();
    setEditingValueId(null);
  };

  const startEditValue = (val: AttributeValue) => {
    setValue("value", val.value);
    setEditingValueId(val._id);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAttributes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAttributes.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
                placeholder="Tìm kiếm theo tên thuộc tính..."
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
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 ${showFilters || activeFilters > 0
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

            {/* Add Attribute Button */}
            <button
              onClick={() => navigate('/admin/attribute/add')}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-blue-500/25"
            >
              <FaPlus className="text-sm" />
              <span className="hidden sm:inline">Thêm thuộc tính</span>
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilters > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-sm text-gray-600">Bộ lọc đang hoạt động:</span>
            {typeFilter && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Loại: {typeFilter}
                <button
                  onClick={() => setTypeFilter("")}
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
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại thuộc tính
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">Tất cả loại</option>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="select">Select</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Attributes Table Section */}
      <div className="p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
          {currentItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaFolder className="text-gray-400 text-xl" />
                </div>
                <p className="text-gray-500 font-medium">Không tìm thấy thuộc tính nào</p>
                <p className="text-gray-400 text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="border-t bg-gray-50">
                  <tr>
                    <th className="p-3">Tên thuộc tính</th>
                    <th className="p-3">Loại</th>
                    <th className="p-3">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((attr) => (
                    <tr key={attr._id} className="hover:bg-gray-50 border-b">
                      <td className="p-3">{attr.name}</td>
                      <td className="p-3">{attr.type}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                            onClick={() => openModal(attr._id)}
                            title="Xem giá trị"
                          >
                            <FaEye size={14} />
                          </button>
                          <button
                            className="p-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all duration-200 shadow-sm hover:shadow-md"
                            onClick={() => navigate(`/admin/attribute/edit/${attr._id}`)}
                            title="Chỉnh sửa"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                            onClick={() => handleDelete(attr._id)}
                            title="Xóa"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>

                        {openModalId === attr._id && (
                          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl w-full max-w-lg">
                              <div className="flex justify-between items-center p-4 border-b">
                                <h5 className="text-lg font-semibold text-gray-800">
                                  Giá trị cho thuộc tính: <span className="text-blue-600">{attr.name}</span>
                                </h5>
                                <button
                                  className="text-gray-500 hover:text-gray-700"
                                  onClick={() => {
                                    setOpenModalId(null);
                                    setEditingValueId(null);
                                    reset();
                                  }}
                                >
                                  <X size={20} />
                                </button>
                              </div>
                              <div className="p-4">
                                <form
                                  onSubmit={handleSubmit((data) => handleAddOrUpdateValue(attr._id, data))}
                                  className="mb-4"
                                >
                                  <div className="mb-4">
                                    <input
                                      {...register("value", { required: true })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholder="Nhập giá trị mới"
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <button
                                      type="button"
                                      className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200"
                                      onClick={() => {
                                        setOpenModalId(null);
                                        setEditingValueId(null);
                                        reset();
                                      }}
                                    >
                                      Đóng
                                    </button>
                                    <button
                                      type="submit"
                                      className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200"
                                    >
                                      {editingValueId ? "Cập nhật" : "Thêm"}
                                    </button>
                                  </div>
                                </form>

                                <h6 className="text-base font-medium mb-2">Danh sách giá trị:</h6>
                                <div className="space-y-2">
                                  {attributeValues.map((val) => (
                                    <div
                                      key={val._id}
                                      className="flex justify-between items-center p-2 bg-gray-50 rounded-xl"
                                    >
                                      <span>{val.value}</span>
                                      <div className="flex gap-2">
                                        <button
                                          className="p-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all duration-200"
                                          onClick={() => startEditValue(val)}
                                        >
                                          <FaEdit size={14} />
                                        </button>
                                        <button
                                          className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200"
                                          onClick={() => handleDeleteValue(val._id, attr._id)}
                                        >
                                          <FaTrash size={14} />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                  {attributeValues.length === 0 && (
                                    <p className="text-gray-500 italic">Không có giá trị nào</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Hiển thị <span className="font-semibold">{currentItems.length}</span> trong tổng số <span className="font-semibold">{filteredAttributes.length}</span> thuộc tính
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`px-3 py-2 border border-gray-200 rounded-xl ${currentPage === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'
                    }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttributeList;