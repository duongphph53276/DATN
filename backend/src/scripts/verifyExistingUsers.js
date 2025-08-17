// scripts/verifyExistingUsers.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserModel } from '../models/User/user.js';

dotenv.config();

const verifyExistingUsers = async () => {
  try {
    // Kết nối database
    await mongoose.connect(process.env.MONGOS_GOOGLE_CLOUD_URI);
    console.log('✅ Đã kết nối database');

    // Tìm tất cả user chưa được xác thực
    const unverifiedUsers = await UserModel.find({ isVerified: false });
    console.log(`📊 Tìm thấy ${unverifiedUsers.length} user chưa xác thực`);

    if (unverifiedUsers.length === 0) {
      console.log('✅ Tất cả user đã được xác thực');
      return;
    }

    // Cập nhật tất cả user chưa xác thực thành đã xác thực
    const result = await UserModel.updateMany(
      { isVerified: false },
      { 
        $set: { 
          isVerified: true,
          status: 'active' // Đảm bảo status là active
        } 
      }
    );

    console.log(`✅ Đã xác thực ${result.modifiedCount} user thành công`);
    console.log('📝 Danh sách user đã được xác thực:');
    
    // Hiển thị danh sách user đã được xác thực
    const verifiedUsers = await UserModel.find({ isVerified: true }).select('name email role_id');
    verifiedUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email})`);
    });

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Đã ngắt kết nối database');
  }
};

// Chạy script
verifyExistingUsers();
