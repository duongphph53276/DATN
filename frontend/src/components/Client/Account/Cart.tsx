import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: string;
  name: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  // Load từ localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCartItems(JSON.parse(stored));
    }
  }, []);

  // Cập nhật + phát sự kiện
  const updateCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cartUpdated")); // Đồng bộ với badge
  };

  // Tăng số lượng
  const increaseQty = (item: CartItem) => {
    const updated = cartItems.map((i) =>
      i.id === item.id && i.size === item.size
        ? { ...i, quantity: i.quantity + 1 }
        : i
    );
    updateCart(updated);
  };

  // Giảm số lượng
  const decreaseQty = (item: CartItem) => {
    const updated = cartItems.map((i) =>
      i.id === item.id && i.size === item.size && i.quantity > 1
        ? { ...i, quantity: i.quantity - 1 }
        : i
    );
    updateCart(updated);
  };

  // Xoá sản phẩm
  const removeItem = (item: CartItem) => {
    const updated = cartItems.filter(
      (i) => !(i.id === item.id && i.size === item.size)
    );
    updateCart(updated);
  };

  // Tổng tiền
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-10 text-pink-600">🛒 Giỏ hàng của bạn</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">Chưa có sản phẩm nào trong giỏ.</p>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item, idx) => (
              <div
                key={`${item.id}-${item.size}-${idx}`}
                className="flex flex-col sm:flex-row items-center gap-4 border-b pb-6"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-xl border shadow-sm"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">Size: {item.size}</p>
                  <div className="flex justify-center sm:justify-start items-center gap-3 mt-3">
                    <button
                      onClick={() => decreaseQty(item)}
                      className="w-8 h-8 rounded-full bg-gray-100 text-xl text-gray-700 hover:bg-gray-200"
                    >
                      –
                    </button>
                    <span className="text-base font-medium">{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(item)}
                      className="w-8 h-8 rounded-full bg-gray-100 text-xl text-gray-700 hover:bg-gray-200"
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

          {/* Tổng cộng và thanh toán */}
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
