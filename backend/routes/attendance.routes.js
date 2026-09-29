import express from 'express';
import { 
  checkIn, checkOut, getAttendanceList, 
  markAttendance, getEmployeeAttendance, getMonthlySummary 
} from '../controller/attendance.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/checkin', checkIn);
router.post('/checkout', checkOut);

router.get('/', authorize('superadmin', 'admin', 'ceo'), getAttendanceList);
router.post('/mark', authorize('superadmin', 'admin'), markAttendance);

router.get('/employee/:id', getEmployeeAttendance);
router.get('/monthly-summary/:id', getMonthlySummary);

export default router;
