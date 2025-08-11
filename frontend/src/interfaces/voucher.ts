// Voucher Interface
export interface IVoucher {
  type: string;
  _id: string; // ID tự động tạo từ MongoDB (bây giờ là bắt buộc)
  code: string; // Mã voucher, bắt buộc
  discount_type: 'percentage' | 'fixed'; // Loại giảm giá, bắt buộc
  value: number; // Giá trị giảm, bắt buộc
  start_date: string; // Ngày bắt đầu, chuỗi ISO, bắt buộc
  end_date: string; // Ngày kết thúc, chuỗi ISO, bắt buộc
  quantity: number; // Số lượng, bắt buộc
  used_quantity?: number; // Số lượng đã dùng, tùy chọn
  is_active?: boolean; // Trạng thái hoạt động, tùy chọn
  min_order_value?: number; // Giá trị đơn hàng tối thiểu, tùy chọn
  max_user_number?: number; // Số người dùng tối đa, tùy chọn
  applicable_products?: string[]; // Danh sách ID sản phẩm áp dụng, tùy chọn
  description?: string; // Mô tả, tùy chọn
  usage_limit_per_user?: number; // Giới hạn sử dụng mỗi người dùng, tùy chọn
  createdAt?: string; // Thời gian tạo, tự động từ server
  updatedAt?: string; // Thời gian cập nhật, tự động từ server
}

// Responses
export interface IVoucherResponse {
  message: string; // Thông báo từ server
  status: boolean; // Trạng thái thành công/thất bại
  data: IVoucher[]; // Danh sách voucher
  total?: number; // Tổng số voucher (tùy chọn, cho phân trang)
  page?: number; // Trang hiện tại (tùy chọn, cho phân trang)
  limit?: number; // Số lượng mỗi trang (tùy chọn, cho phân trang)
}

export interface ISingleVoucherResponse {
  message: string; // Thông báo từ server
  status: boolean; // Trạng thái thành công/thất bại
  data: IVoucher; // Thông tin chi tiết voucher
}

// Requests
export type IAddVoucherRequest = Pick<
  IVoucher,
  'code' | 'discount_type' | 'value' | 'start_date' | 'end_date' | 'quantity' | 'min_order_value' | 'max_user_number' | 'applicable_products' | 'description' | 'usage_limit_per_user'
> & {
  // Đảm bảo các trường tùy chọn có giá trị mặc định nếu không điền
  min_order_value?: number; // Tùy chọn, mặc định 0 nếu không cung cấp
  max_user_number?: number; // Tùy chọn, mặc định 0 nếu không cung cấp
  applicable_products?: string[]; // Tùy chọn, mặc định rỗng nếu không cung cấp
  description?: string; // Tùy chọn, mặc định undefined
  usage_limit_per_user?: number; // Tùy chọn, mặc định undefined
};

export type IEditVoucherRequest = Pick<
  IVoucher,
  'code' | 'value' | 'start_date' | 'end_date' | 'quantity' | 'min_order_value' | 'max_user_number' | 'applicable_products' | 'description' | 'usage_limit_per_user' | 'is_active'
> & {
  // Đảm bảo các trường tùy chọn có giá trị mặc định nếu không điền
  min_order_value?: number;
  max_user_number?: number;
  applicable_products?: string[];
  description?: string;
  usage_limit_per_user?: number;
  is_active?: boolean; // Tùy chọn, mặc định false nếu không cung cấp
};

// Extended interface dùng riêng cho form AddVoucher
export interface IExtendedAddVoucherRequest extends Omit<IAddVoucherRequest, 'value' | 'min_order_value'> {
  discount_type: 'percentage' | 'fixed';
  value: string | number; // Cho phép nhập dạng chuỗi để xử lý input
  min_order_value: string | number; // Thêm hỗ trợ string cho min_order_value
  quantity: number;
  max_user_number: number;
  applicable_products: string[];
}

// Extended interface dùng riêng cho form EditVoucher
export interface IExtendedEditVoucherRequest extends Omit<IEditVoucherRequest, 'value' | 'min_order_value'> {
  discount_type: 'percentage' | 'fixed'; // Sử dụng discount_type thay vì type
  value: string | number; // Cho phép string để xử lý input rỗng
  min_order_value: string | number; // Thêm hỗ trợ string cho min_order_value
  quantity: number;
  max_user_number: number;
  applicable_products: string[];
  is_active?: boolean; // Giữ tùy chọn cho is_active
}

// Error
export interface IErrorResponse {
  response?: any; // Làm tùy chọn vì không phải lúc nào cũng có
  message: string; // Thông báo lỗi, bắt buộc
  status: boolean; // Trạng thái thất bại, bắt buộc
  error: string | Record<string, string>; // Lỗi dạng chuỗi hoặc object, bắt buộc
  code?: number; // Mã lỗi, tùy chọn
  timestamp?: string; // Thời gian xảy ra lỗi, tùy chọn
}