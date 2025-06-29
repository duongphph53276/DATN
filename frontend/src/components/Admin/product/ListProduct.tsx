import React, { useState, useEffect } from "react";
import { getAllProducts, deleteProduct } from "../../../../api/product.api";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../../../api/category.api";

const ListProduct: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: productData } = await getAllProducts();
        setProducts(productData.data);

        const { data: categoryData } = await getCategories();
        setCategories(categoryData.data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Không xác định";
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((product) => product._id !== id));
        alert("Xóa sản phẩm thành công");
      } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Danh sách sản phẩm</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={() => navigate("/admin/product/add")}
        >
          + Thêm sản phẩm
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left px-4 py-3">Tên</th>
              <th className="text-left px-4 py-3">Danh mục</th>
              <th className="text-left px-4 py-3">Ảnh</th>
              <th className="text-left px-4 py-3">SKU</th>
              <th className="text-left px-4 py-3">Đã bán</th>
              <th className="text-left px-4 py-3">Trạng thái</th>
              <th className="text-center px-4 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{product.name}</td>
                <td className="px-4 py-3">{getCategoryName(product.category_id)}</td>
                <td className="px-4 py-3">
                  {product.images ? (
                    <img
                      src={product.images}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded border"
                    />
                  ) : (
                    <span className="text-gray-400 italic">Không có ảnh</span>
                  )}
                </td>
                <td className="px-4 py-3">{product.sku || "N/A"}</td>
                <td className="px-4 py-3">{product.sold_quantity || 0}</td>
                <td className="px-4 py-3 capitalize">
                  {product.status === "active" && <span className="text-green-600 font-medium">Đang bán</span>}
                  {product.status === "disabled" && <span className="text-gray-500">Tạm tắt</span>}
                  {product.status === "new" && <span className="text-blue-500">Mới</span>}
                  {product.status === "bestseller" && <span className="text-yellow-500">Bán chạy</span>}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => navigate(`/admin/product/${product._id}`)}>👁️</button>
                    <button onClick={() => navigate(`/admin/product/edit/${product._id}`)}>✏️</button>
                    <button onClick={() => handleDelete(product._id)}>🗑️</button>

                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500 italic">
                  Không có sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListProduct;
