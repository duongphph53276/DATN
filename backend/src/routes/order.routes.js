import express from 'express';
import OrderController from '../controllers/order.js';

const router = express.Router();

//Lấy tất cả đơn hàng
router.get('/', OrderController.getAllOrders);

// Thống kê đơn hàng
router.get('/statistics', OrderController.getOrderStatistics);

// Doanh thu theo tháng
router.get('/monthly-revenue', OrderController.getMonthlyRevenue);

// Doanh thu theo ngày của tháng
router.get('/daily-revenue', OrderController.getDailyRevenue);

// Doanh thu theo năm
router.get('/yearly-revenue', OrderController.getYearlyRevenue);

//Seed fake data
router.post('/seed', OrderController.seedFakeData);

router.post('/cleanup', OrderController.cleanupInvalidRequests);

//Lấy đơn hàng theo ID người dùng
router.get('/user/:user_id', OrderController.getOrdersByUserId);

//Lấy đơn hàng cho shipper
router.get('/shipper/:shipper_id', OrderController.getOrdersForShipper);

//Cập nhật trạng thái đơn hàng bởi shipper
router.patch('/shipper/:shipper_id/:order_id/status', OrderController.updateOrderStatusByShipper);

//Lấy đơn hàng theo ID
router.get('/:id', OrderController.getOrderById);

//Tạo mới đơn hàng
router.post('/', OrderController.createOrder);

//Update Status
router.patch('/:id/status', OrderController.updateOrderStatus);

// Yêu cầu hủy đơn hàng (user) - chỉ khi pending/preparing
router.post('/:id/request-cancel', OrderController.requestCancelOrder);

// Xử lý yêu cầu hủy đơn hàng (admin)
router.patch('/:id/cancel-request', OrderController.handleCancelRequest);

// Yêu cầu hoàn hàng (user) - chỉ khi delivered
router.post('/:id/request-return', OrderController.requestReturnOrder);

// Xử lý yêu cầu hoàn hàng (admin)
router.patch('/:id/return-request', OrderController.handleReturnRequest);

//Xoá đơn hàng
router.delete('/:id', OrderController.deleteOrder);

export default router;