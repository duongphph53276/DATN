export interface Address {
  _id: string;
  user_id: string;
  street: string;
  city: string;
  postal_code?: string;
  country: string;
  is_default: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  phoneNumber?: string; // Giữ lại để tương thích
  avatar?: string;
  address_id?: string;
  status?: string;
  // Thêm các trường cho tính năng cấm người dùng
  banDuration?: string;
  banReason?: string;
  banUntil?: string | Date;
  createdAt?: string;
  updatedAt?: string;
}