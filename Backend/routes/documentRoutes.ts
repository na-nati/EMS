import { Router } from 'express';
import {
    getAllDocuments,
    getDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    getAllDocumentRequests,
    createDocumentRequest,
    updateDocumentRequest,
    getDocumentRequest
} from '../controllers/documentController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Document routes
router.get('/documents', getAllDocuments);
router.get('/documents/:id', getDocument);
router.post('/documents', createDocument);
router.put('/documents/:id', updateDocument);
router.delete('/documents/:id', deleteDocument);

// Document request routes
router.get('/requests', getAllDocumentRequests);
router.get('/requests/:id', getDocumentRequest);
router.post('/requests', createDocumentRequest);
router.put('/requests/:id', updateDocumentRequest);

export default router; 