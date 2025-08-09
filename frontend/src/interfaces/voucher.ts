// Voucher
export interface IVoucher {
  description: any;
  _id?: string;
  code: string;
  discount_type: 'percentage' | 'fixed'; // dùng discount_type như BE mới
  value: number;
  start_date: string; // ISO string
  end_date: string;   // ISO string
  quantity: number;
  used_quantity?: number;
  is_active?: boolean;
  min_order_value?: number;
  max_user_number?: number;
  applicable_products?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Responses
export interface IVoucherResponse {
  message: string;
  status: boolean;
  data: IVoucher[];
}

export interface ISingleVoucherResponse {
  message: string;
  status: boolean;
  data: IVoucher;
}

// Requests
export type IAddVoucherRequest = Pick<
  IVoucher,
  'code' | 'discount_type' | 'value' | 'start_date' | 'end_date'
>;

export type IEditVoucherRequest = Pick<
  IVoucher,
  'code' | 'value' | 'start_date' | 'end_date'
>;

// Error
export interface IErrorResponse {
  message: string;
  status: boolean;
  error: string;
}
