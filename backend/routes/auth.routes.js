import express from 'express';
import { login, getMe, updateMyProfile, changePassword } from '../controller/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', authenticate, getMe);
router.put('/me/profile', authenticate, updateMyProfile);
router.post('/change-password', authenticate, changePassword);

export default router;
