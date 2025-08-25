import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../../../api/product.api";
import { getAllAttributes, getAttributeValues } from "../../../../api/attribute.api";
import ReactStars from "react-stars";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastSucess, ToastError } from "../../../utils/toast";
import { addToUserCart, loadUserCart, updateCartItemQuantity } from "../../../utils/cartUtils";  // Thêm import updateCartItemQuantity

// Import CartItem interface
interface CartItem {
  id: string;
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: any;
  variantAttributes?: string;
}


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

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<{ [attributeId: string]: string }>({});
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [tempQuantity, setTempQuantity] = useState<string>("1");
  const [existingQuantity, setExistingQuantity] = useState<number>(0);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [attributeValues, setAttributeValues] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userReview, setUserReview] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Đang lấy sản phẩm với ID:", id);
        if (!id) {
          setError("Không tìm thấy ID sản phẩm.");
          setLoading(false);
          return;
        }
        const productRes = await getProductById(id);
        console.log("Phản hồi sản phẩm:", productRes.data);
        const fetchedProduct = productRes.data?.data;
        if (fetchedProduct) {
          setProduct({
            ...fetchedProduct.product,
            name: fetchedProduct.product.name || fetchedProduct.product?.name || "Sản phẩm không tên",
            description: fetchedProduct.product.description || fetchedProduct.product?.description || "Sản phẩm không có mô tả",
            images: fetchedProduct.product.images || fetchedProduct.product.image || fetchedProduct.images,
            variants: fetchedProduct.variants || [],
            average_rating: fetchedProduct.product.average_rating || 0,
            review_count: fetchedProduct.product.review_count || 0,
            album: fetchedProduct.product.album || [],
          });
        } else {
          setError("Không tìm thấy sản phẩm từ API.");
        }

        const attrRes = await getAllAttributes();
        console.log("Phản hồi thuộc tính:", attrRes.data);
        setAttributes(attrRes.data?.data || []);

        const attrIds = attrRes.data?.data?.map((attr: any) => attr._id) || [];
        const valuesPromises = attrIds.map((id: string) => getAttributeValues(id));
        const valuesRes = await Promise.all(valuesPromises);
        console.log("Phản hồi giá trị thuộc tính:", valuesRes);
        const allValues = valuesRes.flatMap((res) => res.data?.data || []);
        setAttributeValues(allValues);

        // Kiểm tra giỏ hàng để lấy số lượng và biến thể đã chọn
        const cart = loadUserCart();
        const cartItem = cart.find(
          (item: CartItem) =>
            item.id === id &&
            item.variant?.attributes.every((attr: any) =>
              fetchedProduct.variants.some((v: any) =>
                v.attributes.some(
                  (va: any) => va.attribute_id === attr.attribute_id && va.value_id === attr.value_id
                )
              )
            )
        );

        if (cartItem) {
          // Cập nhật số lượng
          setExistingQuantity(cartItem.quantity);

          // Cập nhật thuộc tính đã chọn
          const selectedAttrs: { [key: string]: string } = {};
          if (cartItem.variant?.attributes) {
            cartItem.variant.attributes.forEach((attr: any) => {
              selectedAttrs[attr.attribute_id] = attr.value_id;
            });
            setSelectedAttributes(selectedAttrs);

            // Cập nhật biến thể đã chọn
            const matchedVariant = fetchedProduct.variants.find((variant: any) =>
              variant.attributes.every(
                (attr: any) => selectedAttrs[attr.attribute_id] === attr.value_id
              )
            );
            setSelectedVariant(matchedVariant || null);
          }
        }

        const token = localStorage.getItem("token");
        console.log(token);
        if (token) {
          const decoded: any = jwtDecode(token);
          setUserId(decoded.user_id || decoded.id);
          try {
            const reviewRes = await axios.get(`http://localhost:5000/reviews/user/product/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (reviewRes.data && reviewRes.data.data && reviewRes.data.data.rating) {
              setUserReview(reviewRes.data.data.rating);
              setRating(reviewRes.data.data.rating);
            }
          } catch (err) {
            console.error("Lỗi khi lấy đánh giá cũ:", err);
          }
        }
      } catch (err) {
        console.error("Lỗi chi tiết:", err);
        setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!product) return;

    const cart = loadUserCart();
    let cartItem = null;
    if (selectedVariant) {
      cartItem = cart.find(
        (item: CartItem) => item.id === product._id && item.variant?._id === selectedVariant._id
      );
    } else {
      cartItem = cart.find(
        (item: CartItem) => item.id === product._id && !item.variant
      );
    }
    const newExisting = cartItem?.quantity || 0;
    setExistingQuantity(newExisting);
  }, [selectedVariant, product]);

  useEffect(() => {
    const handleCartUpdated = () => {
      const cart = loadUserCart();
      const cartItem = cart.find(
        (item: CartItem) =>
          item.id === id &&
          item.variant?.attributes.every((attr: any) =>
            product?.variants.some((v: any) =>
              v.attributes.some(
                (va: any) => va.attribute_id === attr.attribute_id && va.value_id === attr.value_id
              )
            )
          )
      );

      if (cartItem) {
        setExistingQuantity(cartItem.quantity);
        const selectedAttrs: { [key: string]: string } = {};
        if (cartItem.variant?.attributes) {
          cartItem.variant.attributes.forEach((attr: any) => {
            selectedAttrs[attr.attribute_id] = attr.value_id;
          });
          setSelectedAttributes(selectedAttrs);

          const matchedVariant = product?.variants.find((variant: any) =>
            variant.attributes.every(
              (attr: any) => selectedAttrs[attr.attribute_id] === attr.value_id
            )
          );
          setSelectedVariant(matchedVariant || null);
        }
      } else {
        setExistingQuantity(0);
        setSelectedAttributes({});
        setSelectedVariant(null);
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, [id, product]);

  const getAttributeName = (attributeId: string): string => {
    const attribute = attributes.find((attr: any) => attr._id === attributeId);
    return attribute?.name || attributeId;
  };

  const getAttributeValue = (valueId: string): string => {
    const value = attributeValues.find((val: any) => val._id === valueId);
    return value?.value || valueId;
  };

  const getValidAttributeValues = (product: any, attributeId: string, selectedAttributes: { [key: string]: string }) => {
    const validValueIds = new Set<string>();
    product?.variants?.forEach((variant: any) => {
      const variantAttributes = variant.attributes;
      const isValidVariant = Object.entries(selectedAttributes)
        .filter(([key]) => key !== attributeId)
        .every(([key, value]) => {
          const variantAttr = variantAttributes.find((a: any) => a.attribute_id === key);
          return variantAttr && variantAttr.value_id === value;
        });
      if (isValidVariant) {
        const currentAttr = variantAttributes.find((a: any) => a.attribute_id === attributeId);
        if (currentAttr) validValueIds.add(currentAttr.value_id);
      }
    });
    return Array.from(validValueIds);
  };

  const handleSelectAttribute = (attributeId: string, valueId: string) => {
    setSelectedAttributes((prev) => {
      const currentAttributes = { ...prev };
      if (currentAttributes[attributeId] === valueId) {
        delete currentAttributes[attributeId];
      } else {
        currentAttributes[attributeId] = valueId;
      }
      const matchedVariant = product?.variants?.find((variant: any) =>
        variant.attributes.every((attr: any) => currentAttributes[attr.attribute_id] === attr.value_id)
      );
      setSelectedVariant(matchedVariant || null);
      return currentAttributes;
    });
  };

  const getDefaultPrice = (product: any): number => {
    if (product?.variants?.length) {
      return Math.min(...product.variants.map((v: any) => parsePrice(v.price)));
    }
    return parsePrice(product?.price);
  };

  const increaseQty = () => {
    const stockQty = selectedVariant ? selectedVariant.quantity : product.quantity || 0;
    const maxAdd = stockQty - existingQuantity;
    if (quantity + 1 > maxAdd) {
      ToastError(`Chỉ còn ${stockQty} sản phẩm trong kho!`);
      return;
    }
    setQuantity(quantity + 1);
    setTempQuantity((quantity + 1).toString());
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setTempQuantity((quantity - 1).toString());
    }
  };

  const handleQuantityChange = (newQty: string) => {
    const qty = parseInt(newQty, 10);
    const stockQty = selectedVariant ? selectedVariant.quantity : product.quantity || 0;
    const maxAdd = stockQty - existingQuantity;
    if (isNaN(qty) || qty < 1) {
      ToastError("Số lượng phải là số nguyên dương!");
      setTempQuantity(quantity.toString());
      return;
    }
    if (qty > maxAdd) {
      ToastError(`Chỉ còn ${stockQty} sản phẩm trong kho!`);
      setTempQuantity(quantity.toString());
      return;
    }
    setQuantity(qty);
    setTempQuantity(qty.toString());
  };

  const handleAddToCart = async () => {
    if (!product) return;

    // Kiểm tra thuộc tính
    if (product.variants?.length) {
      const requiredAttributes = attributes.filter((attr: any) =>
        product.variants.some((variant: any) =>
          variant.attributes.some((a: any) => a.attribute_id === attr._id)
        )
      );
      const allAttributesSelected = requiredAttributes.every(
        (attr: any) => selectedAttributes[attr._id]
      );
      if (product.variants?.length && !selectedVariant) {
        ToastError("Vui lòng chọn đầy đủ các thuộc tính của sản phẩm!");
        return;
      }
      if (selectedVariant.quantity === 0) {
        ToastError("Sản phẩm này đã hết hàng!");
        return;
      }
    } else {
      if (product.quantity === 0) {
        ToastError("Sản phẩm này đã hết hàng!");
        return;
      }
    }

    // Kiểm tra số lượng với tồn kho
    const stockQty = selectedVariant ? selectedVariant.quantity : product.quantity;
    const newQty = existingQuantity + quantity;
    if (newQty > stockQty) {
      ToastError(`Chỉ còn ${stockQty} sản phẩm trong kho!`);
      return;
    }

    if (existingQuantity > 0) {
      // Cập nhật số lượng nếu đã có trong giỏ
      updateCartItemQuantity(product._id, selectedVariant, newQty);
      ToastSucess("Đã thêm sản phẩm vào giỏ hàng!");
    } else {
      // Thêm mới nếu chưa có
      const variantAttributes = selectedVariant
        ? Object.entries(selectedAttributes)
          .map(([attrId, valueId]) => `${getAttributeName(attrId)}: ${getAttributeValue(valueId)}`)
          .join(", ")
        : "Không có thuộc tính";

      const newCartItem = {
        id: product._id || id,
        _id: product._id || id,
        name: product.name || "Sản phẩm không tên",
        image: selectedVariant?.image || product.images || product.image || "https://via.placeholder.com/420",
        price: selectedVariant ? parsePrice(selectedVariant.price) : getDefaultPrice(product),
        variant: selectedVariant
          ? {
            _id: selectedVariant._id,
            product_id: selectedVariant.product_id,
            price: selectedVariant.price,
            quantity: selectedVariant.quantity,
            attributes: selectedVariant.attributes.map((attr: any) => ({
              attribute_id: attr.attribute_id,
              value_id: attr.value_id,
            })),
          }
          : undefined,
        variantAttributes,
        quantity,
      };

      addToUserCart(newCartItem);
      ToastSucess("Đã thêm sản phẩm vào giỏ hàng!");
    }
  };

  const handleReviewSubmit = async () => {
    if (!rating) {
      setReviewMessage("Vui lòng chọn số sao để đánh giá!");
      return;
    }
    if (!userId) {
      setReviewMessage("Vui lòng đăng nhập để gửi đánh giá!");
      return;
    }

    const token = localStorage.getItem("token");
    console.log('Gửi yêu cầu đánh giá: product_id =', id, 'rating =', rating, 'token =', token); // id là product_id
    try {
      const response = await axios.post("http://localhost:5000/reviews", { product_id: id, rating }, { headers: { Authorization: `Bearer ${token}` } });
      ToastSucess("Đánh giá thành công!")
      console.log('Phản hồi thành công:', response.data);
    } catch (error) {
      setReviewMessage("Bạn phải mua sản phẩm mới được đanh giá!");
      if (axios.isAxiosError(error)) {
        setReviewMessage(error.response?.data?.message || "Lỗi khi gửi đánh giá. Vui lòng thử lại!");
      } else {
        setReviewMessage("Lỗi không xác định!");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500 text-xl">Đang tải...</div>;
  }

  if (error || !product) {
    return (
      <div className="text-center py-20 text-gray-500 text-xl">
        {error || "Không tìm thấy sản phẩm."}{" "}
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
          Tải lại
        </button>
      </div>
    );
  }

  const displayedPrice = selectedVariant ? parsePrice(selectedVariant.price) : getDefaultPrice(product);
  const stockQty = selectedVariant ? selectedVariant.quantity : product.quantity || 0;
  const maxAdd = stockQty - existingQuantity;

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
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb danh mục */}
        {product.category_id && (
          <div className="mb-6 flex items-center justify-center md:justify-start gap-2 text-sm">
            <button
              onClick={() => navigate('/')}
              className="text-purple-600 hover:text-purple-800 transition-colors font-medium"
            >
              Trang chủ
            </button>
            <span className="text-gray-400">›</span>
            {product.category_id.parent_id && (
              <>
                <button
                  onClick={() => navigate(`/category/${product.category_id.parent_id.slug}`)}
                  className="text-purple-600 hover:text-purple-800 transition-colors font-medium"
                >
                  {product.category_id.parent_id.name}
                </button>
                <span className="text-gray-400">›</span>
              </>
            )}
            <button
              onClick={() => navigate(`/category/${product.category_id.slug}`)}
              className="text-purple-600 hover:text-purple-800 transition-colors font-medium"
            >
              {product.category_id.name}
            </button>
            <span className="text-gray-400">›</span>
            <span className="text-gray-700 font-medium">
              {product.name}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-white">
            {/* Ảnh chính */}
            <div className="relative w-full h-[420px] bg-gray-100">
              {product.images || selectedVariant?.image || product.image ? (
                <img
                  src={selectedVariant?.image || product.images || product.image || "https://via.placeholder.com/420"}
                  alt={product.name || "Sản phẩm không tên"}
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-500 ease-in-out hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/420";
                  }}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-200 rounded-2xl">
                  Không có ảnh
                </div>
              )}
            </div>
            {/* Album ảnh phụ */}
            {product.album && product.album.length > 0 && (
              <div className="flex justify-center gap-3 mt-4 px-4 pb-4">
                {product.album.slice(0, 5).map((image: string, index: number) => (
                  <div
                    key={index}
                    className={`relative w-32 h-24 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-300 ${(selectedVariant?.image || product.images) === image
                      ? "border-pink-500 shadow-lg scale-105"
                      : "border-gray-200 hover:border-pink-300 hover:shadow-md"
                      }`}
                    onClick={() => {
                      setProduct((prev: any) => ({ ...prev, images: image }));
                    }}
                  >
                    <img
                      src={image || "https://via.placeholder.com/100"}
                      alt={`Ảnh phụ ${index + 1} của ${product.name || "sản phẩm"}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/100";
                      }}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center gap-6 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{product.name && product.name.trim() ? product.name : "Sản phẩm không tên"}</h1>

            <div className="flex justify-center md:justify-start items-center gap-4">
              <span className="text-3xl text-pink-500 font-semibold">{displayedPrice.toLocaleString()}₫</span>
              {product.oldPrice && <span className="line-through text-gray-400 text-lg">{parsePrice(product.oldPrice).toLocaleString()}₫</span>}
            </div>
            <div className="text-sm text-gray-600">Tổng đã bán: {Array.isArray(product.variants) && product.variants.length > 0
              ? product.variants.reduce((sum: number, v: any) => sum + (v.sold_quantity || 0), 0)
              : (product.total_sold || 0)} sản phẩm
              <span className="text-gray-600 text-sm ml-5 ">Đánh giá trung bình:{product.average_rating}/5</span>
              <span className="text-gray-600 text-sm ml-5 ">Mã sản phẩm:  {product.sku}</span>
            </div>

            {product.variants?.length > 0 && (
              <div className="mb-1">
                {attributes.map((attr: any) => {
                  const valueIds = getValidAttributeValues(product, attr._id, selectedAttributes);
                  if (valueIds.length === 0) return null;
                  return (
                    <div key={attr._id} className="mb-1">
                      <h4 className="font-semibold mb-1 capitalize">{getAttributeName(attr._id)}</h4>
                      <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        {valueIds.map((valueId: string) => (
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

            <div className="mb-2">
              <h4 className="font-medium mb-2">Số lượng:</h4>
              <div className="flex justify-center md:justify-start items-center gap-3">
                <button
                  onClick={decreaseQty}
                  className="w-8 h-8 rounded-full bg-gray-100 text-xl text-gray-600 hover:bg-gray-200 transition"
                >
                  –
                </button>
                <input
                  type="number"
                  min="1"
                  max={maxAdd}
                  value={tempQuantity}
                  onChange={(e) => setTempQuantity(e.target.value)}
                  onBlur={() => handleQuantityChange(tempQuantity)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                  className="w-16 text-center border rounded-lg text-base font-medium focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <button
                  onClick={increaseQty}
                  className="w-8 h-8 rounded-full bg-gray-100 text-xl text-gray-600 hover:bg-gray-200 transition"
                >
                  +
                </button>
              </div>

              {/* Hiển thị số lượng tồn kho */}
              <div className="mt-2 text-sm text-gray-600">
                {existingQuantity > 0 && (
                  <div>
                    <span className="font-medium text-blue-600 mr-2 ">
                      Đã có trong giỏ: {existingQuantity} sản phẩm
                    </span>
                  </div>
                )}
                {product.variants?.length > 0 ? (
                  selectedVariant ? (
                    <span className={`font-medium ${selectedVariant.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Còn lại: {selectedVariant.quantity} sản phẩm trong kho
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      Vui lòng chọn thuộc tính để xem số lượng tồn kho
                    </span>
                  )
                ) : (
                  <span className={`font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Còn lại: {product.quantity || 0} sản phẩm trong kho
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              {(() => {
                // Logic for determining if product is out of stock
                let isOutOfStock = false;
                
                if (product.variants && product.variants.length > 0) {
                  // Product has variants
                  if (selectedVariant) {
                    // A specific variant is selected - check its quantity
                    isOutOfStock = selectedVariant.quantity === 0;
                  } else {
                    // No variant selected - check if ALL variants are out of stock
                    isOutOfStock = product.variants.every((variant: any) => variant.quantity === 0);
                  }
                } else {
                  // Product has no variants - check product quantity
                  isOutOfStock = product.quantity === 0;
                }
                
                return isOutOfStock ? (
                  <button
                    disabled
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl border border-gray-400 px-6 py-3 text-gray-500 font-semibold bg-gray-100 cursor-not-allowed"
                  >
                    🚫 Hết hàng
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl border border-pink-400 px-6 py-3 text-pink-500 font-semibold hover:bg-pink-50 transition"
                  >
                    ➕ Thêm vào giỏ hàng
                  </button>
                );
              })()}
            </div>
            <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm shadow-inner border">
              {benefits.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-500">✔</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-1 md:col-span-2">
          <div className="mt-12 p-12 bg-white border-2 border-gray-300 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-300">
            <h3 className="text-xl font-extrabold text-gray-800 mb-8 text-center border-b-4 border-pink-600 pb-6">
              Mô tả sản phẩm
            </h3>
            <div
              className="text-xl text-gray-700 leading-relaxed text-center max-w-5xl mx-auto"
              dangerouslySetInnerHTML={{
                __html:
                  product.description && product.description.trim()
                    ? product.description
                    : "Sản phẩm không có mô tả",
              }}
            />
          </div>

          <div className="mt-16 p-12 bg-gradient-to-br from-pink-50 to-white border-2 border-pink-300 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300">
            <h3 className="text-xl font-extrabold text-gray-800 mb-8 text-center border-b-4 border-pink-300 pb-6">Đánh giá sản phẩm</h3>
            <div className="space-y-10 text-center">
              {userReview !== null && (
                <div className="text-xl text-gray-700 bg-gray-100 p-6 rounded-xl mx-auto max-w-4xl">
                  Bạn đã đánh giá: {"⭐".repeat(userReview)} <span className="font-semibold">{userReview}/5</span>
                  <p className="text-lg mt-3">Nếu bạn muốn, hãy cập nhật đánh giá của mình.</p>
                </div>
              )}
              <div>
                <label className="block text-2xl font-semibold text-gray-700 mb-6">Đánh giá tổng quan</label>
                <div className="flex justify-center">
                  <ReactStars
                    count={5}
                    value={rating || 0}
                    onChange={setRating}
                    size={38}
                    color2="#ffd700"
                    color1="#d3d3d3"
                    half={false}
                    edit={true}
                  />
                </div>
                <p className="text-lg text-gray-500 mt-4">
                  {rating && rating === 5 ? "Sản phẩm và dịch vụ tuyệt vời" : rating === 4 ? "Sản phẩm chất lượng tốt"
                    : rating === 3 ? "Sản phẩm tạm ổn" : rating === 2 ? "Sản phẩm có vài lỗi nhỏ" : rating && rating === 1 ? "Chất lượng sản phẩm không đúng mô tả" : ""}
                </p>
              </div>
              <button
                onClick={handleReviewSubmit}
                className="mt-4 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition w-full md:w-auto"
              >
                Gửi đánh giá
              </button>
              {reviewMessage && <p className="mt-6  text-xl text-center text-red-600">{reviewMessage}</p>}
            </div>
          </div>

          <div className="mt-16 p-8 bg-white border-2 border-gray-300 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-300">
            <p className="text-2xl font-bold text-gray-800 text-center">
              Đánh giá trung bình: <span className="text-yellow-500 text-3xl">{product.average_rating}/5</span>
            </p>
            <div className="flex justify-center mt-4">
              <ReactStars
                count={5}
                value={product.average_rating}
                size={28}
                color2="#ffd700"
                color1="#d3d3d3"
                half={true}
                edit={false}
              />
            </div>
            <p className="mt-4 text-lg text-gray-600 text-center">Tổng: {product.review_count} đánh giá</p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DetailsPage;