import { NotiModel } from '../models/notification.js';
import { sendNotificationToUser, sendNotificationToAdmins, sendNotificationToShippers } from '../socket/socket.js';
import { RoleModel } from '../models/User/role.js';

export const createNotification = async (userId, content, type, roleId = null) => {
  try {
    const notification = new NotiModel({
      user_id: userId,
      content,
      type,
      role_id: roleId
    });

    const savedNotification = await notification.save();

    sendNotificationToUser(userId, savedNotification);

    return savedNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const createOrderSuccessNotification = async (userId, orderId) => {
  const content = `Đơn hàng #${orderId.slice(-6)} đã được đặt thành công! Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất.`;
  return await createNotification(userId, content, 'order_success');
};

export const createOrderStatusNotification = async (userId, orderId, status) => {
  const shortId = orderId.slice(-10);
  const statusMessages = {
    'confirmed': `Đơn hàng #${shortId} đã được xác nhận và đang được chuẩn bị.`,
    'shipping': `Đơn hàng #${shortId} đang được giao đến bạn.`,
    'delivered': `Đơn hàng #${shortId} đã được giao thành công!`,
    'cancelled': `Đơn hàng #${shortId} đã bị hủy.`
  };

  const content = statusMessages[status] || `Trạng thái đơn hàng #${shortId} đã được cập nhật.`;

  return await createNotification(userId, content, 'order_status_update');
};


export const createNewOrderAdminNotification = async (orderId, totalAmount) => {
  const content = `Có đơn hàng mới #${orderId.slice(-6)} với tổng tiền ${totalAmount.toLocaleString('vi-VN')}₫`;

  try {
    const notification = new NotiModel({
      user_id: null,
      content,
      type: 'new_order_admin',
      role_id: '6877b96a7042a1ba5016ba3e'
    });

    const savedNotification = await notification.save();

    sendNotificationToAdmins(savedNotification);

    return savedNotification;
  } catch (error) {
    console.error('Error creating admin notification:', error);
    throw error;
  }
};

export const cancelledAdminNotification = async (orderId) => {
  const content = `Đơn hàng #${orderId.slice(-6)} đã bị huỷ ở phía khách hàng`;

  try {
    const notification = new NotiModel({
      user_id: null,
      content,
      type: 'new_order_admin',
      role_id: '6877b96a7042a1ba5016ba3e'
    });

    const savedNotification = await notification.save();

    sendNotificationToAdmins(savedNotification);

    return savedNotification;
  } catch (error) {
    console.error('Error creating admin notification:', error);
    throw error;
  }
};

export const getUserNotifications = async (userId, limit = 20) => {
  try {
    const notifications = await NotiModel.find({ user_id: userId })
      .sort({ created_at: -1 })
      .limit(limit);

    return notifications;
  } catch (error) {
    console.error('Error getting user notifications:', error);
    throw error;
  }
};
export const getAdminNotifications = async (userId = null, limit = 20) => {
  try {
    const notifications = await NotiModel.find({ user_id: null })
      .sort({ created_at: -1 })
      .limit(limit);

    return notifications;
  } catch (error) {
    console.error('Error getting user notifications:', error);
    throw error;
  }
};
export const markNotificationAsRead = async (notificationId, userId = null) => {
  try {
    let notification = null;
    if (userId !== null) {
      notification = await NotiModel.findOneAndUpdate(
        { _id: notificationId },
        { is_read: true },
        { new: true }
      );
    } else {
      notification = await NotiModel.findOneAndUpdate(
        { _id: notificationId, user_id: userId },
        { is_read: true },
        { new: true }
      );
    }

    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const getUnreadNotificationCount = async (userId) => {
  try {
    const count = await NotiModel.countDocuments({
      user_id: userId,
      is_read: false
    });

    return count;
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    throw error;
  }
};

// Tạo thông báo cho shipper khi có đơn hàng mới cần giao
export const createShipperAssignmentNotification = async (shipperId, orderId, customerName) => {
  const content = `Bạn có đơn hàng mới cần giao #${orderId.slice(-6)} từ khách hàng ${customerName}`;
  
  try {
    // Tạo notification cá nhân cho shipper
    const personalNotification = await createNotification(shipperId, content, 'shipper_assignment');
    
    // Tạo notification chung cho role shipper
    const shipperRole = await RoleModel.findOne({ name: 'shipper' });
    if (shipperRole) {
      const notification = new NotiModel({
        user_id: null,
        content,
        type: 'shipper_assignment',
        role_id: shipperRole._id
      });

      const savedNotification = await notification.save();
      sendNotificationToShippers(savedNotification);
    }

    return personalNotification;
  } catch (error) {
    console.error('Error creating shipper assignment notification:', error);
    throw error;
  }
}; 