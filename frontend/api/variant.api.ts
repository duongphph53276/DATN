import { IVariant } from "../interfaces/variant";
import instance from "./instance";

// Lấy danh sách tất cả biến thể của một sản phẩm
export const getVariantsByProduct = (productId: string | number) => {
  return instance.get(`/product/${productId}/variants`);
};

// Lấy chi tiết một biến thể theo ID
export const getVariantById = (id: string | number) => {
  return instance.get(`/variant/${id}`);
};

// Thêm mới biến thể cho sản phẩm
export const addVariant = async (data: IVariant) => {
  try {
    const res = await instance.post("/variant/add", data);
    return res.data;
  } catch (err: any) {
    console.error("Lỗi API:", err?.response?.data || err);
    throw err?.response?.data || err;
  }
};

// Cập nhật biến thể
export const updateVariant = (id: string | number, data: IVariant) => {
  return instance.put(`/variant/edit/${id}`, data);
};

// Xóa biến thể
export const deleteVariant = (id: string | number) => {
  return instance.delete(`/variant/${id}`);
};
