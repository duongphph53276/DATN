import dotenv from 'dotenv';
import { createDefaultRoles } from '../data/roles.js';
import connectDB from '../config/db.js';

// Load environment variables
dotenv.config();

const setupRoles = async () => {
  try {
    await connectDB();
    console.log('🔄 Đang setup roles và permissions...\n');
    
    await createDefaultRoles();
    
    console.log('\n✅ Hoàn thành setup roles và permissions!');
    console.log('💡 Bây giờ bạn có thể đăng nhập và sử dụng hệ thống.');
    
  } catch (error) {
    console.error('❌ Lỗi khi setup roles:', error);
  } finally {
    process.exit(0);
  }
};

setupRoles();
