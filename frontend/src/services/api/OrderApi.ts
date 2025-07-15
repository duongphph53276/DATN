import { GetOrderParams, orderUpdateStatusData } from "../../interfaces/orderApi";
import api from "../../middleware/axios";

const URL = "orders";

export const getAllOrderClient = async (params: GetOrderParams) => {
  const response = await api.get(URL, { params });
  return response.data;
};
export const updateOrderStatus = async (data: orderUpdateStatusData) => {
  const response = await api.patch(`${URL}/${data._id}/status`, {status:data.order_status});
  return response.data;
};
export const getOrderById = async(id:string)=>{
  const response = await api.get(`${URL}/${id}`);
  return response.data;
}