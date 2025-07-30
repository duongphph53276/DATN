import { UserModel } from '../models/User/user.js';
import { RoleModel } from '../models/User/role.js';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';

const createAdminUser = async () => {
  try {
    await connectDB();
    
    // Tìm role admin
    const adminRole = await RoleModel.findOne({ name: 'admin' });
    if (!adminRole) {
      console.log('Admin role not found. Please run the server first to create default roles.');
      return;
    }
    
    // Kiểm tra xem user admin đã tồn tại chưa
    const existingAdmin = await UserModel.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }
    
    // Tạo user admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new UserModel({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role_id: adminRole._id,
      phone: '0987654321',
      status: 'active'
    });
    
    await adminUser.save();
    console.log('Admin user created successfully:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
};

createAdminUser(); 