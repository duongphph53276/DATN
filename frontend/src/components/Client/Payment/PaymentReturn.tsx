import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PaymentSuccess from './PaymentSuccess';
import PaymentFailed from './PaymentFailed'
import { CartItem } from '../../../interfaces/checkout';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { createOrder } from '../../../store/slices/orderSlice';
import { Vnp_Response } from '../../../utils/constant';
import { loadUserCart, clearUserCart } from '../../../utils/cartUtils';

const getErrorMessage = (responseCode: string): string => {
  switch (responseCode) {
    case Vnp_Response.SUSPICIOUS_TRANSACTION:
      return 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).';
    case Vnp_Response.NOT_REGISTERED_EBANKING:
      return 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking (Ebanking)';
    case Vnp_Response.INVALID_OTP:
      return 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.';
    case '24':
      return 'Giao dịch không thành công do: Khách hàng hủy giao dịch';
    case '51':
      return 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.';
    case '65':
      return 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức cho phép.';
    case '75':
      return 'Ngân hàng thanh toán đang bảo trì.';
    case '79':
      return 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch.';
    case '99':
      return 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)';
    default:
      return 'Giao dịch không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ.';
  }
};

function PaymentReturn() {
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [params,setParams] = useState<any>(null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const allParams: Record<string, string> = {};

    queryParams.forEach((value, key) => {
      allParams[key] = value;
    });

    setPaymentStatus(allParams.vnp_ResponseCode);
    setParams(allParams); 

    const processedPayment = sessionStorage.getItem('processedPayment');
    if (processedPayment === location.search) {
      return;
    }

    try {
      const userCartItems = loadUserCart();
      setCartItems(userCartItems);
    } catch (error) {
      console.error('Lỗi khi tải giỏ hàng của user:', error);
    }

  }, [location.search]);

  useEffect(() => {
    if (cartItems.length === 0) return;

    const queryParams = new URLSearchParams(location.search);
    const allParams: Record<string, string> = {};

    const voucherAplly = JSON.parse(localStorage.getItem('appliedDiscount') || '{}');
    queryParams.forEach((value, key) => {
      allParams[key] = value;
    });

    const processedPayment = sessionStorage.getItem('processedPayment');
    if (processedPayment === location.search) {
      return;
    }
    
    if (allParams.vnp_ResponseCode === Vnp_Response.PAYMENT_SUCCESS) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const orderData = {
        user_id: user.id,
        address_id: localStorage.getItem('address_id'),
        order_details: cartItems.map((item) => ({
          product_id: item.variant?.product_id,
          variant_id: item.variant?._id || null,
          name: item.name,
          price: item.variant?.price || item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        total_amount: Number(allParams.vnp_Amount) / 100,
        payment_method: "VNPAY",
        voucher_id: voucherAplly._id || null,
        status: 'preparing',
        quantity: cartItems.reduce((total, item) => total + item.quantity, 0),
      };

      if (orderData && orderData.user_id && orderData.address_id) {
        dispatch(createOrder(orderData));
        
        // Clear user cart instead of old 'cart' key
        clearUserCart();
        localStorage.removeItem('appliedDiscount');

        sessionStorage.setItem('processedPayment', location.search);
      }
    }
  }, [cartItems, location.search]);

  return (
    <div>
      {paymentStatus === Vnp_Response.PAYMENT_SUCCESS ? (
        <PaymentSuccess 
          amount={params?.vnp_Amount ? Number(params.vnp_Amount) / 100 : 0}
          orderId={params?.vnp_TxnRef || 'N/A'}
          transactionId={params?.vnp_TransactionNo || 'N/A'}
          bankCode={params?.vnp_BankCode || 'N/A'}
          paymentTime={params?.vnp_PayDate || 'N/A'}
        />
      ) : (
        <PaymentFailed 
          amount={params?.vnp_Amount ? Number(params.vnp_Amount) / 100 : 0}
          orderId={params?.vnp_TxnRef || 'N/A'}
          errorCode={params?.vnp_ResponseCode || 'N/A'}
          errorMessage={getErrorMessage(params?.vnp_ResponseCode)}
        />
      )}
    </div>
  );
}

export default PaymentReturn;
