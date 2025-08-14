// scripts/checkUserStatus.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserModel } from '../models/User/user.js';
import { RoleModel } from '../models/User/role.js';

dotenv.config();

const checkUserStatus = async () => {
  try {
    // Kết nối database
    await mongoose.connect(process.env.MONGOS_GOOGLE_CLOUD_URI);
    console.log('✅ Đã kết nối database');

    // Tìm user employee@gmail.com
    const user = await UserModel.findOne({ email: 'employee@gmail.com' }).populate('role_id');
    
    if (!user) {
      console.log('❌ Không tìm thấy user employee@gmail.com');
      return;
    }

    console.log('📋 Thông tin user employee@gmail.com:');
    console.log(`   - Tên: ${user.name}`);
    console.log(`   - Email: ${user.email}`);
    console.log(`   - Role: ${user.role_id?.name || 'Không có role'}`);
    console.log(`   - isVerified: ${user.isVerified}`);
    console.log(`   - Status: ${user.status}`);
    console.log(`   - Ngày tạo: ${user.createdAt}`);

    // Nếu chưa xác thực, xác thực luôn
    if (!user.isVerified) {
      console.log('🔄 Đang xác thực user...');
      user.isVerified = true;
      user.status = 'active';
      await user.save();
      console.log('✅ Đã xác thực user employee@gmail.com thành công');
    } else {
      console.log('✅ User đã được xác thực');
    }

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Đã ngắt kết nối database');
  }
};

// Chạy script
checkUserStatus();
