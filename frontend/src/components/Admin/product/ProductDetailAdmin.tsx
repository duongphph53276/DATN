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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getProductById(id);
        const variantRes = await getVariantsByProduct(id);

        setProduct(res.data.data.product);
        setVariants(variantRes.data.data);
      } catch {
        ToastError("Không tìm thấy sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-600 mb-6">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Link
            to="/admin/product"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  const galleryItems = [
    ...(product.images ? [{ original: product.images, thumbnail: product.images }] : []),
    ...(product.album?.map((url: string) => ({
      original: url,
      thumbnail: url,
    })) || []),
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", text: "Đang bán" },
      disabled: { color: "bg-red-100 text-red-800", text: "Tạm tắt" },
      new: { color: "bg-blue-100 text-blue-800", text: "Mới" },
      bestseller: { color: "bg-yellow-100 text-yellow-800", text: "Bán chạy" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Chi tiết sản phẩm</h1>
            <p className="text-gray-600">Quản lý thông tin chi tiết sản phẩm</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/product"
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại
            </Link>
          </div>
        </div>

        {/* Main Content: Two Columns */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Left Column: Images */}
          <div className="xl:col-span-2">
            <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Hình ảnh sản phẩm
              </h2>
              {galleryItems.length > 0 ? (
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <ImageGallery
                    items={galleryItems}
                    showPlayButton={false}
                    showFullscreenButton={true}
                    showThumbnails={true}
                    thumbnailPosition="bottom"
                    additionalClass="custom-image-gallery"
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 font-medium">Chưa có ảnh nào cho sản phẩm này</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Product Info and Variants */}
          <div className="xl:col-span-3 space-y-6">
            {/* Product Info */}
            <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Thông tin sản phẩm
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                  {getStatusBadge(product.status)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Danh mục</p>
                    <p className="font-medium text-gray-800">
                      {typeof product.category_id === "object" ? product.category_id.name : product.category_id || "N/A"}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">SKU</p>
                    <p className="font-medium text-gray-800">{product.sku || "N/A"}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Đánh giá trung bình</p>
                    <div className="flex items-center">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.average_rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="font-medium text-gray-800">{product.average_rating ?? "0"}/5</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Tổng số lượng đã bán</p>
                    <p className="font-medium text-gray-800">{product.total_sold ?? "0"}</p>
                  </div>
                </div>
                
                {product.description && (
                  <div className="mt-6">
                    <p className="text-sm text-gray-600 mb-3 font-medium">Mô tả sản phẩm</p>
                    <div
                      className="text-gray-700 prose max-w-none bg-gray-50 rounded-lg p-4 border border-gray-200"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Variants */}
            <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Danh sách biến thể ({variants.length})
              </h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">Ảnh</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">Giá bán</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">Giá nhập</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">Tồn kho</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">Đã bán</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">Thuộc tính</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {variants.map((variant, index) => (
                      <tr key={variant._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-4">
                          {variant.image ? (
                            <img
                              src={variant.image}
                              alt="Variant"
                              className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-lg font-bold text-red-600">
                            {variant.price.toLocaleString()}đ
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-lg font-semibold text-gray-700">
                            {variant.import_price.toLocaleString()}đ
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            variant.quantity > 10 ? 'bg-green-100 text-green-800' : 
                            variant.quantity > 0 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {variant.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-gray-700 font-medium">{variant.sold_quantity}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            {variant.attributes!.map((attr: IVariantAttribute, idx: number) => (
                              <div key={idx} className="text-sm">
                                <span className="font-medium text-gray-800">{attr.attribute_name || attr.attribute_id}</span>
                                <span className="text-gray-500 mx-1">:</span>
                                <span className="text-gray-700">{attr.value || attr.value_id}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {variants.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-12">
                          <div className="text-gray-500">
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="text-lg font-medium">Chưa có biến thể nào</p>
                            <p className="text-sm">Sản phẩm này chưa có biến thể nào được tạo.</p>
                          </div>
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
    </div>
  );
};

export default ProductDetailAdmin;