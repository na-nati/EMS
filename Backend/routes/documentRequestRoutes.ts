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

const router = express.Router();

// CRUD operations
router.post('/', createDocumentRequest);
router.get('/', getAllDocumentRequests);
router.get('/:id', getDocumentRequestById);
router.put('/:id', updateDocumentRequest);
router.delete('/:id', deleteDocumentRequest);

// Document request-specific operations
router.patch('/:id/status', updateDocumentRequestStatus);
router.patch('/:id/fulfill', fulfillDocumentRequest);
router.get('/employee/:employeeId', getDocumentRequestsByEmployee);
router.get('/pending/all', getPendingDocumentRequests);
router.get('/stats/all', getDocumentRequestStats);

export default router; 