import express from 'express';
import { getStats } from '../controller/dashboard.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);
router.get('/stats', authorize('superadmin', 'admin', 'ceo'), getStats);

export default router;
