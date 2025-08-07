import express from 'express';
import { 
  getUserNotificationsController, 
  markNotificationAsReadController, 
  getUnreadNotificationCountController, 
  getAdminNotificationsController
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

export default router; 