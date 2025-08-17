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
import { MdDelete } from "react-icons/md";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: IVariant;
  variantAttributes?: string;
  quantityInStock?: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [tempQuantities, setTempQuantities] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const [itemToDelete, setItemToDelete] = useState<CartItem | null>(null);

  useEffect(() => {
    migrateOldCart();
    const userCart = loadUserCart();
    setCartItems(userCart);

    const handleCartUpdated = () => {
      const updatedCart = loadUserCart();
      setCartItems(updatedCart);
      setTempQuantities({});
    };

    const handleUserChange = () => {
      const updatedCart = loadUserCart();
      setCartItems(updatedCart);
      setTempQuantities({});
    };

    window.addEventListener("cartUpdated", handleCartUpdated);
    window.addEventListener("storage", handleUserChange);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
      window.removeEventListener("storage", handleUserChange);
    };
  }, []);

  const increaseQty = (item: CartItem) => {
    const stockQty = item.variant?.quantity ?? item.quantityInStock ?? 0;
    if (item.quantity + 1 > stockQty) {
      ToastError(`Chỉ còn ${stockQty} sản phẩm trong kho!`);
      return;
    }
    updateCartItemQuantity(item.id, item.variant, item.quantity + 1);
    ToastSucess("Số lượng sản phẩm đã tăng thêm một!");
  };

  const decreaseQty = (item: CartItem) => {
    if (item.quantity > 1) {
      updateCartItemQuantity(item.id, item.variant, item.quantity - 1);
      ToastSucess("Số lượng sản phẩm đã giảm đi một!");
    }
  };

  const handleQuantityChange = (item: CartItem, newQty: string) => {
    const qty = parseInt(newQty, 10);
    if (isNaN(qty) || qty < 1) {
      ToastError("Số lượng phải là số nguyên dương!");
      return;
    }
    const stockQty = item.variant?.quantity ?? item.quantityInStock ?? 0;
    if (qty > stockQty) {
      ToastError(`Chỉ còn ${stockQty} sản phẩm trong kho!`);
      return;
    }
    updateCartItemQuantity(item.id, item.variant, qty);
    ToastSucess("Số lượng sản phẩm đã được cập nhật!");
  };

  const confirmDeleteItem = () => {
    if (itemToDelete) {
      removeFromUserCart(itemToDelete.id, itemToDelete.variant);
      ToastSucess("Đã xóa sản phẩm khỏi giỏ hàng!");
      setItemToDelete(null);
    }
  };

  const total = getCartTotal();

  const getVariantAttributesDisplay = (item: CartItem) => {
    if (!item.variantAttributes) {
      return <span className="text-gray-400 text-sm">Không có thuộc tính</span>;
    }
    return <p className="text-sm text-gray-500 italic">{item.variantAttributes}</p>;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 drop-shadow-lg">
        🛒 Giỏ hàng của bạn
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
          <p className="text-gray-500 text-lg">Chưa có sản phẩm nào trong giỏ.</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item, idx) => {
              const itemKey = `${item.id}-${JSON.stringify(item.variant?.attributes)}-${idx}`;
              const displayQty = tempQuantities[itemKey] ?? item.quantity.toString();
              const stockQty = item.variant?.quantity ?? item.quantityInStock ?? 0;

              return (
                <div
                  key={itemKey}
                  className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-28 h-28 object-cover rounded-xl border shadow-sm"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <div className="mt-1">{getVariantAttributesDisplay(item)}</div>                    
                    <span className="text-sm text-pink-500 font-medium"> Giá: {item.price.toLocaleString()}₫</span>
                    <div className="flex justify-center sm:justify-start items-center gap-3 mt-4">
                      <button
                        onClick={() => decreaseQty(item)}
                        className="w-8 h-8 rounded-full bg-gray-100 text-xl text-gray-700 hover:bg-gray-200 active:scale-95 transition"
                      >
                        –
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={stockQty}
                        value={displayQty}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setTempQuantities((prev) => ({ ...prev, [itemKey]: newValue }));
                        }}
                        onBlur={() => {
                          const newQty = tempQuantities[itemKey] || item.quantity.toString();
                          handleQuantityChange(item, newQty);
                          setTempQuantities((prev) => {
                            const newTemp = { ...prev };
                            delete newTemp[itemKey];
                            return newTemp;
                          });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        className="w-16 text-center border rounded-lg text-base font-medium focus:outline-none focus:ring-2 focus:ring-pink-400"
                      />
                      <button
                        onClick={() => increaseQty(item)}
                        className="w-8 h-8 rounded-full bg-gray-100 text-xl text-gray-700 hover:bg-gray-200 active:scale-95 transition"
                      >
                        +
                      </button>
                    </div>                
                  </div>
                  <div className="text-center sm:text-right mr-12">
                    <p className="text-gray-500 text-ellipsis">
                       × {item.quantity}
                    </p>
                    <p className="text-pink-500 font-bold text-lg">
                      {(item.price * item.quantity).toLocaleString()}₫
                    </p>
                  </div>

                  <button
                    className="p-2 mr-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full hover:scale-110 transition-all shadow-md"
                    onClick={() => setItemToDelete(item)}
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-6 border-t border-gray-200">
            <p className="text-2xl font-semibold text-gray-700">
              Tổng cộng:{" "}
              <span className="text-pink-600">{total.toLocaleString()}₫</span>
            </p>
            <button
              onClick={() => navigate("/checkout")}
              className="mt-4 sm:mt-0 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
            >
              ✅ Thanh toán
            </button>
          </div>
        </>
      )}

      {itemToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Xóa sản phẩm?</h3>
            <p className="text-gray-500 mb-6">
              Bạn có chắc chắn muốn xóa{" "}
              <span className="font-semibold text-pink-500">{itemToDelete.name}</span>{" "}
              khỏi giỏ hàng không?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
                onClick={confirmDeleteItem}
              >
               Xóa       
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;