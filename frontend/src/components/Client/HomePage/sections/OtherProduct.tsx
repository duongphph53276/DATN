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

const OtherProduct: React.FC = () => {

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
        const productRes = await getAllProducts();
        const allProducts = productRes.data?.data || [];

        // Lọc bỏ sản phẩm disabled
        const activeProducts = allProducts.filter(
          (p: any) => p.status !== "disabled"
        );
        setProducts(activeProducts);

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

  // Lấy ngẫu nhiên 16 sản phẩm
  const randomProducts = useMemo(() => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 16);
  }, [products]);

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
      const prices = product.variants.map((v: any) => parsePrice(v.price)).filter((p: any) => !isNaN(p));
      return prices.length ? Math.min(...prices) : 0;
    }
    return parsePrice(product.price);
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
      const matchedVariant = product?.variants?.find((variant: { attributes: any[]; }) =>
        variant.attributes.every((attr) => updatedAttributes[attr.attribute_id] === attr.value_id)
      );

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

    if (product.variants?.length && !selectedVariant) {
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

    product.variants.forEach((variant: { attributes: any; }) => {
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

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500" aria-live="polite">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <section className="py-10 bg-white">
      <h2 className="text-center text-rose-500 font-bold text-3xl mb-6">SẢN PHẨM KHÁC</h2>
      <div className="max-w-7xl mx-auto px-4">
        {randomProducts.length === 0 ? (
          <p className="text-center text-gray-500" aria-live="polite">
            Không tìm thấy sản phẩm khác.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {randomProducts.map((product) => {
              const defaultPrice = getDefaultPrice(product);
              const selectedVariant = selectedVariants[product._id];
              const displayedPrice = selectedVariant ? parsePrice(selectedVariant.price) : defaultPrice;

              return (
                <div
                  key={product._id}
                  className="bg-white p-4 rounded-xl shadow hover:shadow-lg text-center flex flex-col"
                >
                  <Link to={`/product/${product._id}`}>
                    {product.images || selectedVariant?.image ? (
                      <img
                        src={selectedVariant?.image || product.images}
                        alt={product.name}
                        className="w-full h-[200px] object-cover rounded-lg mb-4"
                      />
                    ) : (
                      <div className="w-full h-[200px] bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Không có ảnh</span>
                      </div>
                    )}
                    <h3 className="text-base font-semibold truncate">{product.name || "Sản phẩm không tên"}</h3>
                  </Link>

                  <div className="text-rose-500 font-bold mt-2">{displayedPrice.toLocaleString()}₫</div>
                  
                  {product.variants?.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {attributes.map((attr) => {
                        const valueIds = getValidAttributeValues(product, attr._id, selectedAttributes[product._id] || {});
                        if (valueIds.length === 0) return null;

                        return (
                          <div key={attr._id}>
                            <div className="flex flex-wrap justify-center gap-1">
                              {valueIds.slice(0, 3).map((valueId) => (
                                <button
                                  key={valueId}
                                  onClick={() => handleSelectAttribute(product._id, attr._id, valueId)}
                                  className={`text-xs px-2 py-1 rounded-full border transition ${selectedAttributes[product._id]?.[attr._id] === valueId
                                    ? "bg-rose-500 text-white border-rose-500"
                                    : "bg-pink-100 text-rose-500 hover:bg-rose-200"
                                    }`}
                                >
                                  {getAttributeValue(valueId)}
                                </button>
                              ))}
                              {valueIds.length > 3 && (
                                <span className="text-xs text-gray-500 px-2 py-1">+{valueIds.length - 3}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex-grow" />

                  {(() => {
                    const selectedVariant = selectedVariants[product._id];
                    
                    // Logic for determining if product is out of stock
                    let isOutOfStock = false;
                    
                    if (product.variants && product.variants.length > 0) {
                      // Product has variants
                      if (selectedVariant) {
                        // A specific variant is selected - check its quantity
                        isOutOfStock = (selectedVariant.quantity ?? selectedVariant.stock_quantity ?? 0) === 0;
                      } else {
                        // No variant selected - check if ALL variants are out of stock
                        isOutOfStock = product.variants.every((variant: any) => 
                          (variant.quantity ?? variant.stock_quantity ?? 0) === 0
                        );
                      }
                    } else {
                      // Product has no variants - check product quantity
                      isOutOfStock = (product.quantity ?? product.stock_quantity ?? 0) === 0;
                    }
                    
                    return isOutOfStock ? (
                      <button
                        disabled
                        className="mt-3 w-full bg-gray-400 text-white font-medium py-2 px-4 rounded-xl cursor-not-allowed text-sm"
                      >
                        🚫 Hết hàng
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="mt-3 w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium py-2 px-4 rounded-xl hover:brightness-110 transition text-sm"
                      >
                        Thêm vào giỏ hàng
                      </button>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default OtherProduct;