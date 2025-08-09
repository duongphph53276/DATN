import mongoose from 'mongoose';
import { RoleModel } from '../models/User/role.js';
import { UserModel } from '../models/User/user.js';
import { PermissionModel } from '../models/User/permission.js';
import { RolePermissionModel } from '../models/User/role_permission.js';
import dotenv from 'dotenv';

dotenv.config();

const checkAndCreateShipperRole = async () => {
  try {
    // Connect to database
    const mongoUri = process.env.MONGOS_GOOGLE_CLOUD_URI || 'mongodb+srv://duongphph53276:haiduong@cluster0.rph2fbb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // 1. Kiểm tra role shipper có tồn tại không
    let shipperRole = await RoleModel.findOne({ name: 'shipper' });
    console.log('Existing shipper role:', shipperRole);

    if (!shipperRole) {
      console.log('Creating shipper role...');
      shipperRole = await RoleModel.create({
        name: 'shipper',
        description: 'Người giao hàng'
      });
      console.log('Shipper role created:', shipperRole);
    }

    // 2. Kiểm tra permissions cho shipper
    const shipperPermissions = ['view_shipper_orders', 'update_delivery_status'];
    
    for (const permissionName of shipperPermissions) {
      const permission = await PermissionModel.findOne({ name: permissionName });
      if (permission) {
        const existingShipperPermission = await RolePermissionModel.findOne({
          role_id: shipperRole._id,
          permission_id: permission._id
        });
        
        if (!existingShipperPermission) {
          await RolePermissionModel.create({
            role_id: shipperRole._id,
            permission_id: permission._id
          });
          console.log(`Assigned permission ${permissionName} to shipper role`);
        } else {
          console.log(`Permission ${permissionName} already assigned to shipper role`);
        }
      } else {
        console.log(`Permission ${permissionName} not found`);
      }
    }

    // 3. Liệt kê tất cả users và roles
    const users = await UserModel.find().populate('role_id').select('name email role_id status');
    console.log('\n=== ALL USERS ===');
    users.forEach(user => {
      console.log(`${user.name} (${user.email}) - Role: ${user.role_id?.name || 'No role'} - Status: ${user.status}`);
    });

    // 4. Liệt kê users có role shipper
    const shippers = await UserModel.find({ role_id: shipperRole._id }).populate('role_id');
    console.log('\n=== USERS WITH SHIPPER ROLE ===');
    if (shippers.length > 0) {
      shippers.forEach(shipper => {
        console.log(`${shipper.name} (${shipper.email}) - Status: ${shipper.status}`);
      });
    } else {
      console.log('No users found with shipper role');
    }

    // 5. Liệt kê tất cả roles
    const roles = await RoleModel.find();
    console.log('\n=== ALL ROLES ===');
    roles.forEach(role => {
      console.log(`${role.name}: ${role.description}`);
    });

    console.log('\n=== SUMMARY ===');
    console.log(`Shipper role ID: ${shipperRole._id}`);
    console.log(`Total users with shipper role: ${shippers.length}`);
    console.log(`Active shippers: ${shippers.filter(s => s.status === 'active').length}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

checkAndCreateShipperRole();
