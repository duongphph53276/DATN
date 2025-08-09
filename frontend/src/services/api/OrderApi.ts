import { GetOrderParams, orderUpdateStatusData } from "../../interfaces/orderApi";
import api from "../../middleware/axios";

const URL = "orders";

export const getAllOrderClient = async (params: GetOrderParams) => {
  const response = await api.get(URL, { params });
  return response.data;
};
export const updateOrderStatus = async (data: orderUpdateStatusData) => {
  const requestBody: any = { status: data.order_status };
  
  // Nếu có shipper_id, thêm vào request body
  if (data.shipper_id) {
    requestBody.shipper_id = data.shipper_id;
  }
  
  // Nếu có cancel_reason, thêm vào request body
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
