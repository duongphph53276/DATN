import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductFilters from "../../../layout/Client/ProductFilters";
import { getAllProducts } from "../../../../api/product.api";
import { getAllAttributes, getAttributeValues } from "../../../../api/attribute.api";

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
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [productId: string]: { [attributeId: string]: string };
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productRes = await getAllProducts();
        const fetchedProducts = productRes.data?.data || [];
        setProducts(fetchedProducts);

        const attrRes = await getAllAttributes();
        setAttributes(attrRes.data?.data || []);

        const attrIds = attrRes.data?.data?.map((attr: any) => attr._id) || [];
        const valuesPromises = attrIds.map((id: string) => getAttributeValues(id));
        const valuesRes = await Promise.all(valuesPromises);
        const allValues = valuesRes.flatMap((res) => res.data?.data || []);
        setAttributeValues(allValues);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        alert("Không thể tải dữ liệu. Vui lòng kiểm tra kết nối và thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const handleSelectAttribute = (
    productId: string,
    attributeId: string,
    valueId: string
  ) => {
    const updated = {
      ...selectedAttributes[productId],
      [attributeId]: valueId,
    };

    setSelectedAttributes((prev) => ({
      ...prev,
      [productId]: updated,
    }));

    const product = products.find((p) => p._id === productId);
    const matchedVariant = product?.variants?.find((variant: any) => {
      return variant.attributes.every(
        (attr: any) => updated[attr.attribute_id] === attr.value_id
      );
    });

    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: matchedVariant,
    }));
  };

  const handleAddToCart = (product: any) => {
    const selectedVariant = selectedVariants[product._id] || product.variants?.[0];
    if (product.variants?.length && !selectedVariant) {
      alert("Vui lòng chọn một biến thể!");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingIndex = cart.findIndex(
      (item: any) =>
        item._id === product._id &&
        (!item.variant || JSON.stringify(item.variant?.attributes) === JSON.stringify(selectedVariant?.attributes))
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        ...product,
        id: product._id,
        price: selectedVariant ? parsePrice(selectedVariant.price) : getDefaultPrice(product),
        image: selectedVariant ? selectedVariant.image || product.image : product.image,
        variant: selectedVariant || undefined,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Đã thêm sản phẩm vào giỏ hàng!");
    navigate("/cart");
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">🧸 Tất cả sản phẩm</h2>

        <ProductFilters onFilter={setFilters} />

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
          ) : (
            filteredProducts.map((product) => {
              const defaultPrice = getDefaultPrice(product);
              const selectedVariant = selectedVariants[product._id] || (product.variants?.length ? product.variants[0] : null);
              const displayedPrice = selectedVariant ? parsePrice(selectedVariant.price) : defaultPrice;

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100"
                >
                  {/* <img
                    src={selectedVariant?.image || product.image || "path/to/placeholder-image.jpg"}
                    alt={product.name}
                    className="w-full h-52 object-cover"
                  /> */}
                  <Link to={`/product/${product._id}`}>
                  {product.images ? (
                        <img src={product.images} alt={product.name} className="w-full h-52 object-cover" />
                      ) : (
                        <span className="text-gray-400 italic">Không có ảnh</span>
                      )}
                      </Link>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name || "Sản phẩm không tên"}</h3>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-rose-600 font-bold text-lg">{displayedPrice.toLocaleString()}₫</span>
                      {product.oldPrice && (
                        <span className="text-gray-400 line-through text-sm">
                          {parsePrice(product.oldPrice).toLocaleString()}₫
                        </span>
                      )}
                    </div>

                    {/* ✅ Hiển thị thuộc tính */}
                    {product.variants?.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {attributes.map((attr: any) => {
                          const valueIds = Array.from(
                            new Set(
                              product.variants
                                .flatMap((variant: any) =>
                                  variant.attributes
                                    .filter((a: any) => a.attribute_id === attr._id)
                                    .map((a: any) => a.value_id)
                                )
                            )
                          );

                          if (valueIds.length === 0) return null;

                          return (
                            <div key={attr._id}>                         
                              <div className="flex flex-wrap gap-2">
                                {valueIds.map((valueId) => (
                                  <button
                                    key={valueId}
                                    onClick={() => handleSelectAttribute(product._id, attr._id, valueId)}
                                    className={`px-3 py-1 rounded-full text-sm border transition ${
                                      selectedAttributes[product._id]?.[attr._id] === valueId
                                        ? "bg-rose-500 text-white border-rose-500"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                  >
                                    {getAttributeValue(valueId)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.variants?.length && !selectedVariants[product._id] && !product.variants[0]}
                      className="mt-4 w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium py-2 px-4 rounded-xl hover:brightness-110 transition disabled:bg-gray-400"
                    >
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AllProducts;
