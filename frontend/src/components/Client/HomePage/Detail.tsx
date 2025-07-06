import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { allProducts } from '../../../mock/allProduct';

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = allProducts.find((p) => p.id === id);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (product?.size?.length === 1) {
      setSelectedSize(product.size[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="text-center py-20 text-gray-500 text-xl">
        Không tìm thấy sản phẩm.
      </div>
    );
  }

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      image: product.image,
      price: parseInt(product.price.replace(/[^\d]/g, '')),
      size: selectedSize || '', // không bắt buộc
      quantity,
    };

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

    const existingIndex = existingCart.findIndex(
      (item: any) => item.id === cartItem.id && item.size === cartItem.size
    );

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += quantity;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    console.log('✅ Giỏ hàng mới:', existingCart);
    navigate('/cart');
  };

  const benefits = [
    '100% bông trắng tinh khiết',
    '100% ảnh chụp tại shop',
    'Bảo hành đường chỉ trọn đời',
    'Bảo hành Bông gấu 6 tháng',
    'Miễn phí Gói quà',
    'Miễn phí Tặng thiệp',
    'Miễn phí Nén chân không gấu',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="relative group rounded-2xl overflow-hidden shadow-lg border border-gray-200">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[420px] object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col justify-center gap-6 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{product.name}</h1>

        <div className="flex justify-center md:justify-start items-center gap-4">
          <span className="text-3xl text-pink-500 font-semibold">{product.price}</span>
          {product.oldPrice && (
            <span className="line-through text-gray-400 text-lg">{product.oldPrice}</span>
          )}
        </div>

        {/* Không bắt buộc chọn size nữa */}
        {product.size && product.size.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Chọn kích thước (tuỳ chọn):</h4>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              {product.size.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-1 text-sm rounded-full border transition ${
                    selectedSize === s
                      ? 'bg-pink-500 text-white border-pink-500'
                      : 'bg-pink-100 text-pink-600 border-pink-300 hover:bg-pink-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

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
        )}

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
