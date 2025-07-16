import { NotiModel } from '../models/notification.js'; // Điều chỉnh đường dẫn theo cấu trúc dự án của bạn

// Nhận danh sách thông báo của người dùng
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // Giả sử bạn đã có middleware xác thực để lấy userId
    const notifications = await NotiModel.find({ user_id: userId })
      .populate('user_id', 'username') // Populate thông tin user nếu cần
      .populate('role_id', 'name') // Populate thông tin role nếu cần
      .sort({ created_at: -1 }); // Sắp xếp theo thời gian tạo, mới nhất trước
    
    return res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách thông báo',
      error: error.message
    });
  }
};

// Đánh dấu thông báo là đã đọc
export const markAsRead = async (req, res) => {
  try {
    const { notiId } = req.params;
    const userId = req.user.id;

    const notification = await NotiModel.findOne({
      _id: notiId,
      user_id: userId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông báo hoặc bạn không có quyền truy cập'
      });
    }

    notification.is_read = true;
    await notification.save();

    return res.status(200).json({
      success: true,
      message: 'Đã đánh dấu thông báo là đã đọc',
      data: notification
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi đánh dấu thông báo',
      error: error.message
    });
  }
};

// Đánh dấu tất cả thông báo là đã đọc
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await NotiModel.updateMany(
      { user_id: userId, is_read: false },
      { $set: { is_read: true } }
    );

    return res.status(200).json({
      success: true,
      message: 'Đã đánh dấu tất cả thông báo là đã đọc'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi đánh dấu tất cả thông báo',
      error: error.message
    });
  }
};