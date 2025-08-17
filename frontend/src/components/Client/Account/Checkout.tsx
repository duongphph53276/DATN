import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { createOrder } from '../../../store/slices/orderSlice';
import { CartItem, DiscountInfo, IVariant, IVariantAttribute } from '../../../interfaces/checkout';
import { Address } from '../../../interfaces/user';
import { callVnpaySanboxPayUrl } from '../../../services/api/payment';
import { applyVoucher } from '../../../services/api/voucher';
import { getAddress } from '../../../services/api/address';
import { calculateShippingFee } from '../../../services/api/shipping';
import { usePermissions } from '../../../hooks/usePermissions';
import AddressModal from './AddressModal';
import { clearUserCart, migrateOldCart, loadUserCart } from '../../../utils/cartUtils';
import { updateVariantQuantity } from '../../../services/api/productVariant'; // API mới để cập nhật số lượng variant

const Checkout: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState<Address | null>(null);
  const [addressId, setAddressId] = useState<string>('');
  const [discountCode, setDiscountCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
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
  const { userInfo, refetch } = usePermissions();
  const dispatch = useAppDispatch();

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [availableAddresses, setAvailableAddresses] = useState<Address[]>([]);
  const [shippingFee, setShippingFee] = useState(0);

  // Thêm state cho thông tin người dùng
  const [isEditingUserInfo, setIsEditingUserInfo] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userInfoError, setUserInfoError] = useState<string | null>(null);
  const [userInfoSuccess, setUserInfoSuccess] = useState<string | null>(null);
  const [isUpdatingUserInfo, setIsUpdatingUserInfo] = useState(false);

  useEffect(() => {

    migrateOldCart();

    try {
      const userCartItems = loadUserCart();
      setCartItems(userCartItems);
    } catch (error) {
      console.error('Lỗi khi tải giỏ hàng của user:', error);
      setErrorMessage('Lỗi khi tải giỏ hàng. Vui lòng thử lại.');
      setTimeout(() => setErrorMessage(null), 3000);
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

  // Khởi tạo thông tin người dùng khi userInfo có sẵn
  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.name || '');
      setUserPhone(userInfo.phone || userInfo.phoneNumber || '');
    }
  }, [userInfo]);

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
          // Calculate shipping fee for default address
          try {
            const shippingResponse = await calculateShippingFee({ address_id: defaultAddress._id });
            if (shippingResponse.status === 200) {
              setShippingFee(shippingResponse.data.data.shipping_fee);
            }
          } catch (error) {
            console.error('Lỗi khi tính phí ship:', error);
            setShippingFee(10000);
          }
        } else if (addresses.length > 0) {
          setAddress(addresses[0]);
          setAddressId(addresses[0]._id);
          // Calculate shipping fee for first address
          try {
            const shippingResponse = await calculateShippingFee({ address_id: addresses[0]._id });
            if (shippingResponse.status === 200) {
              setShippingFee(shippingResponse.data.data.shipping_fee);
            }
          } catch (error) {
            console.error('Lỗi khi tính phí ship:', error);
            setShippingFee(10000);
          }
        }
      } else {
        setErrorMessage('Không thể tải địa chỉ. Vui lòng thêm địa chỉ giao hàng.');
      }
    } catch (error) {
      console.error('Lỗi khi fetch địa chỉ:', error);
      setErrorMessage('Lỗi khi tải địa chỉ. Vui lòng thử lại.');
    }
  };

  const handleSelectAddress = async (selectedAddress: Address) => {
    setAddress(selectedAddress);
    setAddressId(selectedAddress._id);
    setErrorMessage(null);

    // Calculate shipping fee when address is selected
    try {
      const response = await calculateShippingFee({ address_id: selectedAddress._id });
      if (response.status === 200) {
        setShippingFee(response.data.data.shipping_fee);
      }
    } catch (error) {
      console.error('Lỗi khi tính phí ship:', error);
      setShippingFee(10000); // Default to 10k if error
    }
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

    // Sửa lại để sử dụng discount_type thay vì type
    if (discount.discount_type === 'percentage') {
      amount = (totalPrice * discount.value) / 100;
      // Thêm giới hạn maximum discount nếu cần
      if (discount.max_discount_amount) {
        amount = Math.min(amount, discount.max_discount_amount);
      }
    } else if (discount.discount_type === 'fixed') {
      amount = discount.value;
    }

    // Đảm bảo amount không vượt quá totalPrice
    amount = Math.min(amount, totalPrice);

    console.log('Discount calculation:', {
      discountType: discount.discount_type,
      discountValue: discount.value,
      totalPrice: totalPrice,
      calculatedAmount: amount
    });

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

    if (!userInfo?._id) {  // Check để tránh lỗi nếu user chưa login
      return { isValid: false, error: 'Bạn cần đăng nhập để áp dụng mã giảm giá' };
    }

    try {
      const response = await applyVoucher({
        code: code.trim().toUpperCase(),
        user_id: userInfo._id  // Truyền user_id từ userInfo (là ObjectId hợp lệ)
      });
      console.log(response);

      if (response.status) {
        const discount: DiscountInfo = response.data;
        console.log(discount, 'hẹ hẹ ');

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

      // Sửa lại hiển thị thông báo success
      const discountText = validation.discount.discount_type === 'percentage'
        ? validation.discount.value + '%'
        : validation.discount.value.toLocaleString('vi-VN') + '₫';

      setDiscountSuccess(`Áp dụng mã thành công! Giảm ${discountText}`);

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

  // Hàm xử lý cập nhật thông tin người dùng
  const handleUpdateUserInfo = async () => {
    if (!userName.trim()) {
      setUserInfoError('Tên không được để trống');
      return;
    }

    if (!userPhone.trim()) {
      setUserInfoError('Số điện thoại không được để trống');
      return;
    }

    // Validate số điện thoại (đơn giản)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(userPhone.replace(/\s/g, ''))) {
      setUserInfoError('Số điện thoại không hợp lệ (10-11 số)');
      return;
    }

    setIsUpdatingUserInfo(true);
    setUserInfoError(null);
    setUserInfoSuccess(null);

    try {
      // Gọi API cập nhật thông tin người dùng
      const response = await fetch('http://localhost:5000/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: userName.trim(),
          phoneNumber: userPhone.trim() // Sử dụng phoneNumber theo API backend
        })
      });

      const data = await response.json();

      if (data.status) {
        setUserInfoSuccess('Cập nhật thông tin thành công!');
        setIsEditingUserInfo(false);
        // Refetch thông tin người dùng để cập nhật UI
        refetch();
        setTimeout(() => setUserInfoSuccess(null), 3000);
      } else {
        setUserInfoError(data.message || 'Có lỗi xảy ra khi cập nhật thông tin');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      setUserInfoError('Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setIsUpdatingUserInfo(false);
    }
  };

  const handleCancelEditUserInfo = () => {
    // Khôi phục thông tin ban đầu
    if (userInfo) {
      setUserName(userInfo.name || '');
      setUserPhone(userInfo.phone || userInfo.phoneNumber || '');
    }
    setIsEditingUserInfo(false);
    setUserInfoError(null);
    setUserInfoSuccess(null);
  };

  const finalTotal = Math.max(0, totalPrice - discountAmount + shippingFee);

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

    // Kiểm tra thông tin người dùng
    if (!userName.trim()) {
      setErrorMessage('Vui lòng cập nhật tên người dùng.');
      setLoading(false);
      return;
    }

    if (!userPhone.trim()) {
      setErrorMessage('Vui lòng cập nhật số điện thoại.');
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

    if (paymentMethod === "bank_transfer") {
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
        // Validate cart items before creating order
        const validatedOrderDetails = cartItems.map((item, index) => {
          const productId = item.variant?.product_id || item._id || item.id;
          const variantId = item.variant?._id;

          if (!productId) {
            throw new Error(`Sản phẩm thứ ${index + 1} không có ID hợp lệ`);
          }

          if (!item.name) {
            throw new Error(`Sản phẩm thứ ${index + 1} không có tên hợp lệ`);
          }

          if (!variantId) {
            throw new Error(`Sản phẩm "${item.name}" không có variant hợp lệ`);
          }

          if (!item.price || isNaN(item.price) || item.price <= 0) {
            throw new Error(`Sản phẩm "${item.name}" có giá không hợp lệ`);
          }

          if (!item.quantity || isNaN(item.quantity) || item.quantity <= 0) {
            throw new Error(`Sản phẩm "${item.name}" có số lượng không hợp lệ`);
          }

          return {
            product_id: productId,
            variant_id: variantId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || '',
          };
        });

        // Validate user info
        if (!userInfo?._id) {
          throw new Error('Thông tin người dùng không hợp lệ. Vui lòng đăng nhập lại.');
        }

        // Validate address
        if (!addressId) {
          throw new Error('Vui lòng chọn địa chỉ giao hàng.');
        }

        // Validate total amount
        if (!finalTotal || isNaN(finalTotal) || finalTotal <= 0) {
          throw new Error('Tổng tiền đơn hàng không hợp lệ.');
        }

        // Validate cart items
        if (!cartItems || cartItems.length === 0) {
          throw new Error('Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng.');
        }

        // Validate payment method
        if (!paymentMethod) {
          throw new Error('Vui lòng chọn phương thức thanh toán.');
        }

        const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

        // Validate total quantity
        if (!totalQuantity || isNaN(totalQuantity) || totalQuantity <= 0) {
          throw new Error('Số lượng sản phẩm không hợp lệ.');
        }

        const orderData = {
          user_id: userInfo._id,
          address_id: addressId,
          order_details: validatedOrderDetails,
          total_amount: finalTotal,
          payment_method: paymentMethod,
          voucher_id: appliedDiscount?._id || null,
          quantity: totalQuantity,
        };

        console.log('Sending order data:', JSON.stringify(orderData, null, 2));
        console.log('Order details breakdown:');
        orderData.order_details.forEach((detail, index) => {
          console.log(`Item ${index + 1}:`, JSON.stringify(detail, null, 2));
        });

        // Log validation info
        console.log('Validation info:', {
          user_id: orderData.user_id,
          address_id: orderData.address_id,
          total_amount: orderData.total_amount,
          payment_method: orderData.payment_method,
          voucher_id: orderData.voucher_id,
          quantity: orderData.quantity,
          order_details_count: orderData.order_details.length
        });

        if (orderData) {
          try {
            const result = await dispatch(createOrder(orderData)).unwrap();      

            // Cập nhật số lượng tồn kho sau khi tạo đơn hàng thành công
            for (const item of cartItems) {
              if (item.variant?._id) { // Chỉ cập nhật nếu ID variant tồn tại
                try {
                  await updateVariantQuantity(item.variant._id, item.quantity, 'deduct');
                } catch (error) {
                  console.error(`Lỗi khi cập nhật số lượng cho variant ${item.variant._id}:`, error);
                  setErrorMessage(`Đơn hàng đã được tạo nhưng lỗi khi cập nhật số lượng sản phẩm "${item.name}".`);
                  setLoading(false);
                }
              }
            }
            // Chỉ xóa giỏ hàng và hiển thị thông báo thành công khi đặt hàng thành công
            clearUserCart();
            localStorage.removeItem('appliedDiscount');

            // Chuyển hướng đến trang thông báo đặt hàng thành công
            const orderId = result?.data?._id || 'N/A';
            const paymentMethodText = paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán VNPay';

            navigate(`/order-success?orderId=${orderId}&totalAmount=${finalTotal}&paymentMethod=${encodeURIComponent(paymentMethodText)}`);
          } catch (error: any) {
            console.error('Lỗi khi đặt hàng:', error);
            const errorMessage = error?.message || error?.payload || 'Lỗi khi gửi đơn hàng. Vui lòng thử lại.';
            setErrorMessage(errorMessage);
          }
        }

      } catch (error) {
        console.error('Lỗi khi xử lý đơn hàng:', error);
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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
          <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🧸</span>
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            Oops! Bạn chưa đăng nhập
          </h2>
          <p className="text-slate-600 mb-6">
            Vui lòng đăng nhập để tiếp tục mua sắm gấu bông nhé!
          </p>
          <a
            href="/login"
            className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
          >
            Đăng nhập ngay
          </a>
        </div>
        {errorMessage && (
          <div className="fixed top-4 right-4 bg-white border border-red-200 text-red-800 p-4 rounded-xl shadow-lg z-50 max-w-sm">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 text-sm">✕</span>
              </div>
              <p className="font-semibold text-sm">{errorMessage}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl mb-8 shadow-xl">
            <span className="text-2xl">🧸</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Thanh Toán Đơn Hàng
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Hoàn tất đơn hàng gấu bông yêu thích của bạn
          </p>
        </div>

        {/* Notifications */}
        {successMessage && (
          <div className="fixed top-4 right-4 bg-white border border-green-200 text-green-800 p-4 rounded-xl shadow-lg z-50 max-w-sm">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <p className="font-semibold text-sm">Thành công!</p>
                <p className="text-xs text-green-600">{successMessage}</p>
              </div>
            </div>
          </div>
        )}
        {errorMessage && (
          <div className="fixed top-4 right-4 bg-white border border-red-200 text-red-800 p-4 rounded-xl shadow-lg z-50 max-w-sm">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 text-sm">✕</span>
              </div>
              <div>
                <p className="font-semibold text-sm">Lỗi!</p>
                <p className="text-xs text-red-600">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

                {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shopping Cart Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                                 <div className="flex items-center">
                   <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center mr-3">
                     <span className="text-pink-600 text-lg">🛒</span>
                   </div>
                   <h2 className="text-2xl font-semibold text-slate-800">
                     Giỏ hàng của bạn
                   </h2>
                 </div>
                <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {cartItems.length} sản phẩm
                </div>
              </div>

                               {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🧸</span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Giỏ hàng trống</h3>
                    <p className="text-slate-500 mb-6">Hãy chọn những chú gấu bông yêu thích của bạn!</p>
                                         <button 
                       onClick={() => navigate('/')}
                       className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                     >
                       Mua sắm ngay
                     </button>
                  </div>
                ) : (
                                   <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <div
                        key={`${item.id}-${JSON.stringify(item.variant?.attributes)}-${index}`}
                        className="flex items-center gap-4 bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors"
                      >
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                                                     <div className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
                             {item.quantity}
                           </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800 mb-1">{item.name}</h3>
                          <div className="mb-2">
                            {getVariantAttributesDisplay(item.variant)}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-slate-500 bg-white px-2 py-1 rounded-md">
                              Số lượng: {item.quantity}
                            </p>
                            <p className="text-lg font-semibold text-slate-800">
                              {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                                       {/* Order Summary */}
                    <div className="bg-white rounded-xl p-6 mt-6 border border-slate-200">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                        <span className="mr-2">📊</span>
                        Tổng kết đơn hàng
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-slate-600">Tạm tính:</span>
                          <span className="font-medium text-slate-800">
                            {totalPrice.toLocaleString('vi-VN')}₫
                          </span>
                        </div>

                        {appliedDiscount && discountAmount > 0 && (
                          <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <div className="flex items-center">
                              <span className="text-green-600 mr-2">🎫</span>
                              <span className="text-green-600">
                                Giảm giá ({appliedDiscount.code})
                              </span>
                            </div>
                            <span className="font-medium text-green-600">
                              -{discountAmount.toLocaleString('vi-VN')}₫
                            </span>
                          </div>
                        )}

                        {shippingFee > 0 && (
                          <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <div className="flex items-center">
                              <span className="text-blue-600 mr-2">🚚</span>
                              <span className="text-blue-600">Phí vận chuyển:</span>
                            </div>
                            <span className="font-medium text-blue-600">
                              {shippingFee.toLocaleString('vi-VN')}₫
                            </span>
                          </div>
                        )}

                        {shippingFee === 0 && address && (
                          <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <div className="flex items-center">
                              <span className="text-green-600 mr-2">🎉</span>
                              <span className="text-green-600">Phí vận chuyển:</span>
                            </div>
                            <span className="font-medium text-green-600">
                              Miễn phí
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-3">
                          <span className="text-lg font-semibold text-slate-800">Tổng cộng:</span>
                          <span className="text-2xl font-bold text-slate-800">
                            {finalTotal.toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                      </div>
                    </div>
                 </div>
               )}
                                          </div>

            {/* Shipping Address Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
                    <span className="text-green-600 text-lg">🏠</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-800">
                    Địa chỉ giao hàng
                  </h2>
                </div>
                                 <button
                   onClick={() => setShowAddressModal(true)}
                   className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                 >
                   {address ? 'Thay đổi' : 'Chọn địa chỉ'}
                 </button>
              </div>

                               {address ? (
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">📍</span>
                          </div>
                          {address.is_default ? (
                            <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                              Địa chỉ mặc định
                            </span>
                          ) : (
                            <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                              Địa chỉ đã chọn
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p className="font-semibold text-slate-800">{address.street}</p>
                          <p className="text-slate-600">{address.city}, {address.country}</p>
                          {address.postal_code && (
                            <p className="text-slate-500 text-sm">Mã bưu điện: {address.postal_code}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-3xl ml-4">🎯</div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-green-200">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2">
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <p className="text-sm text-green-700 font-medium">
                            Địa chỉ đã được xác nhận
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-600">
                            Phí vận chuyển: 
                            {shippingFee === 0 ? (
                              <span className="text-green-600 ml-1 font-medium">Miễn phí</span>
                            ) : (
                              <span className="text-blue-600 ml-1 font-medium">{shippingFee.toLocaleString('vi-VN')}₫</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                               ) : (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl">📍</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Chưa chọn địa chỉ giao hàng</h3>
                    <p className="text-slate-500 mb-6">Vui lòng chọn hoặc thêm địa chỉ giao hàng</p>
                                         <button
                       onClick={() => setShowAddressModal(true)}
                       className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                     >
                       Chọn địa chỉ ngay
                     </button>
                  </div>
                )}
             </div>
          </div>

                     {/* Right Column - Sidebar */}
           <div className="space-y-6">
             <form onSubmit={handleSubmit} className="space-y-6">

             {/* User Information Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-lg">👤</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-800">
                    Thông tin người dùng
                  </h2>
                </div>
                                 {!isEditingUserInfo && (
                   <button
                     onClick={() => setIsEditingUserInfo(true)}
                     className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                   >
                     Chỉnh sửa
                   </button>
                 )}
              </div>

                {userInfoSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <p className="text-green-700 text-sm">{userInfoSuccess}</p>
                    </div>
                  </div>
                )}

                {userInfoError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white text-xs">✕</span>
                      </div>
                      <p className="text-red-700 text-sm">{userInfoError}</p>
                    </div>
                  </div>
                )}

                {isEditingUserInfo ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Tên người dùng
                      </label>
                                             <input
                         type="text"
                         value={userName}
                         onChange={(e) => setUserName(e.target.value)}
                         className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-colors"
                         placeholder="Nhập tên của bạn"
                       />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Số điện thoại
                      </label>
                                             <input
                         type="tel"
                         value={userPhone}
                         onChange={(e) => setUserPhone(e.target.value)}
                         className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-colors"
                         placeholder="Nhập số điện thoại"
                       />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleUpdateUserInfo}
                        disabled={isUpdatingUserInfo}
                                                 className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                           isUpdatingUserInfo
                             ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                             : 'bg-pink-600 hover:bg-pink-700 text-white'
                         }`}
                      >
                        {isUpdatingUserInfo ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Đang cập nhật...
                          </div>
                        ) : (
                          'Lưu thay đổi'
                        )}
                      </button>
                      
                      <button
                        onClick={handleCancelEditUserInfo}
                        disabled={isUpdatingUserInfo}
                        className="flex-1 py-3 rounded-xl font-medium bg-slate-500 hover:bg-slate-600 text-white transition-colors"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">👤</span>
                          </div>
                          <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                            Thông tin đặt hàng
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between py-2 border-b border-blue-200">
                            <span className="text-sm font-medium text-blue-600">Tên:</span> 
                            <span className={`text-sm font-medium ${userName ? 'text-slate-800' : 'text-red-500'}`}>
                              {userName || 'Chưa cập nhật'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-blue-200">
                            <span className="text-sm font-medium text-blue-600">SĐT:</span> 
                            <span className={`text-sm font-medium ${userPhone ? 'text-slate-800' : 'text-red-500'}`}>
                              {userPhone || 'Chưa cập nhật'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <span className="text-sm font-medium text-blue-600">Email:</span> 
                            <span className="text-sm font-medium text-slate-800">
                              {userInfo?.email || 'Chưa cập nhật'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-3xl ml-4">👤</div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2">
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <p className="text-xs text-blue-700 font-medium">
                            Thông tin sẽ được sử dụng cho đơn hàng
                          </p>
                        </div>
                        {(!userName || !userPhone) && (
                          <div className="flex items-center">
                            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center mr-2">
                              <span className="text-white text-xs">⚠</span>
                            </div>
                            <p className="text-xs text-orange-600 font-medium">
                              Vui lòng cập nhật thông tin đầy đủ
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-indigo-600 text-sm">💳</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Phương thức thanh toán
                  </h3>
                </div>
                <div className="space-y-3">
                                    <label className="flex items-center p-4 rounded-xl border border-slate-300 hover:border-pink-400 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                                         <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                       paymentMethod === 'cod' ? 'border-pink-500 bg-pink-500' : 'border-slate-300'
                     }`}>
                      {paymentMethod === 'cod' && <div className="w-3 h-3 bg-white rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-800">Thanh toán khi nhận hàng</span>
                        <span className="text-xl">💵</span>
                      </div>
                      <p className="text-slate-500 text-sm mt-1">Trả tiền khi gấu bông được giao đến tay bạn</p>
                    </div>
                  </label>

                                     <label className="flex items-center p-4 rounded-xl border border-slate-300 hover:border-pink-400 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                                         <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                       paymentMethod === 'bank_transfer' ? 'border-pink-500 bg-pink-500' : 'border-slate-300'
                     }`}>
                      {paymentMethod === 'bank_transfer' && <div className="w-3 h-3 bg-white rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-800">Thanh toán VNPay</span>
                        <span className="text-xl">🏦</span>
                      </div>
                      <p className="text-slate-500 text-sm mt-1">Thanh toán online an toàn, nhanh chóng</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Discount Code Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-600 text-sm">🎫</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Mã giảm giá
                  </h3>
                </div>

                {appliedDiscount ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="font-semibold text-green-800">{appliedDiscount.code}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveDiscount}
                        className="text-red-500 hover:text-red-700 text-xs bg-red-50 px-2 py-1 rounded-md transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                    <p className="text-sm text-green-700">
                      Giảm {appliedDiscount.discount_type === 'percentage'
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
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-colors"
                        placeholder="Nhập mã giảm giá"
                        disabled={isCheckingDiscount}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg">
                        💝
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      disabled={!discountCode.trim() || isCheckingDiscount}
                      className={`w-full py-3 rounded-xl font-medium transition-colors ${
                        !discountCode.trim() || isCheckingDiscount
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
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
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white text-xs">✕</span>
                      </div>
                      <p className="text-red-700 text-sm">{discountError}</p>
                    </div>
                  </div>
                )}

                {discountSuccess && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <p className="text-green-700 text-sm">{discountSuccess}</p>
                    </div>
                  </div>
                )}

                <p className="text-xs text-slate-500 mt-3 text-center">
                  Áp dụng mã để nhận ưu đãi đặc biệt
                </p>
              </div>

                                             {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={loading || cartItems.length === 0 || !addressId || !userName.trim() || !userPhone.trim()}
                                     className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors ${
                     loading || cartItems.length === 0 || !addressId || !userName.trim() || !userPhone.trim()
                       ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                       : 'bg-pink-600 hover:bg-pink-700 text-white'
                   }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      <span>Đang xử lý...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="text-xl mr-3">🛒</span>
                      <span>Đặt hàng ngay ({finalTotal.toLocaleString('vi-VN')}₫)</span>
                    </div>
                  )}
                </button>

                {/* Requirements Notice */}
                {(cartItems.length === 0 || !addressId || !userName.trim() || !userPhone.trim()) && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-white text-xs">⚠</span>
                      </div>
                      <div>
                        <p className="font-semibold text-yellow-800 mb-2 text-sm">Để đặt hàng, bạn cần:</p>
                        <ul className="space-y-1 text-xs text-yellow-700">
                          {cartItems.length === 0 && <li className="flex items-center">• Có sản phẩm trong giỏ hàng</li>}
                          {!addressId && <li className="flex items-center">• Chọn địa chỉ giao hàng</li>}
                          {!userName.trim() && <li className="flex items-center">• Cập nhật tên người dùng</li>}
                          {!userPhone.trim() && <li className="flex items-center">• Cập nhật số điện thoại</li>}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </form>

              {/* Security Notice */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-slate-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm">🔒</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Thanh toán an toàn</p>
                    <p className="text-slate-600 text-xs">Thông tin của bạn được bảo mật 100%</p>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>

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