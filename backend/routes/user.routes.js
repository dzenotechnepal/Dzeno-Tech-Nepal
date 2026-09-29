import express from 'express';
import { 
  registerUser, getUsers, getUserById, updateUser, 
  deleteUser, getRoles, updateBankInfo 
} from '../controller/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/roles', getRoles); // Anyone authenticated can view roles

router.get('/', authorize('superadmin', 'admin', 'ceo'), getUsers);
router.get('/:id', authorize('superadmin', 'admin', 'ceo', 'developer', 'employee'), getUserById);

router.post('/register', authorize('superadmin', 'admin'), registerUser);
router.put('/:id', authorize('superadmin', 'admin'), updateUser);
router.delete('/:id', authorize('superadmin'), deleteUser);

router.put('/:id/bank', authorize('superadmin', 'admin', 'ceo'), updateBankInfo);

export default router;
