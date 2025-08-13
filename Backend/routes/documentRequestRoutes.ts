import express from 'express';
import {
    createDocumentRequest,
    getAllDocumentRequests,
    getDocumentRequestById,
    updateDocumentRequest,
    deleteDocumentRequest,
    updateDocumentRequestStatus,
    fulfillDocumentRequest,
    getDocumentRequestsByEmployee,
    getPendingDocumentRequests,
    getDocumentRequestStats
} from '../controllers/documentRequestController';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

// CRUD operations
router.post('/', authorizeRoles('employee'), createDocumentRequest);
router.get('/', authorizeRoles('super_admin', 'hr', 'employee'), getAllDocumentRequests);
router.get('/:id', authorizeRoles('super_admin', 'hr', 'employee'), getDocumentRequestById);
router.put('/:id', authorizeRoles('super_admin', 'hr'), updateDocumentRequest);
router.delete('/:id', authorizeRoles('super_admin', 'hr'), deleteDocumentRequest);

// Document request-specific operations
router.patch('/:id/status', authorizeRoles('super_admin', 'hr'), updateDocumentRequestStatus);
router.patch('/:id/fulfill', authorizeRoles('super_admin', 'hr'), fulfillDocumentRequest);
router.get('/employee/:employeeId', authorizeRoles('super_admin', 'hr', 'manager', 'employee'), getDocumentRequestsByEmployee);
router.get('/pending/all', authorizeRoles('super_admin', 'hr'), getPendingDocumentRequests);
router.get('/stats/all', authorizeRoles('super_admin', 'hr'), getDocumentRequestStats);

export default router; 