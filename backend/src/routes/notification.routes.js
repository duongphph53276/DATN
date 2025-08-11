import express from 'express';
import { 
  getUserNotificationsController, 
  markNotificationAsReadController, 
  getUnreadNotificationCountController, 
  getAdminNotificationsController,
  markAllNotificationsAsReadController
} from '../controllers/notificationController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Lấy danh sách notifications của user
router.get('/user', authMiddleware, getUserNotificationsController);
router.get('/admin', authMiddleware, getAdminNotificationsController);

// Lấy số lượng notifications chưa đọc
router.get('/unread-count', authMiddleware, getUnreadNotificationCountController);

// Đánh dấu notification đã đọc
router.put('/:notificationId/read', authMiddleware, markNotificationAsReadController);

// Đánh dấu tất cả notifications đã đọc
router.put('/mark-all-read', authMiddleware, markAllNotificationsAsReadController);

export default router; 