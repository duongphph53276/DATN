import React, { useState, useEffect } from 'react';
import { XCircle, Heart, RotateCcw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { callVnpaySanboxPayUrl } from '../../../services/api/payment';
import { formatVND } from '../../../utils/currency';

interface PaymentFailedProps {
  amount: number;
  orderId: string;
  errorCode: string;
  errorMessage: string;
}

function PaymentFailed({ amount, orderId, errorCode, errorMessage }: PaymentFailedProps) {
  const navigate = useNavigate();
  const [isRetrying, setIsRetrying] = useState(false);
    const [bearAnimation, setBearAnimation] = useState(false);
    const [showHearts, setShowHearts] = useState(true);

    useEffect(() => {
        setBearAnimation(true);
        const timer = setInterval(() => {
            setShowHearts(prev => !prev);
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    const handleRetryPayment = async () => {
      if (isRetrying) return;
      
      setIsRetrying(true);
      try {
        // Validate amount
        if (!amount || amount <= 0) {
          alert('Số tiền không hợp lệ. Vui lòng thử lại.');
          setIsRetrying(false);
          return;
        }

        // Validate user is logged in
        const user = localStorage.getItem('user');
        if (!user) {
          alert('Bạn cần đăng nhập để thanh toán.');
          navigate('/login');
          setIsRetrying(false);
          return;
        }

        // Validate address
        const addressId = localStorage.getItem('address_id');
        if (!addressId) {
          alert('Vui lòng chọn địa chỉ giao hàng trước khi thanh toán.');
          navigate('/checkout');
          setIsRetrying(false);
          return;
        }

        // Call VNPAY API
        const res = await callVnpaySanboxPayUrl({
          amount: amount,
          bank_code: 'NCB'
        });

        const paymentUrl = res.data.paymentUrl;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          throw new Error('Không thể tạo URL thanh toán');
        }
      } catch (error) {
        console.error('Lỗi khi thử thanh toán lại:', error);
        alert('Có lỗi xảy ra khi thử thanh toán lại. Vui lòng thử lại sau.');
      } finally {
        setIsRetrying(false);
      }
    };

    const handleGoHome = () => {
      navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <Heart
                        key={i}
                        className={`absolute text-pink-300 opacity-30 transition-opacity duration-1000 ${showHearts ? 'animate-pulse' : 'opacity-10'}`}
                        size={15 + Math.random() * 15}
                        style={{
                            left: `${10 + Math.random() * 80}%`,
                            top: `${10 + Math.random() * 80}%`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            <div className="absolute top-10 right-10 text-6xl opacity-20 animate-bounce">
                ☁️
            </div>
            <div className="absolute top-20 left-10 text-4xl opacity-20 animate-pulse">
                💔
            </div>

            <div className="container mx-auto px-4 py-8 relative z-10">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-4 animate-pulse">
                            <XCircle className="w-12 h-12 text-red-500" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                            😔 Oops! Có lỗi xảy ra 😔
                        </h1>
                        <p className="text-lg text-gray-600">
                            Đừng buồn, gấu của bạn vẫn đang chờ! 🧸
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border-4 border-orange-100">
                        <div className="text-center mb-8">
                            <div className={`inline-block transition-transform duration-1000 ${bearAnimation ? 'animate-bounce' : ''}`}>
                                <div className="text-8xl mb-4 relative">
                                    🧸
                                    <div className="absolute -top-2 -right-2 text-2xl animate-pulse">💧</div>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Thanh toán không thành công
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Gấu bông đang buồn vì chưa thể về với bạn
                            </p>

                            <div className="bg-red-50 rounded-2xl p-6 mb-6 border-2 border-red-100">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="bg-red-100 rounded-full p-3 mr-3">
                                        <XCircle className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Lý do thất bại:</h3>
                                        <p className="text-gray-600">{errorMessage}</p>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-500 mb-2">Mã lỗi: #{errorCode}</p>
                                    <p className="text-sm text-gray-500 mb-2">Mã đơn hàng: #{orderId}</p>
                                    <p className="text-sm text-gray-500 mb-2">Số tiền: {formatVND(amount)}</p>
                                    <p className="text-sm text-red-600 font-medium">
                                        💳 Vui lòng kiểm tra thông tin thẻ và thử lại
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                                🤔 Có thể do những nguyên nhân sau:
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-yellow-50 rounded-2xl p-4 border-2 border-yellow-100">
                                    <div className="text-center">
                                        <div className="text-3xl mb-2">💳</div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Thông tin thẻ</h4>
                                        <p className="text-sm text-gray-600">Số thẻ, CVV hoặc ngày hết hạn không chính xác</p>
                                    </div>
                                </div>
                                <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-100">
                                    <div className="text-center">
                                        <div className="text-3xl mb-2">💰</div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Số dư tài khoản</h4>
                                        <p className="text-sm text-gray-600">Không đủ số dư hoặc đã vượt hạn mức</p>
                                    </div>
                                </div>
                                <div className="bg-purple-50 rounded-2xl p-4 border-2 border-purple-100">
                                    <div className="text-center">
                                        <div className="text-3xl mb-2">🌐</div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Kết nối mạng</h4>
                                        <p className="text-sm text-gray-600">Mất kết nối trong quá trình thanh toán</p>
                                    </div>
                                </div>
                                <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-100">
                                    <div className="text-center">
                                        <div className="text-3xl mb-2">🏦</div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Ngân hàng</h4>
                                        <p className="text-sm text-gray-600">Ngân hàng từ chối hoặc bảo trì hệ thống</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 mb-6">
                            <div className="text-4xl mb-3">🌈</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                Đừng lo lắng nhé! 💕
                            </h3>
                            <p className="text-gray-600">
                                Gấu bông của bạn vẫn đang chờ và sẽ rất vui khi được về với bạn.
                                Hãy thử lại, chúng mình sẽ giúp bạn hoàn tất đơn hàng! 🥰
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                            <button 
                                onClick={handleRetryPayment}
                                disabled={isRetrying}
                                className="bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                            >
                                <RotateCcw className={`w-5 h-5 ${isRetrying ? 'animate-spin' : ''}`} />
                                {isRetrying ? 'Đang xử lý...' : 'Thử thanh toán lại'}
                            </button>
                            <button 
                                onClick={handleGoHome}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                            >
                                <Home className="w-5 h-5" />
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                    <div className="text-center mt-8 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6">
                        <div className="text-3xl mb-2">🌟</div>
                        <p className="text-gray-600 font-medium">
                            "Mọi khó khăn đều có cách giải quyết, gấu của bạn đang chờ một phép màu nhỏ!" ✨
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            🐻 Cùng nhau vượt qua và tạo nên kỷ niệm đẹp 🐻
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default PaymentFailed;