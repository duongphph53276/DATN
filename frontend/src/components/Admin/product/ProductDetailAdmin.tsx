import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../../../../api/product.api";
import { getVariantsByProduct } from "../../../../api/variant.api";
import { IProduct } from "../../../interfaces/product";
import { IVariant, IVariantAttribute } from "../../../interfaces/variant";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { ToastSucess, ToastError } from "../../../utils/toast";

const ProductDetailAdmin = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [variants, setVariants] = useState<IVariant[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await getProductById(id);
        const variantRes = await getVariantsByProduct(id);

        setProduct(res.data.data.product);
        setVariants(variantRes.data.data);
      } catch (err) {
        ToastError("Không tìm thấy sản phẩm");
      }
    };

    fetchData();
  }, [id]);


  if (!product) return <div className="text-center py-10 text-gray-500">Đang tải sản phẩm...</div>;

  const galleryItems = [
    ...(product.images ? [{ original: product.images, thumbnail: product.images }] : []),
    ...(product.album?.map((url: string) => ({
      original: url,
      thumbnail: url,
    })) || []),
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Chi tiết sản phẩm</h1>
        <div className="flex gap-4">      
          <Link
            to="/admin/product"
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Quay lại
          </Link>
        </div>
      </div>

      {/* Main Content: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column: Images */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Hình ảnh sản phẩm</h2>
            {galleryItems.length > 0 ? (
              <ImageGallery
                items={galleryItems}
                showPlayButton={false}
                showFullscreenButton={true}
                showThumbnails={true}
                thumbnailPosition="bottom"
                additionalClass="custom-image-gallery"
              />
            ) : (
              <p className="text-gray-500 italic">Chưa có ảnh nào cho sản phẩm này.</p>
            )}
          </div>
        </div>

        {/* Right Column: Product Info and Variants */}
        <div className="lg:col-span-3">
          {/* Product Info */}
          <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{product.name}</h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">Danh mục:</span>{" "}
                {typeof product.category_id === "object" ? product.category_id.name : product.category_id || "N/A"}
              </p>
              <p>
                <span className="font-medium">Trạng thái:</span>{" "}
                {product.status === "active" && "Đang bán"}
                {product.status === "disabled" && "Tạm tắt"}
                {product.status === "new" && "Mới"}
                {product.status === "bestseller" && "Bán chạy"}
              </p>
              <p>
                <span className="font-medium">SKU:</span> {product.sku || "N/A"}
              </p>
              <p>
                <span className="font-medium">Đánh giá trung bình:</span> {product.average_rating ?? "0"}/5
              </p>
              <p>
                <span className="font-medium">Tổng số lượng đã bán:</span> {product.total_sold ?? "0"}
              </p>
              {product.description && (
                <div>
                  <p className="font-medium mb-2">Mô tả:</p>
                  <div
                    className="text-gray-600 prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Danh sách biến thể</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 border-b font-medium">Ảnh</th>
                    <th className="px-4 py-3 border-b font-medium">Giá</th>
                    <th className="px-4 py-3 border-b font-medium">Số lượng</th>
                    <th className="px-4 py-3 border-b font-medium">Số lượng đã bán</th>
                    <th className="px-4 py-3 border-b font-medium">Thuộc tính</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant) => (
                    <tr key={variant._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 border-b">
                        {variant.image ? (
                          <img
                            src={variant.image}
                            alt="Variant"
                            className="w-12 h-12 object-cover rounded-lg border"
                          />
                        ) : (
                          <span className="text-gray-400 italic">Không ảnh</span>
                        )}
                      </td>
                      <td className="px-4 py-3 border-b text-red-600 font-semibold">
                        {variant.price.toLocaleString()}đ
                      </td>
                      <td className="px-4 py-3 border-b">{variant.quantity}</td>
                      <td className="px-4 py-3 border-b">{variant.sold_quantity}</td>
                      <td className="px-4 py-3 border-b space-y-1">
                        {variant.attributes!.map((attr: IVariantAttribute, idx: number) => (
                          <div key={idx} className="text-gray-700">
                            <span className="font-medium">{attr.attribute_name || attr.attribute_id}</span>:{" "}
                            {attr.value || attr.value_id}
                          </div>
                        ))}
                      </td>

                    </tr>
                  ))}
                  {variants.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-gray-500 italic border-b">
                        Chưa có biến thể nào cho sản phẩm này.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailAdmin;