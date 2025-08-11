type DiscountType = 'percentage' | 'fixed'

interface DiscountResult {
  discount: number
  finalAmount: number
}
/**
 * Convert number to Vietnamese currency format
 * @param amount - The amount to format
 * @param currency - Currency symbol (default: '₫')
 * @returns Formatted currency string
 */
export const formatVietnameseCurrency = (amount: number | string, currency: string = '₫'): string => {
  // Convert to number if it's a string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Check if amount is valid
  if (isNaN(numAmount)) {
    return `0 ${currency}`;
  }
  
  // Format with Vietnamese locale
  return numAmount.toLocaleString('vi-VN') + ` ${currency}`;
};

/**
 * Convert number to Vietnamese currency format with VNĐ
 * @param amount - The amount to format
 * @returns Formatted currency string with VNĐ
 */
export const formatVND = (amount: number | string): string => {
  return formatVietnameseCurrency(amount, 'VNĐ');
};

/**
 * Convert number to Vietnamese currency format with ₫
 * @param amount - The amount to format
 * @returns Formatted currency string with ₫
 */
export const formatVNDSymbol = (amount: number | string): string => {
  return formatVietnameseCurrency(amount, '₫');
};

/**
 * Convert string amount to number (remove currency symbols and commas)
 * @param amountString - The amount string to convert
 * @returns Number value
 */
export const parseVietnameseCurrency = (amountString: string): number => {
  if (!amountString) return 0;
  
  // Remove currency symbols and spaces
  const cleanString = amountString.replace(/[₫VNĐ\s]/g, '');
  
  // Remove commas and convert to number
  const number = parseFloat(cleanString.replace(/,/g, ''));
  
  return isNaN(number) ? 0 : number;
};

export function calculateDiscountedAmount(
  type: DiscountType | undefined,
  value: number,
  amount: number
): DiscountResult {
   console.log( value, amount, type);

  if (typeof value != 'number' || typeof amount != 'number' || amount < 0) {
    throw new Error('Giá trị không hợp lệ')
  }

  if (!type) {
    // Nếu không có type, trả về amount gốc
    return {
      discount: 0,
      finalAmount: amount
    }
  }

  let discount = 0

  switch (type) {
    case 'percentage':
      const percent = Math.min(value, 100)
      discount = (amount * percent) / 100
      break

    case 'fixed':
      discount = Math.min(value, amount)
      break

    default:
      throw new Error('Loại giảm giá không hợp lệ')
  }

  return {
    discount,
    finalAmount: amount - discount
  }
}

