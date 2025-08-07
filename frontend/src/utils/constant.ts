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
