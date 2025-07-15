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
export const statusOptions = ['pending', 'preparing', 'shipping', 'delivered', 'cancelled'] as const
