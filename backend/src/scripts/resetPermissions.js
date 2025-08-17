import dotenv from 'dotenv';
import { PermissionModel } from '../models/User/permission.js';
import { RolePermissionModel } from '../models/User/role_permission.js';
import { defaultPermissions } from '../data/permissions.js';
import connectDB from '../config/db.js';

// Load environment variables
dotenv.config();

const resetPermissions = async () => {
  try {
    await connectDB();
    console.log('🔄 Đang reset permissions...\n');
    
    // Xóa tất cả role permissions trước
    console.log('🗑️  Đang xóa tất cả role permissions...');
    await RolePermissionModel.deleteMany({});
    console.log('✅ Đã xóa tất cả role permissions');
    
    // Xóa tất cả permissions
    console.log('🗑️  Đang xóa tất cả permissions...');
    await PermissionModel.deleteMany({});
    console.log('✅ Đã xóa tất cả permissions');
    
    // Tạo lại permissions từ default
    console.log('🆕 Đang tạo lại permissions từ default...');
    for (const permission of defaultPermissions) {
      await PermissionModel.create(permission);
      console.log(`   ✅ Created: ${permission.name}`);
    }
    
    const finalPermissions = await PermissionModel.find().sort({ name: 1 });
    console.log(`\n📊 Kết quả: ${finalPermissions.length} permissions đã được tạo:`);
    finalPermissions.forEach((p, index) => {
      console.log(`   ${index + 1}. ${p.name} - ${p.description}`);
    });
    
    console.log('\n✅ Hoàn thành reset permissions!');
    console.log('💡 Lưu ý: Bạn cần chạy lại script tạo roles để gán permissions cho các roles.');
    
  } catch (error) {
    console.error('❌ Lỗi khi reset permissions:', error);
  } finally {
    process.exit(0);
  }
};

resetPermissions();
