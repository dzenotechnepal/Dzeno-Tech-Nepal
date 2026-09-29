import express from 'express';
import { getSettings, updateSettings } from '../controller/setting.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();
router.use(authenticate, authorize('admin', 'superadmin'));
router.get('/', getSettings);
router.put('/', updateSettings);

export default router;
