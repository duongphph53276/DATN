export const paymentMethods = [
  "credit_card",
  "debit_card",
  "bank_transfer",
  "e_wallet",
  "cod",
];

export const statuses = [
  "pending",
  "preparing",
  "shipping",
  "delivered",
  "cancelled",
];
export const Vnp_Response = {
  SUSPICIOUS_TRANSACTION: '07',
  NOT_REGISTERED_EBANKING: '09',
  INVALID_OTP: '13',
  USER_CANCELLED: '24',
  INSUFFICIENT_FUNDS: '51',
  EXCEED_LIMIT: '65',
  BANK_MAINTENANCE: '75',
  OTP_RETRY_EXCEEDED: '79',
  OTHER_ERRORS: '99',
  PAYMENT_SUCCESS: '00',
};
export const statusOptions = ['pending', 'preparing', 'shipping', 'delivered', 'cancelled'] as const

// Mapping trạng thái từ tiếng Anh sang tiếng Việt
export const statusVietnamese: Record<string, string> = {
  "pending": "Chờ xử lý",
  "preparing": "Đang chuẩn bị", 
  "processing": "Đang xử lý",
  "shipping": "Đang giao hàng",
  "delivered": "Đã giao",
  "cancelled": "Đã hủy"
};

// Mapping ngược từ tiếng Việt sang tiếng Anh (nếu cần)
export const statusEnglish: Record<string, string> = {
  "Chờ xử lý": "pending",
  "Đang chuẩn bị": "preparing",
  "Đang xử lý": "processing", 
  "Đang giao hàng": "shipping",
  "Đã giao": "delivered",
  "Đã hủy": "cancelled"
};

// Helper function để lấy text tiếng Việt
export const getVietnameseStatus = (status: string): string => {
  return statusVietnamese[status] || status;
};

// Mapping phương thức thanh toán
export const paymentMethodVietnamese: Record<string, string> = {
  "credit_card": "Thẻ tín dụng",
  "debit_card": "Thẻ ghi nợ",
  "bank_transfer": "Chuyển khoản ngân hàng",
  "e_wallet": "Ví điện tử",
  "cod": "Thanh toán khi nhận hàng"
};