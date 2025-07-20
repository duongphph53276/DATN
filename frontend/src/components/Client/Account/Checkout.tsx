import React, { useEffect, useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
}

const Checkout: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
  const stored = localStorage.getItem('cart');
  if (stored) {
    setCartItems(JSON.parse(stored));
  }

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (token && user) {
    setIsLoggedIn(true);

    try {
      const userData = JSON.parse(user);
      if (userData.name) setName(userData.name);
      if (userData.phone) setPhone(userData.phone);
      if (userData.address) setAddress(userData.address);
    } catch (error) {
      console.error('Lỗi khi parse user từ localStorage:', error);
    }
  } else {
    alert('Bạn cần đăng nhập để tiếp tục thanh toán.');
    window.location.href = '/login';
  }
}, []);


  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert('Bạn chưa đăng nhập!');
      return;
    }

    if (!name || !phone || !address) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    // Gửi đơn hàng tới server ở đây (nếu cần)
    alert('🎉 Đặt hàng thành công!');
    localStorage.removeItem('cart');
    window.location.href = '/';
  };

  if (!isLoggedIn) {
    // Nếu chưa đăng nhập thì không hiển thị form thanh toán
    return (
      <div className="text-center py-20 text-red-500 text-xl">
        Vui lòng <a href="/login" className="underline text-blue-600">đăng nhập</a> để thanh toán.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-10">🧾 Thông tin thanh toán</h2>

      {/* Giỏ hàng */}
      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center">Không có sản phẩm trong giỏ hàng.</p>
      ) : (
        <div className="mb-10 space-y-4">
          {cartItems.map((item, index) => (
            <div
              key={`${item.id}-${item.size}-${index}`}
              className="flex items-center justify-between bg-white shadow rounded-xl p-4"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500">Size: {item.size}</p>
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
            placeholder="Nhập họ tên "
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
            placeholder="Nhập số điện thoại "
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
            placeholder="Nhập địa chỉ "
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-xl transition duration-300"
        >
          🛒 Đặt hàng ngay
        </button>
      </form>
    </div>
  );
};

export default Checkout;
  