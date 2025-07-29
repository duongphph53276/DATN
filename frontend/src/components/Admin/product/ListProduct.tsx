import React, { useState, useEffect } from "react";
import { getAllProducts, deleteProduct, getProductById } from "../../../../api/product.api";
import { getVariantsByProduct } from "../../../../api/variant.api";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../../../api/category.api";
import { IProduct } from "../../../interfaces/product";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import { FaEdit, FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const ListProduct: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // States for filters and search
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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

        const categoryRes = await getCategories();
        const categoriesData = categoryRes.data.data || [];

        setProducts(productsWithVariants);
        setFilteredProducts(productsWithVariants);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
        alert("Không thể tải dữ liệu. Vui lòng kiểm tra kết nối hoặc API.");
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
        if (statusFilter === "bestseller") return product.status === "bestseller";
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
        const [min, max] = priceFilter.split("-").map(Number);
        // Check if the product's price range overlaps with the selected range
        return minPrice <= max && (max === undefined || maxPrice >= min);
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

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((product) => product._id !== id));
      setFilteredProducts(filteredProducts.filter((product) => product._id !== id));
      if (currentProducts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
    }
  };

  const openModal = async (productId: string) => {
    try {
      const res = await getProductById(productId);
      setSelectedProduct(res.data.data.product);
      setOpenModalId(productId);
    } catch (error) {
      console.error("Lỗi khi mở modal sản phẩm:", error);
      alert("Không thể tải thông tin sản phẩm");
    }
  };

  const closeModal = () => {
    setOpenModalId(null);
    setSelectedProduct(null);
  };

  return (
    <div className="bg-white shadow-md rounded-lg">
      <div className="p-4 border-b">
        <h5 className="text-lg font-semibold text-gray-800">Bộ lọc</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <select
              id="ProductCategory"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Danh mục</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              id="ProductStatus"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Trạng thái</option>
              <option value="new">Mới</option>
              <option value="active">Hoạt động</option>
              <option value="disabled">Tạm tắt</option>
              <option value="bestseller">Bán chạy</option>
            </select>
          </div>
          <div>
            <select
              id="ProductPrice"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="">Giá</option>
              <option value="0-100000">0 - 100,000đ</option>
              <option value="100001-500000">100,001 - 500,000đ</option>
              <option value="500001-1000000">500,001 - 1,000,000đ</option>
              <option value="1000001">Trên 1,000,000đ</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <input
              type="search"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="dt-search-0"
              placeholder="Tìm kiếm sản phẩm theo tên hoặc SKU"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
              type="button"
            >
              <i className="bx bx-export text-lg" />
              <span className="hidden sm:inline">Xuất</span>
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              onClick={() => navigate("/admin/product/add")}
            >
              <i className="bx bx-plus text-lg" />
              <span className="hidden sm:inline">Thêm sản phẩm</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="border-t bg-gray-50">
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
                  <tr key={product._id} className="hover:bg-gray-50 border-b">
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
                        <img src={product.images} alt={product.name} className="w-16 h-16 object-cover rounded border" />
                      ) : (
                        <span className="text-gray-400 italic">Không có ảnh</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <h6 className="font-medium">{product.name}</h6>
                        <small className="text-gray-500 hidden sm:block">{product.description || ""}</small>
                      </div>
                    </td>
                   <td className="p-3">{getPriceDisplay(product.variants ?? [])}</td>
                    <td className="p-3">{product.sku || "N/A"}</td>
                    <td className="p-3">{getCategoryName(product.category_id)}</td>
                    <td className="p-3">{product.sold_quantity || 0}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          product.status === "active"
                            ? "bg-green-100 text-green-700"
                            : product.status === "disabled"
                            ? "bg-gray-100 text-gray-700"
                            : product.status === "new"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
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
                          className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                          onClick={() => navigate(`/admin/product/edit/${product._id}`)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          onClick={() => handleDelete(product._id!)}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-6 text-gray-500 italic">
                    Không có sản phẩm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Hiển thị {indexOfFirstProduct + 1} đến {Math.min(indexOfLastProduct, filteredProducts.length)} của {filteredProducts.length} sản phẩm
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button
              className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <AiOutlineDoubleLeft />
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`px-3 py-1 border border-gray-300 rounded-lg ${
                  currentPage === index + 1 ? "bg-blue-500 text-white" : "text-gray-600"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <AiOutlineDoubleRight />
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
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          selectedProduct.status === "active"
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
    </div>
  );
};

export default ListProduct;