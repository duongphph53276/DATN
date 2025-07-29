import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../../../api/product.api";
import { getAllAttributes, getAttributeValues } from "../../../../api/attribute.api";

// Định nghĩa kiểu dữ liệu
type Attribute = { _id: string; name: string };
type AttributeValue = { _id: string; attribute_id: string; value: string };
type Variant = {
  price: number | string | undefined;
  quantity: number;
  image?: string;
  attributes: Array<{ attribute_id: string; value_id: string }>;
};
type Product = {
  product: any;
  id: string;
  name: string;
  category: string;
  price?: string;
  oldPrice?: string;
  image?: string;
  images?: string;
  size?: string[];
  variants?: Variant[] ;
};

// Hàm chuyển chuỗi giá về số
const parsePrice = (value: string | number | undefined | null): number => {
  if (typeof value === "number") return value;
  if (!value || typeof value !== "string") return 0;
  return Number(value.replace(/[₫.,]/g, ""));
};

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<{[attributeId: string]: string;}>({});
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [attributeValues, setAttributeValues] = useState<AttributeValue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const productRes = await getProductById(id || "");
        console.log("Tên sản phẩm:", productRes.data?.data?.name);
        // Thử ánh xạ trực tiếp từ data
        setProduct(productRes.data?.data || null);

        const attrRes = await getAllAttributes();
        setAttributes(attrRes.data?.data || []);

        const attrIds = attrRes.data?.data?.map((attr: any) => attr._id) || [];
        const valuesPromises = attrIds.map((id: string) => getAttributeValues(id));
        const valuesRes = await Promise.all(valuesPromises);
        const allValues = valuesRes.flatMap((res) => res.data?.data || []);
        setAttributeValues(allValues);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu sản phẩm:", err);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau. Chi tiết: " + (err as any).message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Cập nhật selectedVariant khi product thay đổi
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      console.log("Variants available:", product.variants); // Debug variants
      setSelectedVariant(product.variants[0] || null);
    } else {
      console.log("No variants available or product is invalid:", product);
      setSelectedVariant(null);
    }
  }, [product]);

  useEffect(() => {
    console.log("Product state after set:", product); // Debug
    console.log("Selected Variant:", selectedVariant); // Debug
  }, [product, selectedVariant]);

  if (loading) {
    return <div className="text-center py-20 text-gray-500 text-xl">Đang tải...</div>;
  }

  if (error || !product) {
    return (
      <div className="text-center py-20 text-gray-500 text-xl">
        {error || "Không tìm thấy sản phẩm."}
      </div>
    );
  }

  // Hàm lấy tên thuộc tính
  const getAttributeName = (attributeId: string): string => {
    const attribute = attributes.find((attr) => attr._id === attributeId);
    return attribute?.name || attributeId;
  };

  // Hàm lấy giá trị thuộc tính
  const getAttributeValue = (valueId: string): string => {
    const value = attributeValues.find((val) => val._id === valueId);
    return value?.value || valueId;
  };

  // Tìm biến thể phù hợp dựa trên thuộc tính được chọn
  const getMatchingVariant = (variants?: Variant[]): Variant | null => {
    if (!variants) return null;
    return variants.find((variant) =>
      variant.attributes.every((attr) => selectedAttributes[attr.attribute_id] === attr.value_id)
    ) || variants[0] || null;
  };

  // Cập nhật biến thể khi chọn thuộc tính
  const handleSelectAttribute = (attributeId: string, valueId: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeId]: valueId,
    }));
    const matchedVariant = getMatchingVariant(product.variants);
    setSelectedVariant(matchedVariant);
    console.log("Selected Attributes:", selectedAttributes); // Debug
    console.log("Matched Variant:", matchedVariant); // Debug
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      image: selectedVariant?.image || product.image || product.images || "",
      price: selectedVariant ? parsePrice(selectedVariant.price) : parsePrice(product.variants?.[0]?.price) || 0,
      size: selectedAttributes["size"] ? getAttributeValue(selectedAttributes["size"]) : (product.size?.[0] || ""),
      quantity,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingIndex = existingCart.findIndex(
      (item: any) => item.id === cartItem.id && item.size === cartItem.size
    );

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += quantity;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    console.log("✅ Giỏ hàng mới:", existingCart);
    navigate("/cart");
  };

  const displayedPrice = selectedVariant
    ? parsePrice(selectedVariant.price)
    : parsePrice(product.variants?.[0]?.price) || 0;
  const benefits = [
    "100% bông trắng tinh khiết",
    "100% ảnh chụp tại shop",
    "Bảo hành đường chỉ trọn đời",
    "Bảo hành Bông gấu 6 tháng",
    "Miễn phí Gói quà",
    "Miễn phí Tặng thiệp",
    "Miễn phí Nén chân không gấu",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="relative group rounded-2xl overflow-hidden shadow-lg border border-gray-200">
        {selectedVariant?.image || product.image || product.images ? (
          <img
            src={selectedVariant?.image || product.image || product.images || "https://via.placeholder.com/420"}
            alt={product.name}
            className="w-full h-[420px] object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/420"; }}
          />
        ) : (
          <div className="w-full h-[420px] bg-gray-200 flex items-center justify-center text-gray-500">
            Không có ảnh
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center gap-6 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          {(product?.product?.name && product.product.name.trim()) || "Sản phẩm không tên"}
        </h1>

        <div className="flex justify-center md:justify-start items-center gap-4">
          <span className="text-3xl text-pink-500 font-semibold">
            {displayedPrice.toLocaleString()}₫
          </span>
          {product.oldPrice && (
            <span className="line-through text-gray-400 text-lg">
              {parsePrice(product.oldPrice).toLocaleString()}₫
            </span>
          )}
        </div>

        {/* Hiển thị các thuộc tính dưới dạng button */}
        {product.variants && product.variants.length > 0 && (
          <div className="mb-6">
            {attributes.map((attr) => {
              const valueIds = Array.from(
                new Set(
                  product.variants!
                    .flatMap((variant) =>
                      variant.attributes
                        .filter((a) => a.attribute_id === attr._id)
                        .map((a) => a.value_id)
                    )
                )
              );
              console.log("Attribute:", attr._id, "ValueIds:", valueIds); // Debug

              if (valueIds.length === 0) return null;

              return (
                <div key={attr._id} className="mb-4">
                  <h4 className="font-semibold mb-2 capitalize">
                    {getAttributeName(attr._id)}
                  </h4>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {valueIds.map((valueId) => (
                      <button
                        key={valueId}
                        onClick={() => handleSelectAttribute(attr._id, valueId)}
                        className={`px-4 py-1 text-sm rounded-full border transition ${selectedAttributes[attr._id] === valueId
                            ? "bg-pink-500 text-white border-pink-500"
                            : "bg-pink-100 text-pink-600 border-pink-300 hover:bg-pink-200"
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

        {/* Số lượng */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Số lượng:</h4>
          <div className="flex justify-center md:justify-start items-center gap-3">
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="w-8 h-8 rounded-full bg-gray-100 text-xl text-gray-600 hover:bg-gray-200 transition"
            >
              –
            </button>
            <span className="text-lg font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              className="w-8 h-8 rounded-full bg-gray-100 text-xl text-gray-600 hover:bg-gray-200 transition"
            >
              +
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm shadow-inner border">
          {benefits.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-gray-700">
              <span className="text-green-500">✔</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <p className="text-gray-600 leading-relaxed text-base mt-2">
          Gấu bông cao cấp mềm mịn, an toàn cho trẻ em. Thích hợp làm quà tặng sinh nhật, tình yêu
          hoặc trang trí trong phòng ngủ, góc học tập.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-4">
          <button
            onClick={handleAddToCart}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl border border-pink-400 px-6 py-3 text-pink-500 font-semibold hover:bg-pink-50 transition"
          >
            ➕ Thêm vào giỏ hàng
          </button>
          <button
            onClick={() => navigate("/checkout")}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-pink-400 to-rose-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:from-pink-500 hover:to-rose-600 focus:outline-none"
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;