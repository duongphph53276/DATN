import axios from 'axios';

interface UpdateVariantResponse {
  status: number;
  data: {
    isAvailable?: boolean;
    availableQuantity?: number;
    message?: string;
  };
}

export const updateVariantQuantity = async (variantId: string, quantity: number, action: 'check' | 'deduct'): Promise<UpdateVariantResponse> => {
  try {
    const response = await axios.post('http://localhost:5000/product-variants/update-quantity', {
      variantId,
      quantity,
      action,
    });
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật số lượng sản phẩm');
  }
};