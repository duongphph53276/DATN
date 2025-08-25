import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllProducts } from "../../../../../api/product.api";
import { getAllAttributes, getAttributeValues } from "../../../../../api/attribute.api";
import { ToastSucess, ToastError } from "../../../../utils/toast";
import { addToUserCart, loadUserCart } from "../../../../utils/cartUtils";

const parsePrice = (value: string | number | undefined | null): number => {
  if (typeof value === "number") return value;
  if (!value || typeof value !== "string") return 0;
  return Number(value.replace(/[₫.,]/g, ""));
};

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

const BestSelling: React.FC = () => {

  const [products, setProducts] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [attributeValues, setAttributeValues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: any | undefined }>({});
  const [selectedAttributes, setSelectedAttributes] = useState<{ [productId: string]: { [attributeId: string]: string } }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Lấy toàn bộ sản phẩm
        const productRes = await getAllProducts();
        const allProducts = productRes.data?.data || [];

        // Lọc bỏ sản phẩm disabled
        const activeProducts = allProducts.filter(
          (p: any) => p.status !== "disabled"
        );

        // Sort giảm dần theo total_sold
        const sortedProducts = [...activeProducts].sort(
          (a, b) => (b.total_sold || 0) - (a.total_sold || 0)
        );

        setProducts(sortedProducts);

        const attrRes = await getAllAttributes();
        setAttributes(attrRes.data?.data || []);

        const attrIds = attrRes.data?.data?.map((attr: any) => attr._id) || [];
        const valuesPromises = attrIds.map((id: string) => getAttributeValues(id));
        const valuesRes = await Promise.all(valuesPromises);
        const allValues = valuesRes.flatMap((res) => res.data?.data || []);
        setAttributeValues(allValues);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        ToastError("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Chỉ hiển thị 4 sản phẩm đầu tiên sau khi đã sort giảm dần
  const bestSellingProducts = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  const getAttributeName = (attributeId: string) =>
    attributes.find((attr) => attr._id === attributeId)?.name || attributeId;
  const getAttributeValue = (valueId: string) =>
    attributeValues.find((val) => val._id === valueId)?.value || valueId;
  const getDefaultPrice = (product: any): number =>
    product.variants?.length ? Math.min(...product.variants.map((v: any) => parsePrice(v.price))) : parsePrice(product.price);

  const getValidAttributeValues = (product: any, attributeId: string, selectedAttrs: { [key: string]: string }) => {
    const validValueIds = new Set<string>();
    product.variants.forEach((variant: any) => {
      const isValid = Object.entries(selectedAttrs)
        .filter(([key]) => key !== attributeId)
        .every(([key, value]) => variant.attributes.some((a: any) => a.attribute_id === key && a.value_id === value));
      if (isValid) {
        const currentAttr = variant.attributes.find((a: any) => a.attribute_id === attributeId);
        if (currentAttr) validValueIds.add(currentAttr.value_id);
      }
    });
    return Array.from(validValueIds);
  };

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

    // Lấy giỏ hàng theo user đúng cách
    const cart = loadUserCart();

    // Tìm sản phẩm đã có trong giỏ (đúng variant)
    const existingCartItem = cart.find((item: any) => {
      if (selectedVariant) {
        return item._id === product._id && item.variant?._id === selectedVariant._id;
      }
      return item._id === product._id && !item.variant;
    });

    const existingQuantity = existingCartItem ? existingCartItem.quantity : 0;

    // Lấy số lượng tồn kho đúng
    const stockQuantity = selectedVariant
      ? selectedVariant.stock_quantity ?? selectedVariant.quantity ?? 0
      : product.stock_quantity ?? product.quantity ?? 0;

    if (existingQuantity + 1 > stockQuantity) {
      ToastError("Số lượng trong kho không đủ để thêm sản phẩm này!");
      return;
    }

    const variantAttributes = selectedVariant
      ? Object.entries(productAttributes)
        .map(([attrId, valueId]) => `${getAttributeName(attrId)}: ${getAttributeValue(valueId)}`)
        .join(", ")
      : "Không có thuộc tính";

    const cartItem = {
      ...product,
      id: product._id,
      _id: product._id,
      price: selectedVariant ? parsePrice(selectedVariant.price) : getDefaultPrice(product),
      image: selectedVariant ? selectedVariant.image || product.images : product.images,
      variant: selectedVariant
        ? {
          _id: selectedVariant._id,
          product_id: selectedVariant.product_id,
          price: selectedVariant.price,
          attributes: selectedVariant.attributes,
          stock_quantity: stockQuantity,
        }
        : undefined,
      variantAttributes,
      quantity: 1,
    };

    addToUserCart(cartItem);
    ToastSucess("Đã thêm sản phẩm vào giỏ hàng!");
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500" aria-live="polite">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <section className="py-10 bg-white">
        <h2 className="text-center text-rose-500 font-bold text-3xl mb-6">SẢN PHẨM BÁN CHẠY</h2>
        <div className="flex flex-wrap justify-center gap-6 px-4">
          {bestSellingProducts.length === 0 ? (
            <p className="text-center text-gray-500" aria-live="polite">
              Không tìm thấy sản phẩm bán chạy.
            </p>
          ) : (
            bestSellingProducts.map((product) => {
              const defaultPrice = getDefaultPrice(product);
              const selectedVariant = selectedVariants[product._id];
              const displayedPrice = selectedVariant ? parsePrice(selectedVariant.price) : defaultPrice;

              return (
                <div
                  key={product._id}
                  className="w-[250px] bg-white p-4 rounded-xl shadow hover:shadow-lg text-center flex flex-col"
                >
                  <Link to={`/product/${product._id}`}>
                    {product.images ? (
                      <img
                        src={selectedVariant?.image || product.images}
                        alt={product.name}
                        className="w-full h-[220px] object-cover rounded-lg mb-4"
                      />
                    ) : (
                      <div className="w-full h-[220px] bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-gray-400">Không có ảnh</span>
                      </div>
                    )}
                  </Link>

                  <h3 className="text-base font-semibold">{product.name}</h3>

                  <div className="text-rose-500 font-bold mt-2">{displayedPrice.toLocaleString()}₫</div>

                  {product.variants?.length > 0 && (
                    <div className="mt-1 space-y-3">
                      {attributes.map((attr: any) => {
                        const valueIds = getValidAttributeValues(product, attr._id, selectedAttributes[product._id] || {});
                        if (valueIds.length === 0) return null;
                        return (
                          <div key={attr._id} className="flex flex-wrap justify-center gap-2 my-2">
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
                        );
                      })}
                    </div>
                  )}

                  {/* Spacer để đẩy nút xuống đáy */}
                  <div className="flex-grow" />

                  {(() => {
                    const selectedVariant = selectedVariants[product._id];
                    
                    // Logic for determining if product is out of stock
                    let isOutOfStock = false;
                    
                    if (product.variants && product.variants.length > 0) {
                      // Product has variants
                      if (selectedVariant) {
                        // A specific variant is selected - check its quantity
                        isOutOfStock = (selectedVariant.stock_quantity ?? selectedVariant.quantity ?? 0) === 0;
                      } else {
                        // No variant selected - check if ALL variants are out of stock
                        isOutOfStock = product.variants.every((variant: any) => 
                          (variant.stock_quantity ?? variant.quantity ?? 0) === 0
                        );
                      }
                    } else {
                      // Product has no variants - check product quantity
                      isOutOfStock = (product.stock_quantity ?? product.quantity ?? 0) === 0;
                    }
                    
                    return isOutOfStock ? (
                      <button
                        disabled
                        className="mt-2 w-full bg-gray-400 text-white font-medium py-2 px-4 rounded-xl cursor-not-allowed"
                      >
                        🚫 Hết hàng
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="mt-2 w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium py-2 px-4 rounded-xl hover:brightness-110 transition"
                      >
                        Thêm vào giỏ hàng
                      </button>
                    );
                  })()}
                </div>
              );
            })
          )}
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default BestSelling;
