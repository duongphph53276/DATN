import { IProduct } from "../interface";
import instance from "./instance";

// Lấy danh sách tất cả sản phẩm
export const getAllProducts = () => {
  return instance.get("/product");
};

// Lấy chi tiết sản phẩm theo ID
export const getProductById = (id: string | number) => {
  return instance.get(`/product/${id}`);
};

// Thêm mới sản phẩm
export const postProduct = (data: IProduct) => {
  return instance.post('/product/add', data);
};

// Cập nhật sản phẩm theo ID
export const putProduct = (id: string | number, data: IProduct) => {
  return instance.put(`/product/${id}`, data);
};

// Xóa sản phẩm theo ID
export const deleteProduct = (id: string | number ) => {
  return instance.delete(`/product/${id}`);
};
