import { PermissionModel } from '../models/User/permission.js';

export const defaultPermissions = [
  // Admin-only permissions (chỉ dành cho admin)
  { name: 'view_users', description: 'Xem danh sách người dùng' },
  { name: 'create_user', description: 'Tạo người dùng mới' },
  { name: 'edit_user', description: 'Chỉnh sửa thông tin người dùng' },
  { name: 'delete_user', description: 'Xóa người dùng' },
  { name: 'view_roles', description: 'Xem danh sách vai trò' },
  { name: 'create_role', description: 'Tạo vai trò mới' },
  { name: 'edit_role', description: 'Chỉnh sửa vai trò' },
  { name: 'delete_role', description: 'Xóa vai trò' },
  { name: 'view_permissions', description: 'Xem danh sách quyền' },
  { name: 'create_permission', description: 'Tạo quyền mới' },
  { name: 'edit_permission', description: 'Chỉnh sửa quyền' },
  { name: 'delete_permission', description: 'Xóa quyền' },
  { name: 'assign_permission', description: 'Gán quyền cho vai trò' },
  { name: 'delete_category', description: 'Xóa danh mục' },
  { name: 'delete_product', description: 'Xóa sản phẩm' },
  { name: 'delete_attribute', description: 'Xóa thuộc tính' },
  { name: 'delete_order', description: 'Xóa đơn hàng' },
  { name: 'delete_voucher', description: 'Xóa mã giảm giá' },

  // Category permissions (cho employee)
  { name: 'view_categories', description: 'Xem danh sách danh mục' },
  { name: 'create_category', description: 'Tạo danh mục mới' },
  { name: 'edit_category', description: 'Chỉnh sửa danh mục' },

  // Product permissions (cho employee)
  { name: 'view_products', description: 'Xem danh sách sản phẩm' },
  { name: 'create_product', description: 'Tạo sản phẩm mới' },
  { name: 'edit_product', description: 'Chỉnh sửa sản phẩm' },

  // Attribute permissions (cho employee)
  { name: 'view_attributes', description: 'Xem danh sách thuộc tính' },
  { name: 'create_attribute', description: 'Tạo thuộc tính mới' },
  { name: 'edit_attribute', description: 'Chỉnh sửa thuộc tính' },

  // Order permissions (cho employee và shipper)
  { name: 'view_orders', description: 'Xem danh sách đơn hàng' },
  { name: 'edit_order', description: 'Chỉnh sửa đơn hàng' },
  { name: 'assign_shipper', description: 'Gán đơn hàng cho shipper' },
  { name: 'view_shipper_orders', description: 'Xem đơn hàng được giao (dành cho shipper)' },
  { name: 'update_delivery_status', description: 'Cập nhật trạng thái giao hàng' },

  // Voucher permissions (cho employee)
  { name: 'view_vouchers', description: 'Xem danh sách mã giảm giá' },
  { name: 'create_voucher', description: 'Tạo mã giảm giá mới' },
  { name: 'edit_voucher', description: 'Chỉnh sửa mã giảm giá' },

  // Shipping permissions (cho employee)
  { name: 'view_shipping', description: 'Xem vận chuyển' },
  { name: 'edit_shipping', description: 'Chỉnh sửa vận chuyển' },

  // Dashboard permissions (cho employee)
  { name: 'view_dashboard', description: 'Xem bảng điều khiển' },
  { name: 'view_statistics', description: 'Xem thống kê' },
  { name: 'view_reports', description: 'Xem báo cáo' }
];

export const createDefaultPermissions = async () => {
  try {
    for (const permission of defaultPermissions) {
      const existingPermission = await PermissionModel.findOne({ name: permission.name });
      if (!existingPermission) {
        await PermissionModel.create(permission);
        console.log(`Created permission: ${permission.name}`);
      }
    }
    console.log('Default permissions created successfully');
  } catch (error) {
    console.error('Error creating default permissions:', error);
  }
}; 