import { RoleModel } from '../../models/User/role.js'; // Điều chỉnh đường dẫn theo cấu trúc dự án
import { RolePermissionModel } from '../../models/User/role_permission.js';
import { PermissionModel } from '../../models/User/permission.js';
import { UserModel } from '../../models/User/user.js';

export const createRole = async (req, res) => {
  const { name, description } = req.body;
  try {
    const role = new RoleModel({ name, description });
    await role.save();
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRoles = async (req, res) => {
  try {
    const roles = await RoleModel.find();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const role = await RoleModel.findByIdAndUpdate(
      id,
      { name, description, updated_at: Date.now() },
      { new: true, runValidators: true }
    );
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(200).json(role);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRoleById = async (req, res) => {
  const { id } = req.params;
  try {
    const role = await RoleModel.findById(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả permissions của một role
export const getRolePermissions = async (req, res) => {
  try {
    const { roleId } = req.params;
    
    const rolePermissions = await RolePermissionModel.find({ role_id: roleId })
      .populate('permission_id', 'name description');
    
    const permissions = rolePermissions
      .map(rp => rp.permission_id)
      .filter(permission => permission !== null && permission !== undefined);
    
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Gán permission cho role
export const assignPermissionToRole = async (req, res) => {
  try {
    const { role_id, permission_id } = req.body;
    
    // Kiểm tra xem đã tồn tại chưa
    const existing = await RolePermissionModel.findOne({ role_id, permission_id });
    if (existing) {
      return res.status(400).json({ message: 'Permission đã được gán cho role này' });
    }
    
    const rolePermission = new RolePermissionModel({ role_id, permission_id });
    await rolePermission.save();
    
    res.status(201).json({ message: 'Gán permission thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa permission khỏi role
export const removePermissionFromRole = async (req, res) => {
  try {
    const { role_id, permission_id } = req.params;
    
    await RolePermissionModel.findOneAndDelete({ role_id, permission_id });
    
    res.json({ message: 'Xóa permission thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả permissions có thể gán cho role
export const getAvailablePermissions = async (req, res) => {
  try {
    const { roleId } = req.params;
    
    // Lấy tất cả permissions
    const allPermissions = await PermissionModel.find();
    
    // Lấy permissions đã được gán cho role
    const assignedPermissions = await RolePermissionModel.find({ role_id: roleId })
      .populate('permission_id', '_id');
    
    const assignedIds = assignedPermissions
      .filter(ap => ap.permission_id && ap.permission_id._id)
      .map(ap => ap.permission_id._id.toString());
    
    // Lọc ra permissions chưa được gán
    const availablePermissions = allPermissions.filter(permission => 
      !assignedIds.includes(permission._id.toString())
    );
    
    res.json(availablePermissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa role
export const deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    // Kiểm tra xem role có tồn tại không
    const role = await RoleModel.findById(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Kiểm tra xem có user nào đang sử dụng role này không
    const usersWithRole = await UserModel.find({ role_id: id });
    
    if (usersWithRole.length > 0) {
      return res.status(400).json({ 
        message: `Không thể xóa role này vì có ${usersWithRole.length} người dùng đang sử dụng` 
      });
    }

    // Xóa tất cả role permissions liên quan
    await RolePermissionModel.deleteMany({ role_id: id });
    
    // Xóa role
    await RoleModel.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
