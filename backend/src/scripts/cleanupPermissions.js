import { PermissionModel } from '../models/User/permission.js';
import { RolePermissionModel } from '../models/User/role_permission.js';
import connectDB from '../config/db.js';

const cleanupPermissions = async () => {
  try {
    await connectDB();
    console.log('🔍 Đang kiểm tra permissions trong database...\n');

    // Lấy tất cả permissions
    const allPermissions = await PermissionModel.find().sort({ name: 1 });
    console.log(`📊 Tổng số permissions trong database: ${allPermissions.length}\n`);

    // Kiểm tra permissions trùng lặp
    const permissionNames = allPermissions.map(p => p.name);
    const duplicates = permissionNames.filter((name, index) => permissionNames.indexOf(name) !== index);
    const uniqueDuplicates = [...new Set(duplicates)];

    if (uniqueDuplicates.length > 0) {
      console.log('⚠️  Tìm thấy permissions trùng lặp:');
      uniqueDuplicates.forEach(name => {
        const dupes = allPermissions.filter(p => p.name === name);
        console.log(`   - "${name}": ${dupes.length} bản sao`);
        dupes.forEach((p, i) => {
          console.log(`     ${i + 1}. ID: ${p._id}, Created: ${p.createdAt}`);
        });
      });
      console.log('');

      // Xóa permissions trùng lặp (giữ lại bản đầu tiên)
      for (const duplicateName of uniqueDuplicates) {
        const dupes = allPermissions.filter(p => p.name === duplicateName);
        const toKeep = dupes[0]; // Giữ lại bản đầu tiên
        const toDelete = dupes.slice(1); // Xóa các bản còn lại

        console.log(`🗑️  Đang xóa ${toDelete.length} bản sao của "${duplicateName}":`);
        
        for (const permission of toDelete) {
          // Kiểm tra xem permission này có được sử dụng trong role_permissions không
          const rolePermissions = await RolePermissionModel.find({ permission_id: permission._id });
          
          if (rolePermissions.length > 0) {
            console.log(`   ⚠️  Permission ID ${permission._id} đang được sử dụng trong ${rolePermissions.length} role. Chuyển sang permission gốc...`);
            
            // Chuyển tất cả role_permissions sang permission gốc
            for (const rp of rolePermissions) {
              const existingRP = await RolePermissionModel.findOne({
                role_id: rp.role_id,
                permission_id: toKeep._id
              });
              
              if (!existingRP) {
                rp.permission_id = toKeep._id;
                await rp.save();
              } else {
                // Nếu đã tồn tại, xóa bản trùng lặp
                await RolePermissionModel.findByIdAndDelete(rp._id);
              }
            }
          }
          
          // Xóa permission trùng lặp
          await PermissionModel.findByIdAndDelete(permission._id);
          console.log(`   ✅ Đã xóa permission ID: ${permission._id}`);
        }
      }
    } else {
      console.log('✅ Không tìm thấy permissions trùng lặp!');
    }

    // Kiểm tra permissions không hợp lệ (null hoặc empty name)
    const invalidPermissions = allPermissions.filter(p => !p.name || p.name.trim() === '');
    if (invalidPermissions.length > 0) {
      console.log(`\n⚠️  Tìm thấy ${invalidPermissions.length} permissions không hợp lệ:`);
      invalidPermissions.forEach(p => {
        console.log(`   - ID: ${p._id}, Name: "${p.name}"`);
      });
      
      // Xóa permissions không hợp lệ
      for (const permission of invalidPermissions) {
        await RolePermissionModel.deleteMany({ permission_id: permission._id });
        await PermissionModel.findByIdAndDelete(permission._id);
        console.log(`   ✅ Đã xóa permission không hợp lệ ID: ${permission._id}`);
      }
    }

    // Hiển thị danh sách permissions cuối cùng
    const finalPermissions = await PermissionModel.find().sort({ name: 1 });
    console.log(`\n📋 Danh sách permissions sau khi dọn dẹp (${finalPermissions.length} permissions):`);
    finalPermissions.forEach((p, index) => {
      console.log(`   ${index + 1}. ${p.name} - ${p.description}`);
    });

    console.log('\n✅ Hoàn thành dọn dẹp permissions!');

  } catch (error) {
    console.error('❌ Lỗi khi dọn dẹp permissions:', error);
  } finally {
    process.exit(0);
  }
};

cleanupPermissions();
