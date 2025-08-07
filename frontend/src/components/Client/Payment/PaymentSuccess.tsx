import React, { useState, useEffect } from 'react';
import { CheckCircle, Heart, Star, Gift, Home, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatVND } from '../../../utils/currency';

interface PaymentSuccessProps {
  amount: number;
  orderId?: string;
  transactionId?: string;
  bankCode?: string;
  paymentTime?: string;
}

export default function PaymentSuccess({
  amount,
  orderId = 'N/A',
  transactionId = 'N/A',
  bankCode = 'N/A',
  paymentTime = 'N/A'
}: PaymentSuccessProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [bearAnimation, setBearAnimation] = useState(false);

  useEffect(() => {
    setBearAnimation(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  const confettiColors = ['bg-pink-400', 'bg-yellow-400', 'bg-purple-400', 'bg-blue-400', 'bg-green-400'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 ${confettiColors[i % confettiColors.length]} rounded-full animate-bounce`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-pink-300 opacity-20 animate-pulse"
            size={20 + Math.random() * 20}
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4 animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🎉 Thanh toán thành công! 🎉
            </h1>
            <p className="text-lg text-gray-600">
              Cảm ơn bạn đã tin tưởng Memories! 💕
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border-4 border-pink-100">
            <div className="text-center mb-8">
              <div className={`inline-block transition-transform duration-1000 ${bearAnimation ? 'animate-bounce' : ''}`}>
                <div className="text-8xl mb-4">🧸</div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Gấu bông đang trên đường đến với bạn!
              </h2>
              <p className="text-gray-600 mb-4">
                Đơn hàng của bạn đã được xác nhận và sẽ sớm được giao đến tay bạn
              </p>

              <div className="bg-pink-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-gray-700">Mã đơn hàng:</span>
                  <span className="font-bold text-pink-600">#{orderId}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-gray-700">Mã giao dịch:</span>
                  <span className="font-bold text-purple-600">#{transactionId}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-gray-700">Ngân hàng:</span>
                  <span className="font-bold text-blue-600">{bankCode}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-gray-700">Tổng tiền:</span>
                  <span className="font-bold text-green-600 text-xl">{formatVND(amount)}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-gray-700">Thời gian thanh toán:</span>
                  <span className="font-bold text-orange-600">{paymentTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Thời gian giao hàng:</span>
                  <span className="font-bold text-blue-600">2-3 ngày</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                ✨ Tiếp theo sẽ như thế nào? ✨
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-2xl">
                  <Package className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-800 mb-1">Đóng gói</h4>
                  <p className="text-sm text-gray-600">Gấu của bạn được đóng gói cẩn thận</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-2xl">
                  <Gift className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-800 mb-1">Vận chuyển</h4>
                  <p className="text-sm text-gray-600">Giao hàng nhanh chóng đến tay bạn</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-2xl">
                  <Heart className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-800 mb-1">Tận hưởng</h4>
                  <p className="text-sm text-gray-600">Ôm gấu và tạo kỷ niệm đẹp</p>
                </div>
              </div>
            </div>

            <div className="text-center bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 mb-6">
              <div className="text-4xl mb-3">💝</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Cảm ơn bạn rất nhiều!
              </h3>
              <p className="text-gray-600">
                Bạn không chỉ mua một chú gấu bông, mà còn mang về nhà một người bạn đáng yêu
                sẽ ở bên bạn trong mọi khoảnh khắc! 🥰
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/my-orders" className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                <Package className="w-5 h-5" />
                Theo dõi đơn hàng
              </Link>
              <Link to="/" className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                <Home className="w-5 h-5" />
                Về trang chủ
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-yellow-100">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                🌟 Đánh giá trải nghiệm của bạn 🌟
              </h3>
              <div className="flex justify-center gap-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-8 h-8 text-yellow-400 hover:text-yellow-500 cursor-pointer transition-colors fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm">
                Chia sẻ cảm nhận của bạn để giúp chúng tôi phục vụ tốt hơn! 💕
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-500">
              🐻 Với tình yêu từ đội ngũ Memories 🐻
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}