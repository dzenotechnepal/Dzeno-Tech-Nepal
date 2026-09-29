import express from 'express';
import { 
  applyLeave, getLeaves, approveLeave, rejectLeave, getEmployeeLeaves 
} from '../controller/leave.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/apply', applyLeave);
router.get('/employee/:id', getEmployeeLeaves);

// Both employee and admin hit the same getLeaves endpoint
router.get('/', getLeaves);

router.use(authorize('superadmin', 'admin', 'ceo'));

router.put('/:id/approve', approveLeave);
router.put('/:id/reject', rejectLeave);

export default router;
