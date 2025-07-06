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

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      setCartItems(JSON.parse(stored));
    }
  }, []);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !address) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    // Bạn có thể gửi đơn hàng tới server tại đây (API)

    alert('Đặt hàng thành công!');
    localStorage.removeItem('cart');
    window.location.href = '/'; // chuyển về trang chủ hoặc trang cảm ơn
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6">🧾 Thông tin thanh toán</h2>

      {/* Thông tin giỏ hàng */}
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Không có sản phẩm trong giỏ hàng.</p>
      ) : (
        <div className="mb-8">
          {cartItems.map((item, index) => (
            <div
              key={`${item.id}-${item.size}-${index}`}
              className="flex items-center justify-between py-4 border-b"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Size: {item.size}</p>
                  <p className="text-sm text-gray-500">x{item.quantity}</p>
                </div>
              </div>
              <div className="text-right text-pink-600 font-semibold">
                {(item.price * item.quantity).toLocaleString()}₫
              </div>
            </div>
          ))}
          <div className="text-right text-xl font-bold mt-4">
            Tổng cộng: <span className="text-pink-600">{totalPrice.toLocaleString()}₫</span>
          </div>
        </div>
      )}

      {/* Form đặt hàng */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-semibold mb-1">Họ và tên</label>
          <input
            type="text"
            className="w-full border rounded px-4 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Số điện thoại</label>
          <input
            type="tel"
            className="w-full border rounded px-4 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Địa chỉ nhận hàng</label>
          <textarea
            className="w-full border rounded px-4 py-2"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-pink-600 transition"
        >
          Đặt hàng ngay
        </button>
      </form>
    </div>
  );
};

export default Checkout;
