import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import { createDefaultRoles } from '../data/roles.js';

// Load environment variables
dotenv.config();

const setupRoles = async () => {
  try {
    console.log('🔄 Bắt đầu setup roles và permissions...');
    
    // Kết nối database
    await connectDB();
    
    // Tạo roles và gán permissions
    await createDefaultRoles();
    
    console.log('🎉 Hoàn thành setup roles và permissions!');
    console.log('📋 Các roles đã được tạo:');
    console.log('   👑 Admin - Có tất cả permissions');
    console.log('   👨‍💼 Employee - Có permissions quản lý sản phẩm, đơn hàng, v.v.');
    console.log('   🚚 Shipper - Có permissions giao hàng');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi setup roles:', error);
    process.exit(1);
  }
};

setupRoles();
