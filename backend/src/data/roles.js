import { RoleModel } from '../models/User/role.js';
import { RolePermissionModel } from '../models/User/role_permission.js';
import { PermissionModel } from '../models/User/permission.js';

export const createDefaultRoles = async () => {
  try {
    // Tạo role admin nếu chưa có
    let adminRole = await RoleModel.findOne({ name: 'admin' });
    if (!adminRole) {
      adminRole = await RoleModel.create({
        name: 'admin',
        description: 'Quản trị viên hệ thống'
      });
      console.log('Created admin role');
    }

    // Tạo role employee nếu chưa có
    let employeeRole = await RoleModel.findOne({ name: 'employee' });
    if (!employeeRole) {
      employeeRole = await RoleModel.create({
        name: 'employee',
        description: 'Nhân viên'
      });
      console.log('Created employee role');
    }

    // Tạo role shipper nếu chưa có
    let shipperRole = await RoleModel.findOne({ name: 'shipper' });
    if (!shipperRole) {
      shipperRole = await RoleModel.create({
        name: 'shipper',
        description: 'Người giao hàng'
      });
      console.log('Created shipper role');
    }

    // Gán tất cả permissions cho admin
    const allPermissions = await PermissionModel.find();
    for (const permission of allPermissions) {
      const existingAdminPermission = await RolePermissionModel.findOne({
        role_id: adminRole._id,
        permission_id: permission._id
      });
      
      if (!existingAdminPermission) {
        await RolePermissionModel.create({
          role_id: adminRole._id,
          permission_id: permission._id
        });
      }
    }

    // Gán permissions cho employee
    const employeePermissions = [
      'view_categories',
      'create_category',
      'edit_category',
      'view_products',
      'create_product',
      'edit_product',
      'view_attributes',
      'create_attribute',
      'edit_attribute',
      'view_orders',
      'edit_order',
      'assign_shipper',
      'view_vouchers',
      'create_voucher',
      'edit_voucher',
      'view_shipping',
      'edit_shipping',
      'view_dashboard',
      'view_statistics',
      'view_reports'
    ];

    for (const permissionName of employeePermissions) {
      const permission = await PermissionModel.findOne({ name: permissionName });
      if (permission) {
        const existingEmployeePermission = await RolePermissionModel.findOne({
          role_id: employeeRole._id,
          permission_id: permission._id
        });
        
        if (!existingEmployeePermission) {
          await RolePermissionModel.create({
            role_id: employeeRole._id,
            permission_id: permission._id
          });
        }
      }
    }

    // Gán permissions cho shipper
    const shipperPermissions = [
      'view_shipper_orders',
      'update_delivery_status',
      'view_orders'
    ];

    for (const permissionName of shipperPermissions) {
      const permission = await PermissionModel.findOne({ name: permissionName });
      if (permission) {
        const existingShipperPermission = await RolePermissionModel.findOne({
          role_id: shipperRole._id,
          permission_id: permission._id
        });
        
        if (!existingShipperPermission) {
          await RolePermissionModel.create({
            role_id: shipperRole._id,
            permission_id: permission._id
          });
        }
      }
    }

    console.log('Default roles and permissions created successfully');
  } catch (error) {
    console.error('Error creating default roles:', error);
  }
}; 