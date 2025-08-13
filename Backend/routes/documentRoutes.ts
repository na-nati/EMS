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
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Document routes
router.get('/documents', authorizeRoles('super_admin', 'hr', 'employee'), getAllDocuments);
router.get('/documents/:id', authorizeRoles('super_admin', 'hr', 'employee'), getDocument);
router.post('/documents', authorizeRoles('super_admin', 'hr'), createDocument);
router.put('/documents/:id', authorizeRoles('super_admin', 'hr'), updateDocument);
router.delete('/documents/:id', authorizeRoles('super_admin', 'hr'), deleteDocument);

// Document request routes
router.get('/requests', authorizeRoles('super_admin', 'hr', 'employee'), getAllDocumentRequests);
router.get('/requests/:id', authorizeRoles('super_admin', 'hr', 'employee'), getDocumentRequest);
router.post('/requests', authorizeRoles('employee'), createDocumentRequest);
router.put('/requests/:id', authorizeRoles('super_admin', 'hr'), updateDocumentRequest);

export default router; 