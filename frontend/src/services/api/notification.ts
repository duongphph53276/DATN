import api from '../../middleware/axios';

export interface Notification {
  _id: string;
  user_id: string;
  content: string;
  type: string;
  is_read: boolean;
  role_id?: string;
  created_at: string;
}

// Lấy danh sách notifications của user
export const getUserNotifications = async (limit = 20): Promise<Notification[]> => {
  try {
    const response = await api.get(`/notifications/user?limit=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    throw error;
  }
};
export const getAdminNotifications = async (limit = 20): Promise<Notification[]> => {
  try {
    const response = await api.get(`/notifications/admin?limit=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    throw error;
  }
};
// Đánh dấu notification đã đọc
export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Lấy số lượng notifications chưa đọc
export const getUnreadNotificationCount = async (): Promise<number> => {
  try {
    const response = await api.get('/notifications/unread-count');
    return response.data.data.count;
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    throw error;
  }
}; 