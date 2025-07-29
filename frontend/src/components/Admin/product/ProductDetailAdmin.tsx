import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById } from "../../../../api/product.api";
import { getVariantsByProduct, deleteVariant } from "../../../../api/variant.api"; // Thêm deleteVariant
import { IProduct } from "../../../interfaces/product";
import { IVariant, IVariantAttribute } from "../../../interfaces/variant";

const ProductDetailAdmin = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [variants, setVariants] = useState<IVariant[]>([]);
  const navigate = useNavigate()
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await getProductById(id);
        const variantRes = await getVariantsByProduct(id);

        setProduct(res.data.data.product);
        setVariants(variantRes.data.data);
      } catch (err) {
        alert("Không tìm thấy sản phẩm");
      }
    };

    fetchData();
  }, [id]);

  if (!product) return <div className="text-center py-10">Đang tải sản phẩm...</div>;

  // Handler xóa biến thể
  const handleDeleteVariant = async (variantId: string | number) => {
    if (!window.confirm("Bạn có chắc muốn xóa biến thể này?")) return;

    try {
      await deleteVariant(variantId);
      setVariants(variants.filter((variant) => variant._id !== variantId));
      alert("Xóa biến thể thành công");
    } catch (error) {
      console.error("Lỗi xóa biến thể:", error);
      alert("Không thể xóa biến thể. Vui lòng thử lại.");
    }
  };

  // Handler sửa biến thể (gợi ý, cần form riêng)
  const handleEditVariant = (variantId: string) => {
    // Điều hướng đến trang sửa biến thể hoặc mở form sửa
    navigate(`/admin/product/${id}/edit-variant/${variantId}`); // Ví dụ
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Thông tin sản phẩm */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Chi tiết sản phẩm</h1>
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h2 className="text-2xl font-semibold">{product.name}</h2>
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <p><span className="font-medium">Danh mục:</span> {typeof product.category_id === 'object' ? product.category_id.name : product.category_id}</p>
            <p><span className="font-medium">Trạng thái:</span> {product.status}</p>
            <p><span className="font-medium">SKU:</span> {product.sku || "N/A"}</p>
            <p><span className="font-medium">Đánh giá trung bình:</span> {product.average_rating ?? "0"}</p>
            <p><span className="font-medium">Số lượng đã bán:</span> {product.sold_quantity ?? "0"}</p>
          </div>
          {product.description && (
            <div>
              <p className="font-medium">Mô tả:</p>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            {product.album?.map((img, idx) => (
              <img key={idx} src={img} alt="album" className="w-24 h-24 object-cover rounded border" />
            ))}
          </div>
        </div>
      </div>

      {/* Danh sách biến thể */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Danh sách biến thể</h2>
        <Link
          to={`/admin/product/${id}/add-variant`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Thêm biến thể
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Ảnh</th>
              <th className="px-4 py-2 border">Giá</th>
              <th className="px-4 py-2 border">Số lượng</th>
              <th className="px-4 py-2 border">Thuộc tính</th>      
            </tr>
          </thead>
          <tbody>
            {variants.map((variant) => (
              <tr key={variant._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">
                  {variant.image ? (
                    <img src={variant.image} className="w-16 h-16 object-cover rounded border" />
                  ) : (
                    <span className="text-gray-400 italic">Không ảnh</span>
                  )}
                </td>
                <td className="px-4 py-2 border text-red-600 font-semibold">
                  {variant.price.toLocaleString()}đ
                </td>
                <td className="px-4 py-2 border">{variant.quantity}</td>
                <td className="px-4 py-2 border space-y-1">
                  {variant.attributes!.map((attr: IVariantAttribute, idx: number) => (
                    <div key={idx} className="text-gray-700">
                      <span className="font-medium">{attr.attribute_name || attr.attribute_id}</span>: {attr.value || attr.value_id}
                    </div>
                  ))}
                </td>              
              </tr>
            ))}
            {variants.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500 italic border">
                  Chưa có biến thể nào cho sản phẩm này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductDetailAdmin;