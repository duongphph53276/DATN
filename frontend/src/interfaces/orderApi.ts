import { IProduct } from "./product";
import { IVariant } from "./variant";

export interface OrderDetail {
  _id: string;
  order_id: string;
  variant_id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  __v: number;
  product : IProduct,
  variant: IVariant
}

export interface stateOrder {
  _id: string;
  user_id: string;
  status: "pending" | "processing" | "shipping" | "delivered" | "cancelled";
  quantity: number;
  total_amount: number;
  voucher_id: string | null;
  payment_method: "credit_card" | "paypal" | "cash_on_delivery" | string;
  address_id: string;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  __v: number;
  order_details: OrderDetail[];
  voucher: {
    _id: string;
    code: string;
    type: "percentage" | "fixed";
    value: number;
    start_date: string;
    end_date: string;
    quantity: number;
    used_quantity: number;
    is_active: boolean;
    min_order_value: number;
    max_user_number: number;
    applicable_products: string[];
    createdAt: string;
    updatedAt: string;
  };
  address: {
    _id: string;
    user_id: string;
    street: string;
    city: string;
    postal_code: string;
    country: string;
    is_default: boolean;
    createdAt: string;
    updatedAt: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    phoneNumber: string;
    avatar: string;
    address_id: string;
    status: string;
    banDuration: string;
    banReason: string;
    banUntil: string | Date;
    createdAt: string;
    updatedAt: string;
  }
}

export interface Pagination {
  current_page: number;
  total_pages: number;
  total_orders: number;
  per_page: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface OrderState {
  client: {
    orders: stateOrder[];
    pagination: Pagination;
  };
  admin: {
    orders: stateOrder[];
    pagination: Pagination;
  };
  status: "idle" | "loading" | "failed";
}

export interface orderUpdateStatusData {
  _id: string | undefined;
  order_status: string;
  shipper_id?: string;
}

export interface OrderListResponse {
  data: {
    orders: stateOrder[];
    pagination: Pagination;
  };
}
export interface GetOrderPayload {
  id: string;
  params?: GetOrderParams | null;
};

export interface GetOrderParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  user_id?: string;
  status?: string;
  payment_method?: string;
}
