import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import { PermissionModel } from '../models/User/permission.js';
import { RolePermissionModel } from '../models/User/role_permission.js';
import { defaultPermissions } from '../data/permissions.js';

// Load environment variables
dotenv.config();

const resetPermissions = async () => {
  try {
    console.log('🔄 Bắt đầu reset permissions...');
    
    // Kết nối database
    await connectDB();
    
    // Xóa tất cả role_permissions trước
    console.log('🗑️ Xóa tất cả role_permissions...');
    await RolePermissionModel.deleteMany({});
    console.log('✅ Đã xóa tất cả role_permissions');
    
    // Xóa tất cả permissions cũ
    console.log('🗑️ Xóa tất cả permissions cũ...');
    await PermissionModel.deleteMany({});
    console.log('✅ Đã xóa tất cả permissions cũ');
    
    // Tạo lại permissions mới
    console.log('🆕 Tạo permissions mới...');
    for (const permission of defaultPermissions) {
      await PermissionModel.create(permission);
      console.log(`✅ Đã tạo permission: ${permission.name} - ${permission.description}`);
    }
    
    console.log(`🎉 Hoàn thành! Đã tạo ${defaultPermissions.length} permissions mới`);
    console.log('📋 Danh sách permissions mới:');
    defaultPermissions.forEach((permission, index) => {
      console.log(`${index + 1}. ${permission.name} - ${permission.description}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi reset permissions:', error);
    process.exit(1);
  }
};

resetPermissions();
