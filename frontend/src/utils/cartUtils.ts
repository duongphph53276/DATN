import { getCartByUser, addToCart } from '../../api/cart.api';

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

// Lấy cart key theo user
const getCartKey = (userId: string) => `cart_${userId}`;

// Lấy user hiện tại
const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Load cart từ localStorage theo user
export const loadUserCart = (): CartItem[] => {
  const user = getCurrentUser();
  if (!user) return []; // Trả về empty khi chưa login
  
  const cartKey = getCartKey(user.id);
  const stored = localStorage.getItem(cartKey);
  return stored ? JSON.parse(stored) : [];
};

// Save cart vào localStorage theo user
export const saveUserCart = (cartItems: CartItem[]): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const cartKey = getCartKey(user.id);
  localStorage.setItem(cartKey, JSON.stringify(cartItems));
  
  // Dispatch event để update UI
  window.dispatchEvent(new Event("cartUpdated"));
};

// Clear cart của user hiện tại
export const clearUserCart = (): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const cartKey = getCartKey(user.id);
  localStorage.removeItem(cartKey);
  
  // Dispatch event để update UI
  window.dispatchEvent(new Event("cartUpdated"));
};

// Clear tất cả cart trong localStorage (chỉ dùng khi cần thiết, KHÔNG dùng cho logout)
export const clearAllCarts = (): void => {
  // Tìm tất cả keys có prefix 'cart_'
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('cart_')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove old cart key nếu có
  localStorage.removeItem('cart');
  
  // Dispatch event để update UI
  window.dispatchEvent(new Event("cartUpdated"));
};

// Clear chỉ hiển thị cart (cho logout - cart vẫn được lưu)
export const clearCartDisplay = (): void => {
  // Chỉ dispatch event để UI hiển thị cart trống
  // KHÔNG xóa cart trong localStorage
  window.dispatchEvent(new Event("cartUpdated"));
};

// Thêm sản phẩm vào cart
export const addToUserCart = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const cartItems = loadUserCart();
  const quantity = newItem.quantity || 1;
  
  // Tìm sản phẩm đã tồn tại (cùng variant)
  const existingIndex = cartItems.findIndex((item) =>
    item._id === newItem._id &&
    (!item.variant ||
      JSON.stringify(item.variant?.attributes?.map((attr: any) => [attr.attribute_id, attr.value_id]).sort()) ===
      JSON.stringify(newItem.variant?.attributes?.map((attr: any) => [attr.attribute_id, attr.value_id]).sort()))
  );

  if (existingIndex !== -1) {
    // Nếu đã tồn tại, tăng quantity
    cartItems[existingIndex].quantity += quantity;
  } else {
    // Nếu chưa tồn tại, thêm mới
    cartItems.push({
      ...newItem,
      quantity
    } as CartItem);
  }

  saveUserCart(cartItems);
};

// Cập nhật quantity của một item
export const updateCartItemQuantity = (itemId: string, variant: any, newQuantity: number): void => {
  const cartItems = loadUserCart();
  
  const itemIndex = cartItems.findIndex((item) =>
    item._id === itemId &&
    (!item.variant ||
      JSON.stringify(item.variant?.attributes?.map((attr: any) => [attr.attribute_id, attr.value_id]).sort()) ===
      JSON.stringify(variant?.attributes?.map((attr: any) => [attr.attribute_id, attr.value_id]).sort()))
  );

  if (itemIndex !== -1) {
    if (newQuantity <= 0) {
      // Nếu quantity <= 0, xóa item
      cartItems.splice(itemIndex, 1);
    } else {
      // Cập nhật quantity
      cartItems[itemIndex].quantity = newQuantity;
    }
    saveUserCart(cartItems);
  }
};

// Xóa item khỏi cart
export const removeFromUserCart = (itemId: string, variant: any): void => {
  const cartItems = loadUserCart();
  
  const filteredItems = cartItems.filter((item) =>
    !(item._id === itemId &&
      (!item.variant ||
        JSON.stringify(item.variant?.attributes?.map((attr: any) => [attr.attribute_id, attr.value_id]).sort()) ===
        JSON.stringify(variant?.attributes?.map((attr: any) => [attr.attribute_id, attr.value_id]).sort())))
  );

  saveUserCart(filteredItems);
};

// Lấy tổng số lượng items trong cart
export const getCartItemCount = (): number => {
  const cartItems = loadUserCart();
  return cartItems.reduce((sum, item) => sum + item.quantity, 0);
};

// Lấy tổng giá trị cart
export const getCartTotal = (): number => {
  const cartItems = loadUserCart();
  return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

// Migrate cart cũ (nếu có) sang user cart
export const migrateOldCart = (): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const oldCart = localStorage.getItem('cart');
  if (oldCart) {
    try {
      const oldCartItems = JSON.parse(oldCart);
      if (Array.isArray(oldCartItems) && oldCartItems.length > 0) {
        // Save vào user cart mới
        saveUserCart(oldCartItems);
        // Xóa cart cũ
        localStorage.removeItem('cart');
      }
    } catch (error) {
      console.error('Error migrating old cart:', error);
      localStorage.removeItem('cart');
    }
  }
};