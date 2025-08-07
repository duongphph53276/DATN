import express from 'express';
import VNPayController from '../controllers/payment/VNPayController.js';

const router = express.Router();

router.post('/vnpay/create', VNPayController.payment);
router.get('/vnpay/callback', VNPayController.callback);

export default router;
