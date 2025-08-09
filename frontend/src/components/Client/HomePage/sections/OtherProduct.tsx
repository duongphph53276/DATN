import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllProducts } from "../../../../../api/product.api";
import { getAllAttributes, getAttributeValues } from "../../../../../api/attribute.api";
import { ToastSucess, ToastError } from "../../../../utils/toast";

interface Product {
  _id: string;
  name: string;
  price: string | number;
  image?: string;
  images?: string;
  sold_quantity: number;
  status?: "active" | "disabled" | "new" | "bestseller";
  variants: Variant[];
}

interface Variant {
  _id: string;
  price: string | number;
  image?: string;
  attributes: { attribute_id: string; value_id: string }[];
}

interface Attribute {
  _id: string;
  name: string;
}

interface AttributeValue {
  _id: string;
  value: string;
  attribute_id: string;
}

const parsePrice = (value: string | number | undefined | null): number => {
  if (typeof value === "number") return value;
  if (!value || typeof value !== "string") return 0;
  return Number(value.replace(/[₫.,]/g, ""));
};

const OtherProduct: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [attributeValues, setAttributeValues] = useState<AttributeValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: Variant | undefined }>({});
  const [selectedAttributes, setSelectedAttributes] = useState<{ [productId: string]: { [attributeId: string]: string } }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productRes = await getAllProducts();
        setProducts(productRes.data?.data || []);

        const attrRes = await getAllAttributes();
        setAttributes(attrRes.data?.data || []);

        const attrIds = attrRes.data?.data?.map((attr: Attribute) => attr._id) || [];
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

  // Lấy ngẫu nhiên 8 sản phẩm
  const randomProducts = useMemo(() => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, [products]);

  const getAttributeName = (attributeId: string) => {
    const attribute = attributes.find((attr) => attr._id === attributeId);
    return attribute?.name || attributeId;
  };

  const getAttributeValue = (valueId: string) => {
    const value = attributeValues.find((val) => val._id === valueId);
    return value?.value || valueId;
  };

  const getDefaultPrice = (product: Product): number => {
    if (product.variants?.length) {
      const prices = product.variants.map((v) => parsePrice(v.price)).filter((p) => !isNaN(p));
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
      const matchedVariant = product?.variants?.find((variant) =>
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

  const handleAddToCart = (product: Product) => {
    const selectedVariant = selectedVariants[product._id];
    const productAttributes = selectedAttributes[product._id] || {};

    const requiredAttributes = attributes.filter((attr) =>
      product.variants.some((variant) => variant.attributes.some((a) => a.attribute_id === attr._id))
    );
    if (product.variants.length && (!selectedVariant || !requiredAttributes.every((attr) => productAttributes[attr._id]))) {
      ToastError("Vui lòng chọn đầy đủ các thuộc tính của sản phẩm!");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]") as any[];
    const variantAttributes = selectedVariant
      ? Object.entries(productAttributes)
          .map(([attrId, valueId]) => `${getAttributeName(attrId)}: ${getAttributeValue(valueId)}`)
          .join(", ")
      : "No attributes";

    const cartItem = {
      _id: product._id,
      name: product.name,
      price: selectedVariant ? parsePrice(selectedVariant.price) : getDefaultPrice(product),
      image: selectedVariant?.image || product.image || product.images,
      variant: selectedVariant,
      variantAttributes,
      quantity: 1,
    };

    const existingIndex = cart.findIndex(
      (item) =>
        item._id === product._id &&
        JSON.stringify(item.variant?.attributes?.map((a: any) => [a.attribute_id, a.value_id]).sort()) ===
          JSON.stringify(selectedVariant?.attributes?.map((a: any) => [a.attribute_id, a.value_id]).sort())
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    ToastSucess("Đã thêm sản phẩm vào giỏ hàng!");
  };

  const getValidAttributeValues = (product: Product, attributeId: string, selectedAttributes: { [key: string]: string }) => {
    const validValueIds = new Set<string>();

    product.variants.forEach((variant) => {
      const variantAttributes = variant.attributes;
      const isValidVariant = Object.entries(selectedAttributes)
        .filter(([key]) => key !== attributeId)
        .every(([key, value]) => {
          const variantAttr = variantAttributes.find((a) => a.attribute_id === key);
          return variantAttr && variantAttr.value_id === value;
        });

      if (isValidVariant) {
        const currentAttr = variantAttributes.find((a) => a.attribute_id === attributeId);
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
      <div className="flex flex-wrap justify-center gap-6 px-4">
        {randomProducts.length === 0 ? (
          <p className="text-center text-gray-500" aria-live="polite">
            Không tìm thấy sản phẩm khác.
          </p>
        ) : (
          randomProducts.map((product) => {
            const defaultPrice = getDefaultPrice(product);
            const selectedVariant = selectedVariants[product._id];
            const displayedPrice = selectedVariant ? parsePrice(selectedVariant.price) : defaultPrice;

            return (
              <div
                key={product._id}
                className="w-[250px] bg-white p-4 rounded-xl shadow hover:shadow-lg text-center flex flex-col"
              >
                <Link to={`/product/${product._id}`}>
                  {product.images || selectedVariant?.image ? (
                    <img
                      src={selectedVariant?.image || product.images}
                      alt={product.name}
                      className="w-full h-[220px] object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <span className="text-gray-400 italic">Không có ảnh</span>
                  )}
                  <h3 className="text-base font-semibold">{product.name || "Sản phẩm không tên"}</h3>
                </Link>

                <div className="text-rose-500 font-bold mt-2">{displayedPrice.toLocaleString()}₫</div>
                {product.variants?.length > 0 && (
                  <div className="mt-1 space-y-3">
                    {attributes.map((attr) => {
                      const valueIds = getValidAttributeValues(product, attr._id, selectedAttributes[product._id] || {});
                      if (valueIds.length === 0) return null;

                      return (
                        <div key={attr._id}>
                          <div className="flex flex-wrap justify-center gap-2 my-2">
                            {valueIds.map((valueId) => (
                              <button
                                key={valueId}
                                onClick={() => handleSelectAttribute(product._id, attr._id, valueId)}
                                className={`text-sm px-3 py-1 rounded-full border transition ${
                                  selectedAttributes[product._id]?.[attr._id] === valueId
                                    ? "bg-rose-500 text-white border-rose-500"
                                    : "bg-pink-100 text-rose-500 hover:bg-rose-200"
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

                <div className="flex-grow" />

                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-4 w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium py-2 px-4 rounded-xl hover:brightness-110 transition"
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default OtherProduct;
