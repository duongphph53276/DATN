import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IVariant } from "../../../interfaces/variant";
import {
  loadUserCart,
  updateCartItemQuantity,
  removeFromUserCart,
  migrateOldCart,
  getCartTotal
} from "../../../utils/cartUtils";
import { ToastSucess, ToastError } from "../../../utils/toast";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: IVariant;
  variantAttributes?: string; // Thêm trường này để đồng bộ với DetailsPage
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  // Load cart của user và lắng nghe sự kiện cartUpdated
  useEffect(() => {
    // Migrate cart cũ nếu có
    migrateOldCart();

    // Load cart của user hiện tại
    const userCart = loadUserCart();
    setCartItems(userCart);

    const handleCartUpdated = () => {
      const updatedCart = loadUserCart();

      setCartItems(updatedCart);
      // setSuccessMessage("Đã thêm sản phẩm vào giỏ hàng!");
      // setTimeout(() => setSuccessMessage(null), 3000);
    };

    // Listen cho user changes (login/logout)
    const handleUserChange = () => {
      const updatedCart = loadUserCart();

      setCartItems(updatedCart);
    };

    window.addEventListener("cartUpdated", handleCartUpdated);
    window.addEventListener("storage", handleUserChange); // Listen storage changes

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
      window.removeEventListener("storage", handleUserChange);
    };
  }, []);

  // Tăng số lượng
  const increaseQty = (item: CartItem) => {
    // Lấy số lượng tồn kho từ variant hoặc product
    const stockQty = item.variant?.stock_quantity ?? item.quantityInStock ?? 0;// quantityInStock là field bạn cần lưu khi addToCart

    if (item.quantity + 1 > stockQty) {
      ToastError(`Chỉ còn ${stockQty} sản phẩm trong kho!`);
      return;
    }

    updateCartItemQuantity(item._id, item.variant, item.quantity + 1);
    ToastSucess("Số lượng sản phẩm đã tăng thêm một!")

  };

  // Giảm số lượng
  const decreaseQty = (item: CartItem) => {
    if (item.quantity > 1) {
      updateCartItemQuantity(item._id, item.variant, item.quantity - 1);

      ToastSucess("Số lượng sản phẩm đã giảm đi một!")

    }
  };

  // Xoá sản phẩm
  const removeItem = (item: CartItem) => {
    removeFromUserCart(item._id, item.variant);

    ToastSucess("Đã xóa sản phẩm khỏi giỏ hàng!")

  };

  // Tổng tiền
  const total = getCartTotal();

  // Hiển thị thuộc tính từ variantAttributes
  const getVariantAttributesDisplay = (item: CartItem) => {
    if (!item.variantAttributes) {
      return <span className="text-gray-400 text-sm">Không có thuộc tính</span>;
    }
    return <p className="text-sm text-gray-500">{item.variantAttributes}</p>;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-10 text-pink-600">🛒 Giỏ hàng của bạn</h2>

      {/* {successMessage && (
        <div className="fixed top-5 right-5 bg-green-100 text-green-600 text-sm py-2 px-4 rounded-lg animate-slide-down z-50">
          {successMessage}
        </div>
      )} */}

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">Chưa có sản phẩm nào trong giỏ.</p>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item, idx) => (
              <div
                key={`${item.id}-${JSON.stringify(item.variant?.attributes)}-${idx}`}
                className="flex flex-col sm:flex-row items-center gap-4 border-b pb-6"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-xl border shadow-sm"
                />
                <div className="flex-1 text-center sm:text-left min-h-[100px]">
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <div className="mt-2 min-h-[40px]">
                    {getVariantAttributesDisplay(item)}
                  </div>
                  <div className="flex justify-center sm:justify-start items-center gap-3 mt-3">
                    <button
                      onClick={() => decreaseQty(item)}
                      className="w-8 h-8 rounded-full bg-gray-100 text-xl text-gray-700 hover:bg-gray-200 active:scale-95"
                    >
                      –
                    </button>
                    <span className="text-base font-medium">{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(item)}
                      className="w-8 h-8 rounded-full bg-gray-100 text-xl text-gray-700 hover:bg-gray-200 active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-pink-500 font-bold text-lg">
                    {(item.price * item.quantity).toLocaleString()}₫
                  </p>
                  <button
                    onClick={() => removeItem(item)}
                    className="text-sm text-red-500 mt-2 hover:underline"
                  >
                    ❌ Xoá
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-6 border-t">
            <p className="text-xl font-semibold text-gray-700">
              Tổng cộng:{" "}
              <span className="text-pink-600">{total.toLocaleString()}₫</span>
            </p>
            <button
              onClick={() => navigate("/checkout")}
              className="mt-4 sm:mt-0 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-3 rounded-xl shadow transition"
            >
              ✅ Thanh toán
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;