import { UserModel } from '../../models/User/user.js'; // Điều chỉnh đường dẫn theo cấu trúc dự án

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