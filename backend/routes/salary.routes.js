import express from 'express';
import { 
  createSalary, getSalaries, getSalaryById, 
  updateSalary, getEmployeeSalaries, paySalary 
} from '../controller/salary.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/employee/:id', getEmployeeSalaries);

router.use(authorize('superadmin', 'admin', 'ceo'));

router.post('/create', createSalary);
router.get('/', getSalaries);
router.get('/:id', getSalaryById);
router.put('/:id', updateSalary);
router.post('/:id/pay', paySalary);

export default router;
