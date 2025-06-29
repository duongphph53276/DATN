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
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id).populate('role_id address_id').select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      status: true,
      message: "Lấy thông tin người dùng thành công",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Lỗi server khi lấy thông tin người dùng",
      error: error.message
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