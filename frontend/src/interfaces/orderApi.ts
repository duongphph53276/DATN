export interface OrderDetail {
  _id: string;
  order_id: string;
  variant_id: string;
  name: string;
  price: number;
  image: string;
  __v: number;
}

export interface stateOrder {
  _id: string;
  user_id: string;
  status: "pending" | "processing" | "shipping" | "delivered" | "cancelled";
  quantity: number;
  total_amount: number;
  discount_code: string | null;
  payment_method: "credit_card" | "paypal" | "cash_on_delivery" | string;
  address_id: string;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  __v: number;
  order_details: OrderDetail[];
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
  client: stateOrder[];
  admin: {
    orders: stateOrder[];
    pagination: Pagination;
  };
  status: "idle" | "loading" | "failed";
}

export interface orderUpdateStatusData {
  _id: string;
  order_status: string;
}

export interface OrderListResponse {
  data: {
    orders: stateOrder[];
    pagination: Pagination;
  };
}
export interface GetOrderParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  user_id?: string;
  status?: string;
  payment_method?: string;
}
