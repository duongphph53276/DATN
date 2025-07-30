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

    // Gán một số permissions cơ bản cho employee
    const employeePermissions = [
      'view_products',
      'view_categories',
      'view_orders',
      'view_vouchers'
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

    console.log('Default roles and permissions created successfully');
  } catch (error) {
    console.error('Error creating default roles:', error);
  }
}; 