import express from 'express';
import { getContracts, createContract, updateContract, deleteContract } from '../controller/contract.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();
router.use(authenticate, authorize('admin', 'superadmin'));
router.get('/', getContracts);
router.post('/', createContract);
router.put('/:id', updateContract);
router.delete('/:id', deleteContract);

export default router;
