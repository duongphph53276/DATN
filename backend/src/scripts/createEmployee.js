import { UserModel } from '../models/User/user.js';
import { RoleModel } from '../models/User/role.js';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';

const createEmployeeUser = async () => {
  try {
    await connectDB();
    
    // Tìm role employee
    const employeeRole = await RoleModel.findOne({ name: 'employee' });
    if (!employeeRole) {
      console.log('Employee role not found. Please run the server first to create default roles.');
      return;
    }
    
    // Kiểm tra xem user employee đã tồn tại chưa
    const existingEmployee = await UserModel.findOne({ email: 'employee@example.com' });
    if (existingEmployee) {
      console.log('Employee user already exists');
      return;
    }
    
    // Tạo user employee
    const hashedPassword = await bcrypt.hash('employee123', 10);
    const employeeUser = new UserModel({
      name: 'Employee User',
      email: 'employee@example.com',
      password: hashedPassword,
      role_id: employeeRole._id,
      phone: '0123456789',
      status: 'active'
    });
    
    await employeeUser.save();
    console.log('Employee user created successfully:');
    console.log('Email: employee@example.com');
    console.log('Password: employee123');
    console.log('Role: employee');
    
  } catch (error) {
    console.error('Error creating employee user:', error);
  } finally {
    process.exit(0);
  }
};

createEmployeeUser(); 