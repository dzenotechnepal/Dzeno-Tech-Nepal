import express from 'express';
import { getContracts, createContract, updateContract, deleteContract, uploadContractDocument, deleteContractDocument } from '../controller/contract.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import multer from 'multer';

const router = express.Router();
router.use(authenticate);
router.get('/', getContracts);

router.use(authorize('admin', 'superadmin'));
router.post('/', createContract);
router.put('/:id', updateContract);
router.delete('/:id', deleteContract);
const documentUpload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter: (req, file, callback) => {
		const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
		callback(null, allowed.includes(file.mimetype));
	},
});
router.post('/:id/documents', documentUpload.single('document'), uploadContractDocument);
router.delete('/:id/documents/:documentId', deleteContractDocument);

export default router;
