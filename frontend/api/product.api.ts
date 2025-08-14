import { IProduct } from "../src/interfaces/product";
import instance from "./instance";

// Lấy danh sách tất cả sản phẩm
export const getAllProducts = () => {
  return instance.get("/product");
};

// Lấy sản phẩm bán chạy
export const getBestSellingProducts = (limit?: number) => {
  const params = limit ? `?limit=${limit}` : '';
  return instance.get(`/products/best-selling${params}`);
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
export const updateProduct = (id: string | number, data: IProduct) => {
  return instance.put(`/product/edit/${id}`, data);
};

// Xóa sản phẩm theo ID
export const deleteProduct = (id: string | number ) => {
  return instance.delete(`/product/${id}`);
};
