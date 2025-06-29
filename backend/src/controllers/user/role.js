import { RoleModel } from '../../models/User/role.js'; // Điều chỉnh đường dẫn theo cấu trúc dự án

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
