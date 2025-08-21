import express from 'express';
import * as systemConfigController from '../controllers/systemConfig.js';
import { authMiddleware, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/config', systemConfigController.getSystemConfig);

// Protected routes (admin only)
router.put('/config', authMiddleware, restrictTo('admin'), systemConfigController.updateSystemConfig);

// Banner management
router.post('/banners', authMiddleware, restrictTo('admin'), systemConfigController.addBanner);
router.put('/banners/:id', authMiddleware, restrictTo('admin'), systemConfigController.updateBanner);
router.delete('/banners/:id', authMiddleware, restrictTo('admin'), systemConfigController.deleteBanner);
router.post('/banners/reorder', authMiddleware, restrictTo('admin'), systemConfigController.reorderBanners);



export default router;
