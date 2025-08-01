import express from 'express';
import { login, register, checkEmail, verifyEmail, Profile, UpdateProfile } from '../controllers/auth.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/check-email', checkEmail);
router.get('/verify-email', verifyEmail);
router.get('/profile', authMiddleware, Profile);
router.put('/profile', authMiddleware, UpdateProfile);

export default router;
