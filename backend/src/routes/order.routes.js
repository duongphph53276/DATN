import express from 'express';
import OrderController from '../controllers/order.js';
import { authMiddleware, restrictTo } from '../middleware/auth.js';

const router = express.Router();

//Lấy tất cả đơn hàng - yêu cầu xác thực cho admin
router.get('/', authMiddleware, restrictTo('admin', 'employee'), OrderController.getAllOrders);

// Thống kê đơn hàng - yêu cầu xác thực cho admin
router.get('/statistics', authMiddleware, restrictTo('admin', 'employee'), OrderController.getOrderStatistics);

// Doanh thu theo tháng - yêu cầu xác thực cho admin
router.get('/monthly-revenue', authMiddleware, restrictTo('admin', 'employee'), OrderController.getMonthlyRevenue);

// Doanh thu theo ngày của tháng - yêu cầu xác thực cho admin
router.get('/daily-revenue', authMiddleware, restrictTo('admin', 'employee'), OrderController.getDailyRevenue);

// Doanh thu theo năm - yêu cầu xác thực cho admin
router.get('/yearly-revenue', authMiddleware, restrictTo('admin', 'employee'), OrderController.getYearlyRevenue);

//Seed fake data - yêu cầu xác thực cho admin
router.post('/seed', authMiddleware, restrictTo('admin'), OrderController.seedFakeData);

//Cleanup - yêu cầu xác thực cho admin
router.post('/cleanup', authMiddleware, restrictTo('admin'), OrderController.cleanupInvalidRequests);

//Lấy đơn hàng theo ID người dùng - yêu cầu xác thực
router.get('/user/:user_id', authMiddleware, OrderController.getOrdersByUserId);

//Lấy đơn hàng cho shipper - yêu cầu xác thực
router.get('/shipper/:shipper_id', authMiddleware, OrderController.getOrdersForShipper);

//Cập nhật trạng thái đơn hàng bởi shipper - yêu cầu xác thực
router.patch('/shipper/:shipper_id/:order_id/status', authMiddleware, OrderController.updateOrderStatusByShipper);

//Lấy đơn hàng theo ID - yêu cầu xác thực
router.get('/:id', authMiddleware, OrderController.getOrderById);

//Tạo mới đơn hàng - yêu cầu xác thực
router.post('/', authMiddleware, OrderController.createOrder);

//Update Status - yêu cầu xác thực cho admin
router.patch('/:id/status', authMiddleware, restrictTo('admin', 'employee'), OrderController.updateOrderStatus);

// Yêu cầu hủy đơn hàng (user) - chỉ khi pending/preparing
router.post('/:id/request-cancel', authMiddleware, OrderController.requestCancelOrder);

// Xử lý yêu cầu hủy đơn hàng (admin)
router.patch('/:id/cancel-request', authMiddleware, restrictTo('admin', 'employee'), OrderController.handleCancelRequest);

// Yêu cầu hoàn hàng (user) - chỉ khi delivered
router.post('/:id/request-return', authMiddleware, OrderController.requestReturnOrder);

// Xử lý yêu cầu hoàn hàng (admin)
router.patch('/:id/return-request', authMiddleware, restrictTo('admin', 'employee'), OrderController.handleReturnRequest);

//Xoá đơn hàng - yêu cầu xác thực cho admin
router.delete('/:id', authMiddleware, restrictTo('admin'), OrderController.deleteOrder);

export default router;