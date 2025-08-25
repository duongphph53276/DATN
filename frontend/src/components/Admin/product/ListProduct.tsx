import React, { useState, useEffect } from "react";
import { getAllProducts, deleteProduct, getProductById } from "../../../../api/product.api";
import { getVariantsByProduct } from "../../../../api/variant.api";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../../../api/category.api";
import { IProduct } from "../../../interfaces/product";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import { FaEdit, FaFilter, FaSearch, FaUndo, FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { ToastSucess, ToastError, ToastWarning } from "../../../utils/toast";
import { usePermissions } from "../../../hooks/usePermissions";

const ListProduct: React.FC = () => {
  const navigate = useNavigate();
  const { hasPermission, isAdmin } = usePermissions();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);

  // States for filters and search
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await getAllProducts();
        const productsData = productRes.data.data || [];

        const productsWithVariants = await Promise.all(
          productsData.map(async (product: IProduct) => {
            const variantRes = await getVariantsByProduct(product._id!);
            return { ...product, variants: variantRes.data.data || [] };
          })
        );

        // Sắp xếp sản phẩm theo createdAt giảm dần (mới nhất ở trên)
        const sortedProducts = productsWithVariants.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        const categoryRes = await getCategories();
        const categoriesData = categoryRes.data.data || [];

        setProducts(sortedProducts);
        setFilteredProducts(sortedProducts);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
        ToastError("Không thể tải dữ liệu. Vui lòng kiểm tra kết nối hoặc API.");
      }
    };
    fetchData();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let result = [...products];

    // Apply category filter
    if (categoryFilter) {
      result = result.filter(
        (product) =>
          (typeof product.category_id === "object" && product.category_id !== null
            ? product.category_id._id
            : product.category_id) === categoryFilter
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter((product) => {
        if (statusFilter === "new") return product.status === "new";
        if (statusFilter === "active") return product.status === "active";
        if (statusFilter === "disabled") return product.status === "disabled";
        return true;
      });
    }

    // Apply price filter
    if (priceFilter) {
      result = result.filter((product) => {
        if (!product.variants || product.variants.length === 0) return false;
        const prices = product.variants.map((v) => v.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const parts = priceFilter.split("-").map(Number);
        const min = parts[0];
        const max = parts[1];
        if (isNaN(max)) {
          // For ranges like "1000001" (over 1,000,000)
          return minPrice >= min;
        } else {
          // For ranges with min-max
          return minPrice <= max && maxPrice >= min;
        }
      });
    }

    // Apply search by name or SKU
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerQuery) ||
          (product.sku && product.sku.toLowerCase().includes(lowerQuery))
      );
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [categoryFilter, statusFilter, priceFilter, searchQuery, products]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (categoryFilter) count++;
    if (statusFilter) count++;
    if (priceFilter) count++;
    if (searchQuery) count++;
    setActiveFilters(count);
  }, [categoryFilter, statusFilter, priceFilter, searchQuery]);

  // Reset all filters
  const resetFilters = () => {
    setCategoryFilter("");
    setStatusFilter("");
    setPriceFilter("");
    setSearchQuery("");
    setShowFilters(false);
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getCategoryName = (categoryId: any) => {
    const idToFind = typeof categoryId === "object" && categoryId !== null ? categoryId._id : categoryId;
    const category = categories.find((cat) => cat._id === idToFind);
    return category ? category.name : "Không xác định";
  };

  const getPriceDisplay = (variants: any[]) => {
    if (variants.length === 0) return "N/A";
    if (variants.length === 1) return `${variants[0].price.toLocaleString()}đ`;
    const minPrice = Math.min(...variants.map((v) => v.price));
    const maxPrice = Math.max(...variants.map((v) => v.price));
    return `${minPrice.toLocaleString()}đ - ${maxPrice.toLocaleString()}đ`;
  };

  const openDeleteModal = (product: IProduct) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete._id!);
      setProducts(products.filter((p) => p._id !== productToDelete._id));
      setFilteredProducts(filteredProducts.filter((p) => p._id !== productToDelete._id));

      if (currentProducts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }

      ToastSucess("Xóa sản phẩm thành công");
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      if (msg.includes("Không thể xóa")) {
        ToastWarning(msg);
      } else {
        ToastError(msg || "Lỗi xóa sản phẩm");
      }
    } finally {
      closeDeleteModal();
    }
  };

  const openModal = async (productId: string) => {
    try {
      const res = await getProductById(productId);
      setSelectedProduct(res.data.data.product);
      setOpenModalId(productId);
    } catch (error) {
      console.error("Lỗi khi mở modal sản phẩm:", error);
      ToastError("Không thể tải thông tin sản phẩm");
    }
  };

  const closeModal = () => {
    setOpenModalId(null);
    setSelectedProduct(null);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
      {/* Header with Search and Actions */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="search"
                className="w-full lg:w-96 pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                placeholder="Tìm kiếm sản phẩm theo tên hoặc SKU..."
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


            {/* Add Product Button */}
            <button
              onClick={() => navigate("/admin/product/add")}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-blue-500/25"
            >
              <span className="text-lg">+</span>
              <span className="hidden sm:inline">Thêm sản phẩm</span>
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilters > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-sm text-gray-600">Bộ lọc đang hoạt động:</span>
            {categoryFilter && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Danh mục: {categories.find(cat => cat._id === categoryFilter)?.name}
                <button
                  onClick={() => setCategoryFilter("")}
                  className="ml-1 hover:text-blue-600"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {statusFilter && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Trạng thái: {statusFilter === 'new' ? 'Mới' : statusFilter === 'active' ? 'Hoạt động' : statusFilter === 'disabled' ? 'Tạm tắt' : 'Bán chạy'}
                <button
                  onClick={() => setStatusFilter("")}
                  className="ml-1 hover:text-green-600"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {priceFilter && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                Giá: {priceFilter === '0-100000' ? '0 - 100,000đ' : priceFilter === '100001-500000' ? '100,001 - 500,000đ' : priceFilter === '500001-1000000' ? '500,001 - 1,000,000đ' : 'Trên 1,000,000đ'}
                <button
                  onClick={() => setPriceFilter("")}
                  className="ml-1 hover:text-purple-600"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
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
                <option value="new">Mới</option>
                <option value="active">Hoạt động</option>
                <option value="disabled">Tạm tắt</option>
                <option value="bestseller">Bán chạy</option>
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khoảng giá
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="">Tất cả giá</option>
                <option value="0-100000">0 - 100,000đ</option>
                <option value="100001-500000">100,001 - 500,000đ</option>
                <option value="500001-1000000">500,001 - 1,000,000đ</option>
                <option value="1000001">Trên 1,000,000đ</option>
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
                <th className="p-3"></th>
                <th className="p-3"></th>
                <th className="p-3">Hình ảnh</th>
                <th className="p-3">Tên</th>
                <th className="p-3">Giá</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Danh mục</th>
                <th className="p-3">Đã bán</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/50 border-b border-gray-100/50 transition-colors duration-200">
                    <td className="p-3"></td>
                    <td className="p-3">
                      {/* <button
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        onClick={() => openModal(product._id)}
                      >
                        <i className="bx bx-plus" />
                      </button> */}
                    </td>
                    <td className="p-3">
                      {product.images ? (
                        <img src={product.images} alt={product.name} className="w-16 h-16 object-cover rounded-xl border border-gray-200/50 shadow-sm" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-xl border border-gray-200/50 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Không có ảnh</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <h6 className="font-semibold text-gray-900">{product.name}</h6>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-gray-900">{getPriceDisplay(product.variants ?? [])}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-gray-600 font-mono text-sm">{product.sku || "N/A"}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-gray-700">{getCategoryName(product.category_id)}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-medium text-gray-900">{product.total_sold || 0}</span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${product.status === "active"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : product.status === "disabled"
                            ? "bg-gray-100 text-gray-700 border border-gray-200"
                            : product.status === "new"
                              ? "bg-blue-100 text-blue-700 border border-blue-200"
                              : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                          }`}
                      >
                        {product.status === "active" && "Đang bán"}
                        {product.status === "disabled" && "Tạm tắt"}
                        {product.status === "new" && "Mới"}
                        {product.status === "bestseller" && "Bán chạy"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          onClick={() => navigate(`/admin/product/${product._id}`)}
                        >
                          <FaEye />
                        </button>
                        <button
                          className="p-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all duration-200 shadow-sm hover:shadow-md"
                          onClick={() => navigate(`/admin/product/edit/${product._id}`)}
                          title="Chỉnh sửa"
                        >
                          <FaEdit size={14} />
                        </button>
                        {(isAdmin() || hasPermission('delete_product')) && (
                          <button
                            className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                            onClick={() => openDeleteModal(product)}
                            title="Xóa"
                          >
                            <MdDelete size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <FaSearch className="text-gray-400 text-xl" />
                      </div>
                      <p className="text-gray-500 font-medium">Không tìm thấy sản phẩm nào</p>
                      <p className="text-gray-400 text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200/50">
          <div className="text-sm text-gray-600 mb-4 md:mb-0">
            Hiển thị <span className="font-semibold">{indexOfFirstProduct + 1}</span> đến <span className="font-semibold">{Math.min(indexOfLastProduct, filteredProducts.length)}</span> của <span className="font-semibold">{filteredProducts.length}</span> sản phẩm
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-all duration-200 disabled:hover:bg-transparent"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <AiOutlineDoubleLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`px-4 py-2 border rounded-xl transition-all duration-200 ${currentPage === index + 1
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-500 shadow-lg shadow-blue-500/25"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-all duration-200 disabled:hover:bg-transparent"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <AiOutlineDoubleRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {openModalId && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h5 className="text-lg font-semibold text-gray-800">
                Chi tiết sản phẩm: <span className="text-blue-600">{selectedProduct.name}</span>
              </h5>
              <button className="text-gray-500 hover:text-gray-700" onClick={closeModal}>
                <i className="bx bx-x text-xl" />
              </button>
            </div>
            <div className="p-4">
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="p-2 font-medium">Sản phẩm:</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        {selectedProduct.images ? (
                          <img
                            src={selectedProduct.images}
                            alt={selectedProduct.name}
                            className="w-12 h-12 object-cover rounded border"
                          />
                        ) : (
                          <span className="text-gray-400 italic">Không có ảnh</span>
                        )}
                        <div>
                          <h6 className="font-medium">{selectedProduct.name}</h6>
                          <small className="text-gray-500 hidden sm:block">
                            {selectedProduct.description || "Không có mô tả"}
                          </small>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Danh mục:</td>
                    <td className="p-2 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <i className="bx bx-headphone text-red-600" />
                      </span>
                      {getCategoryName(selectedProduct.category_id)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">SKU:</td>
                    <td className="p-2">{selectedProduct.sku || "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Giá:</td>
                    <td className="p-2">{getPriceDisplay(selectedProduct.variants || [])}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Số lượng:</td>
                    <td className="p-2">{selectedProduct.quantity || "0"}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Trạng thái:</td>
                    <td className="p-2">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${selectedProduct.status === "active"
                          ? "bg-green-100 text-green-700"
                          : selectedProduct.status === "disabled"
                            ? "bg-gray-100 text-gray-700"
                            : selectedProduct.status === "new"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {selectedProduct.status || "Lên lịch"}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Hành động:</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <button
                          className="p-2 text-yellow-500 hover:text-yellow-600"
                          onClick={() => navigate(`/admin/product/edit/${selectedProduct._id}`)}
                        >
                          <i className="bx bx-edit text-lg" />
                        </button>
                        <div className="relative">
                          <button className="p-2 text-gray-500 hover:text-gray-700">
                            <i className="bx bx-dots-vertical-rounded text-lg" />
                          </button>
                          <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg hidden group-hover:block">
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => navigate(`/admin/product/${selectedProduct._id}`)}
                            >
                              Xem
                            </a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Tạm ngưng
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {isDeleteModalOpen && productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fadeInScale"
          >
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <MdDelete className="text-red-600 text-3xl" />
            </div>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
              Xác nhận xóa
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa sản phẩm{" "}
              <span className="font-semibold text-red-500">{productToDelete.name}</span>?
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition shadow"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListProduct;