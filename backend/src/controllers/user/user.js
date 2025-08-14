import { UserModel } from '../../models/User/user.js'; // Điều chỉnh đường dẫn theo cấu trúc dự án
import { RoleModel } from '../../models/User/role.js';
import { RolePermissionModel } from '../../models/User/role_permission.js';
import { PermissionModel } from '../../models/User/permission.js';
import bcrypt from 'bcrypt';

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
  const { 
    email, 
    name, 
    phone, 
    role_id, 
    address_id, 
    avatar, 
    status, 
    password,
    banDuration,
    banReason,
    banUntil
  } = req.body;
  
  try {
    console.log('Update user request:', { id, ...req.body });

    // Kiểm tra xem user có tồn tại không
    const existingUser = await UserModel.findById(id);
    if (!existingUser) {
      return res.status(404).json({ 
        status: false,
        message: 'User not found' 
      });
    }

    // Chuẩn bị dữ liệu cập nhật - chỉ cập nhật các field được gửi lên
    const updateData = {};
    
    if (email !== undefined) updateData.email = email;
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (role_id !== undefined) updateData.role_id = role_id;
    if (address_id !== undefined) updateData.address_id = address_id;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (status !== undefined) updateData.status = status;

    // Chỉ cập nhật password nếu có và không rỗng
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Xử lý thông tin cấm
    if (status === 'block') {
      if (banDuration) updateData.banDuration = banDuration;
      if (banReason) updateData.banReason = banReason;
      if (banUntil) updateData.banUntil = banUntil;
    } else if (status === 'active') {
      // Nếu status là active, xóa thông tin cấm
      updateData.banDuration = null;
      updateData.banReason = null;
      updateData.banUntil = null;
    }

    console.log('Final update data:', updateData);

    const user = await UserModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('role_id address_id').select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        status: false,
        message: 'User not found after update' 
      });
    }
    
    res.status(200).json({
      status: true,
      message: 'Cập nhật người dùng thành công',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(400).json({ 
      status: false,
      message: 'Lỗi khi cập nhật người dùng',
      error: error.message 
    });
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
      
      permissions = rolePermissions
        .map(rp => rp.permission_id)
        .filter(permission => permission !== null && permission !== undefined);
      
      console.log(`Found ${permissions.length} valid permissions for user ${user._id}`);
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

// Đổi mật khẩu
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Kiểm tra dữ liệu đầu vào
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: false,
        message: 'Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới'
      });
    }

    // Kiểm tra độ dài mật khẩu mới
    if (newPassword.length < 6) {
      return res.status(400).json({
        status: false,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
      });
    }

    // Lấy thông tin user
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Kiểm tra mật khẩu hiện tại
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        status: false,
        message: 'Mật khẩu hiện tại không đúng'
      });
    }

    // Kiểm tra mật khẩu mới không được trùng với mật khẩu hiện tại
    const isNewPasswordSame = await bcrypt.compare(newPassword, user.password);
    if (isNewPasswordSame) {
      return res.status(400).json({
        status: false,
        message: 'Mật khẩu mới không được trùng với mật khẩu hiện tại'
      });
    }

    // Hash mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu
    await UserModel.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
      updatedAt: Date.now()
    });

    res.status(200).json({
      status: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Lỗi server khi đổi mật khẩu',
      error: error.message
    });
  }
};

// Lấy thống kê user
export const getUserStatistics = async (req, res) => {
  try {
    const totalUsers = await UserModel.countDocuments();
    
    // Thống kê theo role
    const roleStats = await UserModel.aggregate([
      {
        $lookup: {
          from: 'roles',
          localField: 'role_id',
          foreignField: '_id',
          as: 'role'
        }
      },
      {
        $unwind: {
          path: '$role',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$role._id',
          role_name: { $first: '$role.name' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Thống kê user theo tháng
    const monthlyUserStats = await UserModel.aggregate([
      {
        $match: {
          created_at: {
            $gte: new Date(new Date().getFullYear(), 0, 1) // Từ đầu năm
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$created_at' },
            month: { $month: '$created_at' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Top user có nhiều đơn hàng nhất (nếu có model Order)
    let topActiveUsers = [];
    try {
      const { OrderModel } = await import('../../models/OrderModel.js');
      topActiveUsers = await OrderModel.aggregate([
        {
          $group: {
            _id: '$user_id',
            total_orders: { $sum: 1 },
            total_spent: { $sum: '$total_amount' }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $project: {
            user_name: '$user.name',
            user_email: '$user.email',
            total_orders: 1,
            total_spent: 1
          }
        },
        {
          $sort: { total_orders: -1 }
        },
        {
          $limit: 10
        }
      ]);
    } catch (error) {
      console.log('Order model not available for top users stats');
    }

    res.status(200).json({
      success: true,
      message: 'User statistics retrieved successfully',
      data: {
        total_users: totalUsers,
        role_breakdown: roleStats,
        monthly_user_growth: monthlyUserStats,
        top_active_users: topActiveUsers
      }
    });
  } catch (error) {
    console.error('Error getting user statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

// Lấy danh sách users có role shipper
export const getShippers = async (req, res) => {
  try {
    console.log('Getting shippers...');
    
    // Tìm role shipper
    const shipperRole = await RoleModel.findOne({ name: 'shipper' });
    console.log('Shipper role found:', shipperRole);
    
    if (!shipperRole) {
      return res.status(404).json({
        status: false,
        message: 'Role shipper không tồn tại'
      });
    }

    // Debug: Lấy tất cả users để kiểm tra
    const allUsers = await UserModel.find().populate('role_id').select('_id name email role_id status').lean();
    console.log('All users:', allUsers);
    
    // Lấy danh sách users có role shipper (không filter status để debug)
    const allShippers = await UserModel.find({ 
      role_id: shipperRole._id
    })
    .populate('role_id')
    .select('_id name email phone avatar status')
    .lean();
    
    console.log('All users with shipper role (any status):', allShippers);
    
    // Lấy danh sách users có role shipper và status active
    const shippers = await UserModel.find({ 
      role_id: shipperRole._id,
      status: 'active'
    })
    .populate('role_id')
    .select('_id name email phone avatar')
    .lean();

    console.log('Found shippers:', shippers);
    console.log('Shippers count:', shippers.length);

    res.status(200).json({
      status: true,
      message: 'Lấy danh sách shipper thành công',
      data: shippers
    });
  } catch (error) {
    console.log('Error in getShippers:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server khi lấy danh sách shipper',
      error: error.message
    });
  }
};