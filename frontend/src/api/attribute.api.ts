import instance from "./instance"; // axios instance đã cấu hình sẵn

// Lấy tất cả thuộc tính
export const getAllAttributes = () => {
  return instance.get("/attribute");
};

// Tạo mới thuộc tính
export const createAttribute = (data: {
  name: string;
  display_name: string;
  type?: "text" | "boolean" | "number" | "select";
}) => {
  return instance.post("/attribute", data);
};

// Lấy attribute theo ID
export const getAttributeById = (id: string) => {
  return instance.get(`/attribute/${id}`);
};
