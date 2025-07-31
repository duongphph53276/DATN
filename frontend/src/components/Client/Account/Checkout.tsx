import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IVariantAttribute, IVariant } from "../../../interfaces/variant.ts"; 

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: IVariant;
}

const Checkout: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load giỏ hàng
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch (error) {
        console.error('Lỗi khi parse giỏ hàng từ localStorage:', error);
        setErrorMessage('Lỗi khi tải giỏ hàng. Vui lòng thử lại.');
        setTimeout(() => setErrorMessage(null), 3000);
      }
    }

    // Kiểm tra đăng nhập
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token) {
      setIsLoggedIn(true);
      if (user) {
        try {
          const userData = JSON.parse(user);
          if (userData.name) setName(userData.name);
          if (userData.phone) setPhone(userData.phone);
          if (userData.address) setAddress(userData.address);
        } catch (error) {
          console.error('Lỗi khi parse user từ localStorage:', error);
          setErrorMessage('Lỗi khi tải thông tin người dùng. Vui lòng cập nhật thông tin.');
          setTimeout(() => setErrorMessage(null), 3000);
        }
      }
    } else {
      setErrorMessage('Bạn cần đăng nhập để tiếp tục thanh toán.');
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [navigate]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setErrorMessage('Bạn chưa đăng nhập!');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    if (!name || !phone || !address) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin.');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    // Gửi đơn hàng tới server (nếu cần)
    try {
      // Ví dụ: await api.post('/orders', { user: { name, phone, address }, items: cartItems, total: totalPrice });
      setSuccessMessage('🎉 Đặt hàng thành công!');
      setTimeout(() => {
        setSuccessMessage(null);
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdated'));
        navigate('/');
      }, 3000);
    } catch (error) {
      setErrorMessage('Lỗi khi gửi đơn hàng. Vui lòng thử lại.');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  // Hiển thị tất cả thuộc tính của biến thể
  const getVariantAttributesDisplay = (variant?: IVariant) => {
    if (!variant || !variant.attributes || variant.attributes.length === 0) {
      return <span className="text-gray-400 text-sm">-</span>;
    }

    return variant.attributes.map((attr: IVariantAttribute) => (
      <p key={attr.attribute_id} className="text-sm text-gray-500">
        {attr.attribute_name || "Thuộc tính"}: {attr.value || "Không xác định"}
      </p>
    ));
  };

  if (!isLoggedIn) {
    return (
      <div className="text-center py-20 text-red-500 text-xl">
        Vui lòng{' '}
        <a href="/login" className="underline text-blue-600">
          đăng nhập
        </a>{' '}
        để thanh toán.
        {errorMessage && (
          <div className="fixed top-5 right-5 bg-red-100 text-red-600 text-sm py-2 px-4 rounded-lg animate-slide-down z-50">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-10 text-pink-600">
        🧾 Thông tin thanh toán
      </h2>

      {successMessage && (
        <div className="fixed top-5 right-5 bg-green-100 text-green-600 text-sm py-2 px-4 rounded-lg animate-slide-down z-50">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-5 right-5 bg-red-100 text-red-600 text-sm py-2 px-4 rounded-lg animate-slide-down z-50">
          {errorMessage}
        </div>
      )}

      {/* Giỏ hàng */}
      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center">Không có sản phẩm trong giỏ hàng.</p>
      ) : (
        <div className="mb-10 space-y-4">
          {cartItems.map((item, index) => (
            <div
              key={`${item.id}-${JSON.stringify(item.variant?.attributes)}-${index}`}
              className="flex items-center justify-between bg-white shadow rounded-xl p-4"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="min-h-[60px]">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <div className="min-h-[40px]">
                    {getVariantAttributesDisplay(item.variant)}
                  </div>
                  <p className="text-sm text-gray-500">Số lượng: x{item.quantity}</p>
                </div>
              </div>
              <div className="text-right text-pink-600 font-semibold text-lg">
                {(item.price * item.quantity).toLocaleString()}₫
              </div>
            </div>
          ))}
          <div className="text-right text-2xl font-bold mt-4">
            Tổng cộng: <span className="text-pink-600">{totalPrice.toLocaleString()}₫</span>
          </div>
        </div>
      )}

      {/* Form thanh toán */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-6"
      >
        <div>
          <label className="block font-semibold text-gray-700 mb-2">👤 Họ và tên</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập họ tên"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-2">📞 Số điện thoại</label>
          <input
            type="tel"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-2">🏠 Địa chỉ nhận hàng</label>
          <textarea
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Nhập địa chỉ"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-3 rounded-xl transition active:scale-95"
        >
          🛒 Đặt hàng ngay
        </button>
      </form>
    </div>
  );
};

export default Checkout;