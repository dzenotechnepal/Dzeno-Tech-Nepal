import express from 'express';
import { 
  generatePayslip, getPayslips, getPayslipById, getEmployeePayslips 
} from '../controller/payslip.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/employee/:id', getEmployeePayslips);

router.use(authorize('superadmin', 'admin', 'ceo'));

router.post('/generate', generatePayslip);
router.get('/', getPayslips);
router.get('/:id', getPayslipById);

export default router;
