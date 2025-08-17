import { PermissionModel } from '../../models/User/permission.js'; // Thêm 'User/'
import { RolePermissionModel } from '../../models/User/role_permission.js'; // Thêm 'User/'

// Create a new permission
export const createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;
    const permission = new PermissionModel({ name, description });
    const savedPermission = await permission.save();
    res.status(201).json(savedPermission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all permissions
export const getPermissions = async (req, res) => {
  try {
    const permissions = await PermissionModel.find();
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get permission by ID
export const getPermissionById = async (req, res) => {
  try {
    const permission = await PermissionModel.findById(req.params.id);
    if (!permission) return res.status(404).json({ message: 'Permission not found' });
    res.status(200).json(permission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update permission
export const updatePermission = async (req, res) => {
  try {
    const { name, description } = req.body;
    const permission = await PermissionModel.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );
    if (!permission) return res.status(404).json({ message: 'Permission not found' });
    res.status(200).json(permission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete permission
export const deletePermission = async (req, res) => {
  try {
    const permission = await PermissionModel.findById(req.params.id);
    if (!permission) return res.status(404).json({ message: 'Permission not found' });

    // Kiểm tra xem có permission khác cùng tên không (để chuyển role permissions)
    const duplicatePermission = await PermissionModel.findOne({ 
      name: permission.name, 
      _id: { $ne: req.params.id } 
    });

    if (duplicatePermission) {
      // Nếu có permission trùng lặp, chuyển tất cả role permissions sang permission gốc
      const rolePermissions = await RolePermissionModel.find({ permission_id: req.params.id });
      
      for (const rp of rolePermissions) {
        // Kiểm tra xem role đã có permission gốc chưa
        const existingRP = await RolePermissionModel.findOne({
          role_id: rp.role_id,
          permission_id: duplicatePermission._id
        });
        
        if (!existingRP) {
          // Chuyển sang permission gốc
          rp.permission_id = duplicatePermission._id;
          await rp.save();
        } else {
          // Nếu đã có, xóa bản trùng lặp
          await RolePermissionModel.findByIdAndDelete(rp._id);
        }
      }
      
      console.log(`Transferred ${rolePermissions.length} role permissions from ${permission.name} to duplicate`);
    }

    // Xóa permission và các role permissions còn lại
    await RolePermissionModel.deleteMany({ permission_id: req.params.id });
    await PermissionModel.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ 
      message: 'Permission deleted successfully',
      transferred: duplicatePermission ? true : false
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign permission to a role
export const assignPermissionToRole = async (req, res) => {
  try {
    const { role_id, permission_id } = req.body;
    const rolePermission = new RolePermissionModel({ role_id, permission_id });
    await rolePermission.save();
    res.status(201).json({ message: 'Permission assigned to role successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};