// backend/src/controllers/user/user.js
import { UserModel } from '../../models/User/user.js'; // Điều chỉnh đường dẫn theo cấu trúc dự án
import { RoleModel } from '../../models/User/role.js';
import { RolePermissionModel } from '../../models/User/role_permission.js';
import { PermissionModel } from '../../models/User/permission.js';

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find().populate('role_id address_id').select('-password');
    res.status(200).json({
      status: true,
      message: "Lấy danh sách người dùng thành công",
      data: users
    });
  } catch (error) {
    console.log('Error in UserList:', error);
    res.status(500).json({
      status: false,
      message: "Lỗi server khi lấy danh sách người dùng",
      error: error.message
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    let userId;
    
    // Nếu có req.params.id (cho /admin/users/:id), lấy id từ params
    if (req.params.id) {
      userId = req.params.id;
    } else {
      // Nếu không có req.params.id (cho /api/user), lấy id từ token
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "Không có token" });
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    }

    const user = await UserModel.findById(userId).populate('role_id address_id').select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Trả về dữ liệu tối giản cho /api/user, đầy đủ cho /admin/users/:id
    const responseData = req.params.id
      ? user // Trả về toàn bộ thông tin (trừ password) cho admin
      : {
          name: user.name || "User",
          avatar: user.avatar || "/default-avatar.png",
        }; // Chỉ trả name và avatar cho người dùng hiện tại

    res.status(200).json({
      status: true,
      message: "Lấy thông tin người dùng thành công",
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Lỗi server khi lấy thông tin người dùng",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { role_id, status } = req.body;
  try {
    const user = await UserModel.findByIdAndUpdate(
      id,
      { role_id, status, updated_at: Date.now() },
      { new: true, runValidators: true }
    ).populate('role_id address_id');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lấy thông tin user với role và permissions
export const getUserWithPermissions = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ token
    
    const user = await UserModel.findById(userId)
      .populate('role_id', 'name description');
    
    if (!user) {
      return res.status(404).json({ message: 'User không tồn tại' });
    }
    
    // Lấy permissions của role
    let permissions = [];
    if (user.role_id) {
      const rolePermissions = await RolePermissionModel.find({ role_id: user.role_id._id })
        .populate('permission_id', 'name description');
      
      permissions = rolePermissions.map(rp => rp.permission_id);
    }
    
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        status: user.status,
        role: user.role_id
      },
      permissions: permissions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kiểm tra quyền của user
export const checkUserPermission = async (req, res) => {
  try {
    const { permissionName } = req.params;
    const userId = req.user.id;
    
    const user = await UserModel.findById(userId).populate('role_id');
    
    if (!user || !user.role_id) {
      return res.json({ hasPermission: false });
    }
    
    const rolePermission = await RolePermissionModel.findOne({
      role_id: user.role_id._id,
      'permission_id': await PermissionModel.findOne({ name: permissionName })
    });
    
    res.json({ hasPermission: !!rolePermission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};