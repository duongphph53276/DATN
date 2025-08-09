import { 
  getUserNotifications, 
  markNotificationAsRead, 
  getUnreadNotificationCount, 
  getAdminNotifications,
  markAllNotificationsAsRead
} from '../services/notificationService.js';

export const getUserNotificationsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20 } = req.query;
    
    const notifications = await getUserNotifications(userId, parseInt(limit));
    
    res.json({
      status: true,
      message: 'Lấy danh sách thông báo thành công',
      data: notifications
    });
  } catch (error) {
    console.error('Error in getUserNotificationsController:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};
export const getAdminNotificationsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20 } = req.query;
    
    const notifications = await getAdminNotifications(userId, parseInt(limit));
    
    res.json({
      status: true,
      message: 'Lấy danh sách thông báo thành công',
      data: notifications
    });
  } catch (error) {
    console.error('Error in getUserNotificationsController:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};
export const markNotificationAsReadController = async (req, res) => {
  try {
    const userId = req.user.id || null;
    const { notificationId } = req.params;
    
    const notification = await markNotificationAsRead(notificationId, userId);
    
    if (!notification) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy thông báo'
      });
    }
    
    res.json({
      status: true,
      message: 'Đã đánh dấu thông báo đã đọc',
      data: notification
    });
  } catch (error) {
    console.error('Error in markNotificationAsReadController:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

export const getUnreadNotificationCountController = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const count = await getUnreadNotificationCount(userId);
    
    res.json({
      status: true,
      message: 'Lấy số lượng thông báo chưa đọc thành công',
      data: { count }
    });
  } catch (error) {
    console.error('Error in getUnreadNotificationCountController:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

export const markAllNotificationsAsReadController = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await markAllNotificationsAsRead(userId);
    
    res.json({
      status: true,
      message: 'Đã đánh dấu tất cả thông báo đã đọc',
      data: { updatedCount: result.modifiedCount }
    });
  } catch (error) {
    console.error('Error in markAllNotificationsAsReadController:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
}; 