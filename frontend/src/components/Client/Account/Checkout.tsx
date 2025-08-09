import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { createOrder } from '../../../store/slices/orderSlice';
import { CartItem, DiscountInfo, IVariant, IVariantAttribute } from '../../../interfaces/checkout';
import { Address } from '../../../interfaces/user';
import { callVnpaySanboxPayUrl } from '../../../services/api/payment';
import { applyVoucher } from '../../../services/api/voucher';
import { getAddress } from '../../../services/api/address';
import { usePermissions } from '../../../hooks/usePermissions';
import AddressModal from './AddressModal';

const Checkout: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState<Address | null>(null);
  const [addressId, setAddressId] = useState<string>('');
  const [discountCode, setDiscountCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [appliedDiscount, setAppliedDiscount] = useState<DiscountInfo | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCheckingDiscount, setIsCheckingDiscount] = useState(false);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [discountSuccess, setDiscountSuccess] = useState<string | null>(null);
  const { userInfo } = usePermissions();
  const dispatch = useAppDispatch();

  // Address modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [availableAddresses, setAvailableAddresses] = useState<Address[]>([]);


  useEffect(() => {
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

    const savedDiscount = localStorage.getItem('appliedDiscount');
    if (savedDiscount) {
      try {
        const discountData = JSON.parse(savedDiscount);
        setAppliedDiscount(discountData);
        setDiscountCode(discountData.code);
        calculateDiscountAmount(discountData);
      } catch (error) {
        localStorage.removeItem('appliedDiscount');
      }
    }

    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchAddress();
    } else {
      setErrorMessage('Bạn cần đăng nhập để tiếp tục thanh toán.');
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [navigate]);

  const fetchAddress = async () => {
    try {
      const response = await getAddress();

      if (response.status === 200) {
        const addresses: Address[] = response.data.data;
        setAvailableAddresses(addresses);
        const defaultAddress = addresses.find(addr => addr.is_default);
        if (defaultAddress) {
          setAddress(defaultAddress);
          setAddressId(defaultAddress._id);
        } else if (addresses.length > 0) {
          // If no default address, select the first one
          setAddress(addresses[0]);
          setAddressId(addresses[0]._id);
        }
      } else {
        setErrorMessage('Không thể tải địa chỉ. Vui lòng thêm địa chỉ giao hàng.');
      }
    } catch (error) {
      console.error('Lỗi khi fetch địa chỉ:', error);
      setErrorMessage('Lỗi khi tải địa chỉ. Vui lòng thử lại.');
    }
  };

  const handleSelectAddress = (selectedAddress: Address) => {
    setAddress(selectedAddress);
    setAddressId(selectedAddress._id);
    setErrorMessage(null);
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const calculateDiscountAmount = (discount: DiscountInfo) => {
    if (!discount) {
      setDiscountAmount(0);
      return;
    }

    let amount = 0;
    if (discount.type === 'percentage') { 
      amount = (totalPrice * discount.value) / 100;
    } else if (discount.type === 'fixed') {
      amount = discount.value;
    }

    amount = Math.min(amount, totalPrice);
    setDiscountAmount(amount);
  };

  useEffect(() => {
    if (appliedDiscount) {  
      calculateDiscountAmount(appliedDiscount);
    }
  }, [totalPrice, appliedDiscount]);

  const validateDiscountCode = async (code: string): Promise<{ isValid: boolean; discount?: DiscountInfo; error?: string }> => {
    if (!code || code.trim() === '') {
      return { isValid: false, error: 'Vui lòng nhập mã giảm giá' };
    }

    try {
      const response = await applyVoucher({
        code: code.trim().toUpperCase()
      });
      console.log(response);
      if (response.status) {
        const discount: DiscountInfo = response.data;
        console.log(discount, 'hẹ hẹ ')
        const now = new Date();
        const startDate = new Date(discount.start_date);
        const endDate = new Date(discount.end_date);

        if (!discount.is_active) {
          return { isValid: false, error: 'Mã giảm giá không còn hiệu lực' };
        }

        if (now < startDate) {
          return { isValid: false, error: 'Mã giảm giá chưa có hiệu lực' };
        }

        if (now > endDate) {
          return { isValid: false, error: 'Mã giảm giá đã hết hạn' };
        }

        if (discount.used_quantity >= discount.quantity) {
          return { isValid: false, error: 'Mã giảm giá đã hết lượt sử dụng' };
        }
        console.log(totalPrice, discount.min_order_value);
        if (totalPrice < discount.min_order_value) {
          return {
            isValid: false,
            error: `Đơn hàng tối thiểu ${discount.min_order_value.toLocaleString('vi-VN')}₫ để sử dụng mã này`
          };
        }

        return { isValid: true, discount };
      }

      return { isValid: false, error: 'Mã giảm giá không tồn tại' };
    } catch (error: any) {
      if (error.response?.status === 404) {
        return { isValid: false, error: 'Mã giảm giá không tồn tại' };
      }
      if (error.response?.status === 400) {
        return { isValid: false, error: error.response.data.message || 'Mã giảm giá không hợp lệ' };
      }
      return { isValid: false, error: 'Lỗi khi kiểm tra mã giảm giá' };
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError('Vui lòng nhập mã giảm giá');
      return;
    }

    setIsCheckingDiscount(true);
    setDiscountError(null);
    setDiscountSuccess(null);

    const validation = await validateDiscountCode(discountCode);

    if (validation.isValid && validation.discount) {
      setAppliedDiscount(validation.discount);
      calculateDiscountAmount(validation.discount);

      localStorage.setItem('appliedDiscount', JSON.stringify(validation.discount));

      setDiscountSuccess(`Áp dụng mã thành công! Giảm ${validation.discount.type === 'percentage' ? validation.discount.value + '%' : validation.discount.value.toLocaleString('vi-VN') + '₫'}`);

      setTimeout(() => setDiscountSuccess(null), 3000);
    } else {
      setDiscountError(validation.error || 'Mã giảm giá không hợp lệ');
      setTimeout(() => setDiscountError(null), 3000);
    }

    setIsCheckingDiscount(false);
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountAmount(0);
    setDiscountCode('');
    setDiscountError(null);
    setDiscountSuccess(null);
    localStorage.removeItem('appliedDiscount');
  };

  const finalTotal = Math.max(0, totalPrice - discountAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isLoggedIn) {
      setErrorMessage('Bạn chưa đăng nhập!');
      setTimeout(() => navigate('/login'), 3000);
      setLoading(false);
      return;
    }

    if (!addressId) {
      setErrorMessage('Vui lòng chọn địa chỉ giao hàng.');
      setLoading(false);
      return;
    }

    if (appliedDiscount) {
      const validation = await validateDiscountCode(appliedDiscount.code);
      if (!validation.isValid) {
        setErrorMessage(`Mã giảm giá không còn hợp lệ: ${validation.error}`);
        handleRemoveDiscount();
        setLoading(false);
        return;
      }
    }

    if (paymentMethod === "VNPAY") {
      try {
        const res = await callVnpaySanboxPayUrl({
          amount: finalTotal,
          bank_code: 'NCB'
        });
        localStorage.setItem('address_id', addressId);
        const paymentUrl = res.data.paymentUrl;
        if (paymentUrl) {
          window.location.href = paymentUrl;
          return;
        }
      } catch (error) {
        setErrorMessage('Lỗi khi tạo thanh toán VNPay');
        setLoading(false);
        return;
      }
    } else {
      try {
        const orderData = {
          user_id: userInfo._id,
          address_id: addressId,
          order_details: cartItems.map((item) => ({
            product_id: item.variant?.product_id || item._id || item.id,
            variant_id: item.variant?._id || 'default-variant',
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          total_amount: finalTotal,
          payment_method: paymentMethod,
          voucher_id: appliedDiscount?._id || null,
          quantity: cartItems.reduce((total, item) => total + item.quantity, 0),
        };

        console.log('Sending order data:', orderData);
        console.log('Order details breakdown:');
        orderData.order_details.forEach((detail, index) => {
          console.log(`Item ${index + 1}:`, detail);
        });
        
        if (orderData) {
          dispatch(createOrder(orderData));
        }
        localStorage.removeItem('cart');
        localStorage.removeItem('appliedDiscount');
        window.dispatchEvent(new Event('cartUpdated'));

        setTimeout(() => {
          setSuccessMessage(null);
          navigate('/');
        }, 4000);

      } catch (error) {
        setErrorMessage('Lỗi khi gửi đơn hàng. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    }


  };

  const getVariantAttributesDisplay = (variant?: IVariant) => {
    if (!variant || !variant.attributes || variant.attributes.length === 0) {
      return <span className="text-gray-400 text-sm">Gấu bông cơ bản</span>;
    }

    return variant.attributes.map((attr: IVariantAttribute) => (
      <p key={attr.attribute_id} className="text-sm text-gray-600">
        🎀 {attr.attribute_name || "Thuộc tính"}: {attr.value || "Không xác định"}
      </p>
    ));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center">
        <div className="text-center bg-white p-10 rounded-3xl shadow-2xl">
          <div className="text-6xl mb-4">🧸</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Bạn chưa đăng nhập</h2>
          <p className="text-gray-600 mb-6">Vui lòng đăng nhập để tiếp tục mua sắm gấu bông nhé!</p>
          <a
            href="/login"
            className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-3 px-8 rounded-full transition transform hover:scale-105"
          >
            🔐 Đăng nhập ngay
          </a>
        </div>
        {errorMessage && (
          <div className="fixed top-5 right-5 bg-red-100 text-red-600 text-sm py-3 px-6 rounded-2xl shadow-lg animate-bounce z-50">
            ❌ {errorMessage}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🧸💕</div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600 mb-2">
            Thanh Toán Đơn Hàng
          </h1>
          <p className="text-gray-600">Hoàn tất đơn hàng gấu bông yêu thích của bạn</p>
        </div>

        {successMessage && (
          <div className="fixed top-5 right-5 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-r-xl shadow-xl animate-slide-down z-50 max-w-md">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🎉</span>
              <div>
                <p className="font-semibold">Thành công!</p>
                <p className="text-sm">{successMessage}</p>
              </div>
            </div>
          </div>
        )}
        {errorMessage && (
          <div className="fixed top-5 right-5 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl shadow-xl animate-slide-down z-50 max-w-md">
            <div className="flex items-center">
              <span className="text-2xl mr-3">❌</span>
              <div>
                <p className="font-semibold">Lỗi!</p>
                <p className="text-sm">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                🛒 <span className="ml-2">Giỏ hàng của bạn</span>
              </h2>

              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🧸</div>
                  <p className="text-gray-500 text-lg">Giỏ hàng trống, hãy chọn những chú gấu bông yêu thích!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div
                      key={`${item.id}-${JSON.stringify(item.variant?.attributes)}-${index}`}
                      className="flex items-center gap-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-4 hover:shadow-md transition-all duration-300"
                    >
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-xl shadow-md"
                        />
                        <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                          {item.quantity}
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800 mb-1">{item.name}</h3>
                        <div className="mb-2">
                          {getVariantAttributesDisplay(item.variant)}
                        </div>
                        <p className="text-sm text-gray-500">Số lượng: {item.quantity} con</p>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-pink-600">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="border-t-2 border-pink-200 pt-4 mt-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-700">Tạm tính:</span>
                      <span className="text-xl font-bold text-gray-800">
                        {totalPrice.toLocaleString('vi-VN')}₫
                      </span>
                    </div>

                    {appliedDiscount && discountAmount > 0 && (
                      <div className="flex justify-between items-center text-green-600">
                        <span className="text-lg font-semibold">Giảm giá ({appliedDiscount.code}):</span>
                        <span className="text-xl font-bold">
                          -{discountAmount.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center border-t pt-3">
                      <span className="text-xl font-semibold text-gray-700">Tổng cộng:</span>
                      <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">
                        {finalTotal.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  🏠 <span className="ml-2">Địa chỉ giao hàng</span>
                </h2>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-full font-semibold transition-all transform hover:scale-105"
                >
                  {address ? 'Thay đổi' : 'Chọn địa chỉ'}
                </button>
              </div>

              {address ? (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        {address.is_default ? (
                          <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                            📍 Địa chỉ mặc định
                          </span>
                        ) : (
                          <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                            📍 Địa chỉ đã chọn
                          </span>
                        )}
                      </div>
                      <p className="text-lg font-semibold text-gray-800 mb-2">{address.street}</p>
                      <p className="text-gray-600">{address.city}, {address.country}</p>
                      {address.postal_code && (
                        <p className="text-gray-500 text-sm">Mã bưu điện: {address.postal_code}</p>
                      )}
                    </div>
                    <div className="text-4xl">🎯</div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="text-sm text-green-700 flex items-center">
                      <span className="mr-2">✅</span>
                      Địa chỉ đã được xác nhận
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                  <div className="text-4xl mb-4">📍</div>
                  <p className="text-gray-500 text-lg font-medium">Chưa chọn địa chỉ giao hàng</p>
                  <p className="text-sm text-gray-400 mt-2 mb-4">Vui lòng chọn hoặc thêm địa chỉ giao hàng</p>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
                  >
                    Chọn địa chỉ ngay
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  🎫 <span className="ml-2">Mã giảm giá</span>
                </h3>

                {appliedDiscount ? (
                  <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-green-600 text-xl mr-2">✅</span>
                        <span className="font-bold text-green-800">{appliedDiscount.code}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveDiscount}
                        className="text-red-500 hover:text-red-700 font-bold text-sm"
                      >
                        Xóa
                      </button>
                    </div>
                    <p className="text-sm text-green-700">
                      Giảm {appliedDiscount.type === 'percentage'
                        ? `${appliedDiscount.value}%`
                        : `${appliedDiscount.value.toLocaleString('vi-VN')}₫`
                      } - Tiết kiệm {discountAmount.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        className="w-full border-2 border-pink-200 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all"
                        placeholder="Nhập mã giảm giá"
                        disabled={isCheckingDiscount}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-2xl">
                        💝
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      disabled={!discountCode.trim() || isCheckingDiscount}
                      className={`w-full py-3 rounded-2xl font-bold transition-all ${!discountCode.trim() || isCheckingDiscount
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
                        }`}
                    >
                      {isCheckingDiscount ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Đang kiểm tra...
                        </div>
                      ) : (
                        'Áp dụng mã giảm giá'
                      )}
                    </button>
                  </div>
                )}

                {discountError && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600 flex items-center">
                      <span className="mr-2">❌</span>
                      {discountError}
                    </p>
                  </div>
                )}

                {discountSuccess && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-sm text-green-600 flex items-center">
                      <span className="mr-2">✅</span>
                      {discountSuccess}
                    </p>
                  </div>
                )}

                <p className="text-sm text-gray-500 mt-2">
                  * Áp dụng mã để nhận ưu đãi đặc biệt
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  💳 <span className="ml-2">Phương thức thanh toán</span>
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center p-4 rounded-2xl border-2 border-gray-200 hover:border-pink-300 cursor-pointer transition-all group">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-pink-500 bg-pink-500' : 'border-gray-300'
                      }`}>
                      {paymentMethod === 'COD' && <div className="w-3 h-3 bg-white rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800">Thanh toán khi nhận hàng</span>
                        <span className="text-2xl">💵</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Trả tiền khi gấu bông được giao đến tay bạn</p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 rounded-2xl border-2 border-gray-200 hover:border-pink-300 cursor-pointer transition-all group">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="VNPAY"
                      checked={paymentMethod === 'VNPAY'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${paymentMethod === 'VNPAY' ? 'border-pink-500 bg-pink-500' : 'border-gray-300'
                      }`}>
                      {paymentMethod === 'VNPAY' && <div className="w-3 h-3 bg-white rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800">Thanh toán VNPay</span>
                        <span className="text-2xl">🏦</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Thanh toán online an toàn, nhanh chóng</p>
                    </div>
                  </label>
                </div>
              </div>



              <button
                type="submit"
                disabled={loading || cartItems.length === 0 || !addressId}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform ${loading || cartItems.length === 0 || !addressId
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white hover:scale-105 shadow-lg hover:shadow-xl active:scale-95'
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="text-2xl mr-3">🛒</span>
                    <span>Đặt hàng ngay ({finalTotal.toLocaleString('vi-VN')}₫)</span>
                  </div>
                )}
              </button>
            </form>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4">
              <div className="flex items-center text-blue-700">
                <span className="text-2xl mr-3">🔒</span>
                <div>
                  <p className="font-semibold text-sm">Thanh toán an toàn</p>
                  <p className="text-xs text-blue-600">Thông tin của bạn được bảo mật 100%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Management Modal */}
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSelectAddress={handleSelectAddress}
        currentAddress={address}
      />
    </div>
  );
};

export default Checkout;