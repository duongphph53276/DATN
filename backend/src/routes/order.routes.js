import express from 'express';
import OrderController from '../controllers/order.js';

const router = express.Router();

//Lấy tất cả đơn hàng
router.get('/', OrderController.getAllOrders);

// Thống kê đơn hàng
router.get('/statistics', OrderController.getOrderStatistics);

//Seed fake data
router.post('/seed', OrderController.seedFakeData);

//Lấy đơn hàng theo ID người dùng
router.get('/user/:user_id', OrderController.getOrdersByUserId);

//Lấy đơn hàng theo ID
router.get('/:id', OrderController.getOrderById);

//Tạo mới đơn hàng
router.post('/', OrderController.createOrder);

//Update Status
router.patch('/:id/status', OrderController.updateOrderStatus);

//Xoá đơn hàng
router.delete('/:id', OrderController.deleteOrder);

export default router;