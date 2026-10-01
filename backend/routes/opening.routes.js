import express from 'express';
import { getPublicOpenings, getOpenings, createOpening, updateOpening, deleteOpening } from '../controller/opening.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/public', getPublicOpenings);
router.use(authenticate, authorize('admin', 'superadmin'));
router.get('/', getOpenings);
router.post('/', createOpening);
router.put('/:id', updateOpening);
router.delete('/:id', deleteOpening);

export default router;
