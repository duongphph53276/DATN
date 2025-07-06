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
    const permission = await PermissionModel.findByIdAndDelete(req.params.id);
    if (!permission) return res.status(404).json({ message: 'Permission not found' });
    await RolePermissionModel.deleteMany({ permission_id: req.params.id }); // Xóa mối quan hệ
    res.status(200).json({ message: 'Permission deleted successfully' });
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