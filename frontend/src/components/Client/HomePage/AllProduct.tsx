import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductFilters from "../../../layout/Client/ProductFilters";
import { getAllProducts } from "../../../../api/product.api";
import { getAllAttributes, getAttributeValues } from "../../../../api/attribute.api";
import { ToastSucess, ToastError } from "../../../utils/toast";
import { addToUserCart, loadUserCart } from "../../../utils/cartUtils";

// Hàm chuyển chuỗi giá về số
const parsePrice = (value: string | number | undefined | null): number => {
  if (typeof value === "number") return value;
  if (!value || typeof value !== "string") return 0;
  return Number(value.replace(/[₫.,]/g, ""));
};

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-center text-red-500">Có lỗi xảy ra khi hiển thị sản phẩm. Vui lòng thử lại sau.</div>;
    }
    return this.props.children;
  }
}

const AllProducts: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ category: "", priceRange: "" });
  const [products, setProducts] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [attributeValues, setAttributeValues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: any }>({});
  const [selectedAttributes, setSelectedAttributes] = useState<{ [productId: string]: { [attributeId: string]: string } }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productRes = await getAllProducts();
        setProducts(productRes.data?.data || []);

        const attrRes = await getAllAttributes();
        setAttributes(attrRes.data?.data || []);

        const attrIds = attrRes.data?.data?.map((attr: any) => attr._id) || [];
        const valuesPromises = attrIds.map((id: string) => getAttributeValues(id));
        const valuesRes = await Promise.all(valuesPromises);
        const allValues = valuesRes.flatMap((res) => res.data?.data || []);
        setAttributeValues(allValues);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        ToastError("Không thể tải dữ liệu. Vui lòng kiểm tra kết nối và thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Cuộn lên đầu khi chuyển trang
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const getAttributeName = (attributeId: string) => {
    const attribute = attributes.find((attr) => attr._id === attributeId);
    return attribute?.name || attributeId;
  };

  const getAttributeValue = (valueId: string) => {
    const value = attributeValues.find((val) => val._id === valueId);
    return value?.value || valueId;
  };

  const getDefaultPrice = (product: any): number => {
    if (product.variants?.length) {
      return Math.min(...product.variants.map((v: any) => parsePrice(v.price)));
    }
    return parsePrice(product.price);
  };

  const filteredProducts = products.filter((product) => {
    const price = product.variants?.length
      ? Math.min(...product.variants.map((v: any) => parsePrice(v.price)))
      : parsePrice(product.price);
    const { category, priceRange } = filters;

    let matchCategory = true;
    let matchPrice = true;

    if (category) {
      matchCategory = product.category === category;
    }

    if (priceRange) {
      if (priceRange === "0-100") {
        matchPrice = price < 100000;
      } else if (priceRange === "100-300") {
        matchPrice = price >= 100000 && price <= 300000;
      } else if (priceRange === "300+") {
        matchPrice = price > 300000;
      }
    }

    return matchCategory && matchPrice;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleSelectAttribute = (productId: string, attributeId: string, valueId: string) => {
    setSelectedAttributes((prev) => {
      const currentAttributes = prev[productId] || {};
      const updatedAttributes = { ...currentAttributes };
      if (currentAttributes[attributeId] === valueId) {
        delete updatedAttributes[attributeId];
      } else {
        updatedAttributes[attributeId] = valueId;
      }

      const product = products.find((p) => p._id === productId);
      const matchedVariant = product?.variants?.find((variant: any) => {
        return variant.attributes.every(
          (attr: any) => updatedAttributes[attr.attribute_id] === attr.value_id
        );
      });

      setSelectedVariants((prevVariants) => ({
        ...prevVariants,
        [productId]: matchedVariant || undefined,
      }));

      return {
        ...prev,
        [productId]: updatedAttributes,
      };
    });
  };

const handleAddToCart = (product: any) => {
  const selectedVariant = selectedVariants[product._id];
  const productAttributes = selectedAttributes[product._id] || {};

  // Kiểm tra bắt buộc variant (đã có, giữ nguyên)
  const requiredAttributes = attributes.filter((attr: any) =>
    product.variants.some((variant: any) =>
      variant.attributes.some((a: any) => a.attribute_id === attr._id)
    )
  );
  const allAttributesSelected = requiredAttributes.every(
    (attr: any) => productAttributes[attr._id]
  );

  if (product.variants?.length && (!selectedVariant || !allAttributesSelected)) {
    ToastError("Vui lòng chọn đầy đủ các thuộc tính của sản phẩm!");
    return;
  }

  // Lấy giỏ hàng
  const cart = loadUserCart();

  // Tìm item tồn tại (đúng variant)
  const existingCartItem = cart.find((item: any) => {
    if (selectedVariant) {
      return item._id === product._id && item.variant?._id === selectedVariant._id;
    }
    return item._id === product._id && !item.variant;
  });

  const existingQuantity = existingCartItem ? existingCartItem.quantity : 0;

  // Tính tồn kho từ API (hợp lý để check trước add)
  const stockQuantity = selectedVariant
    ? selectedVariant.quantity ?? selectedVariant.stock_quantity ?? 0  // Map nếu API dùng stock_quantity
    : product.quantity ?? product.stock_quantity ?? 0;

  if (existingQuantity + 1 > stockQuantity) {
    ToastError("Số lượng trong kho không đủ để thêm sản phẩm này!");
    return;
  }

  // Tạo variantAttributes (đã có)
  const variantAttributes = selectedVariant
    ? Object.entries(productAttributes)
        .map(([attrId, valueId]) => `${getAttributeName(attrId)}: ${getAttributeValue(valueId)}`)
        .join(", ")
    : "Không có thuộc tính";

  // Tạo cartItem với quantity thống nhất
  const cartItem = {
    ...product,
    id: product._id,
    _id: product._id,
    price: selectedVariant ? parsePrice(selectedVariant.price) : getDefaultPrice(product),
    image: selectedVariant ? selectedVariant.image || product.image : product.image,
    variant: selectedVariant
      ? {
          _id: selectedVariant._id,
          product_id: selectedVariant.product_id,
          price: selectedVariant.price,
          attributes: selectedVariant.attributes,  // Giữ nguyên từ API
          quantity: stockQuantity,  // Set quantity làm chuẩn tồn kho
        }
      : undefined,
    variantAttributes,
    quantity: 1,
    quantityInStock: stockQuantity,  // Dự phòng cho không variant
  };

  addToUserCart(cartItem);
  ToastSucess("Đã thêm sản phẩm vào giỏ hàng!");
};


  const getValidAttributeValues = (product: any, attributeId: string, selectedAttributes: { [key: string]: string }) => {
    const validValueIds = new Set<string>();

    product.variants.forEach((variant: any) => {
      const variantAttributes = variant.attributes;
      const isValidVariant = Object.entries(selectedAttributes)
        .filter(([key]) => key !== attributeId)
        .every(([key, value]) => {
          const variantAttr = variantAttributes.find((a: any) => a.attribute_id === key);
          return variantAttr && variantAttr.value_id === value;
        });

      if (isValidVariant) {
        const currentAttr = variantAttributes.find((a: any) => a.attribute_id === attributeId);
        if (currentAttr) {
          validValueIds.add(currentAttr.value_id);
        }
      }
    });

    return Array.from(validValueIds);
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">🧸 Tất cả sản phẩm</h2>

        <ProductFilters onFilter={setFilters} />

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {currentProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
          ) : (
            currentProducts.map((product) => {
              const defaultPrice = getDefaultPrice(product);
              const selectedVariant = selectedVariants[product._id];
              const displayedPrice = selectedVariant ? parsePrice(selectedVariant.price) : defaultPrice;

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100 flex flex-col"
                >
                  <Link to={`/product/${product._id}`}>
                    {product.images ? (
                      <img
                        src={selectedVariant?.image || product.images}
                        alt={product.name}
                        className="w-full h-52 object-cover rounded-lg mb-4"
                      />
                    ) : (
                      <span className="text-gray-400 italic">Không có ảnh</span>
                    )}
                  </Link>

                  {/* Nội dung trong card */}
                  <div className="p-4 flex flex-col h-full">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name || "Sản phẩm không tên"}</h3>

                    <div className="text-rose-500 font-bold mt-2">
                      {displayedPrice.toLocaleString()}₫
                      {product.oldPrice && (
                        <span className="text-gray-400 line-through text-sm ml-2">
                          {parsePrice(product.oldPrice).toLocaleString()}₫
                        </span>
                      )}
                    </div>

                    {/* Các thuộc tính chọn */}
                    {product.variants?.length > 0 && (
                      <div className="mt-1 space-y-3">
                        {attributes.map((attr: any) => {
                          const valueIds = getValidAttributeValues(product, attr._id, selectedAttributes[product._id] || {});
                          if (valueIds.length === 0) return null;

                          return (
                            <div key={attr._id}>
                              <div className="flex flex-wrap justify-center gap-2 my-2">
                                {valueIds.map((valueId) => (
                                  <button
                                    key={String(valueId)}
                                    onClick={() => handleSelectAttribute(product._id, attr._id, valueId as string)}
                                    className={`px-3 py-1 rounded-full text-sm border transition ${selectedAttributes[product._id]?.[attr._id] === valueId
                                        ? "bg-rose-500 text-white border-rose-500"
                                        : "bg-pink-100 text-rose-500 hover:bg-rose-200"
                                      }`}
                                  >
                                    {getAttributeValue(valueId as string)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Spacer để đẩy nút xuống đáy */}
                    <div className="flex-grow" />

                    {/* Nút thêm vào giỏ */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="mt-1 w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium py-2 px-4 rounded-xl hover:brightness-110 transition"
                    >
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Phân trang có Prev/Next */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2 flex-wrap items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg border ${currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              « Prev
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-lg border ${currentPage === index + 1
                  ? "bg-rose-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg border ${currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              Next »
            </button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default AllProducts;
