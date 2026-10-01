import express from 'express';
import {
  createContactInquiry,
  createJobApplication,
  getContactInquiries,
  updateContactInquiry,
  getJobApplications,
  updateJobApplication,
} from '../controller/submission.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/contact', createContactInquiry);
router.post('/applications', createJobApplication);

router.use(authenticate, authorize('admin', 'superadmin'));
router.get('/contact', getContactInquiries);
router.patch('/contact/:id', updateContactInquiry);
router.get('/applications', getJobApplications);
router.patch('/applications/:id', updateJobApplication);

export default router;
