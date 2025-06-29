import { UserModel } from '../models/User/user.js'; // Điều chỉnh đường dẫn

const restrictTo = (...roles) => {
  return async (req, res, next) => {
    const user = await UserModel.findById(req.user.id).populate('role_id');

    if (!user || !roles.includes(user.role_id.name)) {
      return res.status(403).json({ message: 'bạn không có quyền làm việc này' });
    }

    next();
  };
};

export default restrictTo;