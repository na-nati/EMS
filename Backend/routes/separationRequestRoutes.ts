import express from 'express';
import {
    createSeparationRequest,
    getAllSeparationRequests,
    getSeparationRequestById,
    updateSeparationRequest,
    deleteSeparationRequest,
    approveSeparationRequest,
    processSeparationRequest,
    getSeparationRequestsByEmployee,
    getPendingSeparationRequests
} from '../controllers/separationRequestController';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

// CRUD operations
router.post('/', authorizeRoles('employee'), createSeparationRequest);
router.get('/', authorizeRoles('super_admin', 'hr', 'manager'), getAllSeparationRequests);
router.get('/:id', authorizeRoles('super_admin', 'hr', 'manager'), getSeparationRequestById);
router.put('/:id', authorizeRoles('super_admin', 'hr', 'manager'), updateSeparationRequest);
router.delete('/:id', authorizeRoles('super_admin', 'hr'), deleteSeparationRequest);

// Separation-specific operations
router.patch('/:id/approve', authorizeRoles('super_admin', 'hr', 'manager'), approveSeparationRequest);
router.patch('/:id/process', authorizeRoles('super_admin', 'hr'), processSeparationRequest);
router.get('/employee/:employeeId', authorizeRoles('super_admin', 'hr', 'manager', 'employee'), getSeparationRequestsByEmployee);
router.get('/pending/all', authorizeRoles('super_admin', 'hr', 'manager'), getPendingSeparationRequests);

export default router; 