import express from 'express';
import { login, getMe, updateMyProfile, uploadMyAvatar, changePassword } from '../controller/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import multer from 'multer';

const router = express.Router();
const avatarUpload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (req, file, callback) => {
		callback(null, file.mimetype.startsWith('image/'));
	},
});

router.post('/login', login);
router.get('/me', authenticate, getMe);
router.put('/me/profile', authenticate, updateMyProfile);
router.post('/me/avatar', authenticate, avatarUpload.single('avatar'), uploadMyAvatar);
router.post('/change-password', authenticate, changePassword);

export default router;
