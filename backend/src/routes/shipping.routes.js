import express from 'express';
import ShippingController from '../controllers/shipping.js';

const router = express.Router();

// Get all provinces
router.get('/provinces', ShippingController.getProvinces);

// Calculate shipping fee
router.post('/calculate', ShippingController.calculateShippingFee);

export default router;
