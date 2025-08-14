import { GetOrderParams, orderUpdateStatusData } from "../../interfaces/orderApi";
import api from "../../middleware/axios";

const URL = "orders";

export const getAllOrderClient = async (params: GetOrderParams) => {
  const response = await api.get(URL, { params });
  return response.data;
};

export const updateOrderStatus = async (data: orderUpdateStatusData) => {
  const requestBody: any = { status: data.order_status };
  
  if (data.shipper_id) {
    requestBody.shipper_id = data.shipper_id;
  }
  
  if (data.cancel_reason) {
    requestBody.cancel_reason = data.cancel_reason;
  }
  
  const response = await api.patch(`${URL}/${data._id}/status`, requestBody);
  return response.data;
};

export const getOrderById = async(id:string)=>{
  const response = await api.get(`${URL}/${id}`);
  return response.data;
}

export const getOrderByUserId = async(id:string,params: GetOrderParams)=>{
  const response = await api.get(`${URL}/user/${id}`, {params});
  return response.data;
}

export const createNewOrder = async(data:any)=>{
  const response = await api.post(URL,data);
  return response.data;
}

export const requestCancelOrder = async (data: { orderId: string; cancel_reason: string; cancel_images?: File[] }) => {
  try {
    const formData = new FormData();
    formData.append('cancel_reason', data.cancel_reason);
    
    if (data.cancel_images && data.cancel_images.length > 0) {
      data.cancel_images.forEach((image) => {
        formData.append('cancel_images', image);
      });
    }

    const response = await api.post(`${URL}/${data.orderId}/request-cancel`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error requesting cancel order:', error);
    throw error;
  }
};

export const requestCancelOrderWithImageUpload = async (data: { orderId: string; cancel_reason: string; cancel_images?: File[], user_id?: string }) => {
  try {
    let imageUrls: string[] = [];
    
    if (data.cancel_images && data.cancel_images.length > 0) {
      const { uploadToCloudinary } = await import('../../lib/cloudinary');
      
      const uploadPromises = data.cancel_images.map(async (image) => {
        try {
          return await uploadToCloudinary(image);
        } catch (uploadError) {
          console.error('Error uploading image to Cloudinary:', uploadError);
          throw new Error('Không thể upload ảnh lên Cloudinary');
        }
      });
      
      imageUrls = await Promise.all(uploadPromises);
    }

    const requestBody = {
      cancel_reason: data.cancel_reason,
      cancel_images: imageUrls,
      user_id: data.user_id
    };

    const response = await api.post(`${URL}/${data.orderId}/request-cancel`, requestBody);
    return response.data;
  } catch (error) {
    console.error('Error requesting cancel order with image upload:', error);
    throw error;
  }
};

export const requestReturnOrderWithImageUpload = async (data: { orderId: string; return_reason: string; return_images?: File[], user_id?: string }) => {
  try {
    let imageUrls: string[] = [];
    
    if (data.return_images && data.return_images.length > 0) {
      const { uploadToCloudinary } = await import('../../lib/cloudinary');
      
      const uploadPromises = data.return_images.map(async (image) => {
        try {
          return await uploadToCloudinary(image);
        } catch (uploadError) {
          console.error('Error uploading image to Cloudinary:', uploadError);
          throw new Error('Không thể upload ảnh lên Cloudinary');
        }
      });
      
      imageUrls = await Promise.all(uploadPromises);
    }

    const requestBody = {
      return_reason: data.return_reason,
      return_images: imageUrls,
      user_id: data.user_id
    };

    const response = await api.post(`${URL}/${data.orderId}/request-return`, requestBody);
    return response.data;
  } catch (error) {
    console.error('Error requesting return order with image upload:', error);
    throw error;
  }
};

export const handleCancelRequest = async (data: { orderId: string; action: 'approve' | 'reject'; admin_note?: string }) => {
  try {
    const requestBody = {
      action: data.action,
      admin_note: data.admin_note
    };

    const response = await api.patch(`${URL}/${data.orderId}/cancel-request`, requestBody);
    return response.data;
  } catch (error) {
    console.error('Error handling cancel request:', error);
    throw error;
  }
};

export const handleReturnRequest = async (data: { orderId: string; action: 'approve' | 'reject'; admin_note?: string }) => {
  try {
    const requestBody = {
      action: data.action,
      admin_note: data.admin_note
    };

    const response = await api.patch(`${URL}/${data.orderId}/return-request`, requestBody);
    return response.data;
  } catch (error) {
    console.error('Error handling return request:', error);
    throw error;
  }
};