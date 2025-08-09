import express from 'express';
import { login, register, registerAdmin, checkEmail, verifyEmail, Profile, UpdateProfile } from '../controllers/auth.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/register/admin', registerAdmin);
router.get('/check-email', checkEmail);
router.get('/verify-email', verifyEmail);
router.get('/profile', authMiddleware, Profile);
router.put('/profile', authMiddleware, UpdateProfile);

export default router;
