import React, { useState, useEffect } from "react";
import { getAllProducts, deleteProduct } from "../../../api/product.api";
import { Link, useNavigate } from "react-router-dom";
import { getCategories } from "../../../api/category.api"; // Giả định API lấy danh mục

const ListProduct: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy danh sách sản phẩm
        const { data: productData } = await getAllProducts();
        setProducts(productData.data);

        // Lấy danh sách danh mục
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => navigate("/admin/product/add")}
      >
        Thêm sản phẩm
      </button>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Tên</th>
            <th className="border p-2">Danh mục</th>
            <th className="border p-2">Ảnh</th>
            <th className="border p-2">SKU</th>
            <th className="border p-2">Số lượng đã bán</th>
            <th className="border p-2">Trạng thái</th>
            <th className="border p-2"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">{getCategoryName(product.category_id)}</td>
              <td className="border p-2">
                {product.images ? (
                  <img
                    src={product.images}
                    alt={product.name}
                    className="w-16 h-16 object-cover"
                  />
                ) : (
                  "Không có ảnh"
                )}
              </td>
              <td className="border p-2">{product.sku || "N/A"}</td>
              <td className="border p-2">{product.sold_quantity || 0}</td>
              <td className="border p-2">{product.status}</td>
              <td className="actions-cell">
                <div className="buttons right nowrap">
                  <button className="button small green --jb-modal" data-target="sample-modal-2" type="button">
                    <span className="icon"><i className="mdi mdi-eye" /></span>
                  </button>
                  <button
                    className="button small bg-yellow-400 hover:bg-yellow-500 text-white" type="button"
                    onClick={() => navigate(`/admin/product/edit/${product._id}`)}
                  >
                    <span className="icon"><i className="mdi mdi-square-edit-outline text-xl" /></span>
                  </button>
                  <button className="button small red --jb-modal" data-target="sample-modal" type="button"
                    onClick={() => handleDelete(product._id)}>
                    <span className="icon"><i className="mdi mdi-trash-can" /></span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListProduct;