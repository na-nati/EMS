import express from 'express';
import {
    createTrainingRequest,
    getAllTrainingRequests,
    getTrainingRequestById,
    updateTrainingRequest,
    deleteTrainingRequest,
    approveTrainingRequest,
    rejectTrainingRequest,
    updateTrainingProgress,
    getTrainingRequestsByEmployee,
    getPendingTrainingRequests
} from '../controllers/trainingRequestController';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

// CRUD operations
router.post('/', authorizeRoles('employee'), createTrainingRequest);
router.get('/', authorizeRoles('super_admin', 'hr'), getAllTrainingRequests);
router.get('/:id', authorizeRoles('super_admin', 'hr'), getTrainingRequestById);
router.put('/:id', authorizeRoles('super_admin', 'hr'), updateTrainingRequest);
router.delete('/:id', authorizeRoles('super_admin', 'hr'), deleteTrainingRequest);

// Training request-specific operations
router.patch('/:id/approve', authorizeRoles('super_admin', 'hr'), approveTrainingRequest);
router.patch('/:id/reject', authorizeRoles('super_admin', 'hr'), rejectTrainingRequest);
router.patch('/:id/progress', authorizeRoles('super_admin', 'hr'), updateTrainingProgress);
router.get('/employee/:employeeId', authorizeRoles('super_admin', 'hr', 'manager', 'employee'), getTrainingRequestsByEmployee);
router.get('/pending/all', authorizeRoles('super_admin', 'hr'), getPendingTrainingRequests);

export default router; 