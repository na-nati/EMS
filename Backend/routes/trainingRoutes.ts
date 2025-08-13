import express from 'express';
import {
    createTraining,
    getAllTrainings,
    getTrainingById,
    updateTraining,
    deleteTraining,
    updateTrainingStatus,
    getUpcomingTrainings,
    getCompletedTrainings,
    getTrainingStats
} from '../controllers/trainingController';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

// CRUD operations
router.post('/', authorizeRoles('super_admin', 'hr'), createTraining);
router.get('/', authorizeRoles('super_admin', 'hr'), getAllTrainings);
router.get('/:id', authorizeRoles('super_admin', 'hr'), getTrainingById);
router.put('/:id', authorizeRoles('super_admin', 'hr'), updateTraining);
router.delete('/:id', authorizeRoles('super_admin', 'hr'), deleteTraining);

// Training-specific operations
router.patch('/:id/status', authorizeRoles('super_admin', 'hr'), updateTrainingStatus);
router.get('/upcoming/all', authorizeRoles('super_admin', 'hr'), getUpcomingTrainings);
router.get('/completed/all', authorizeRoles('super_admin', 'hr'), getCompletedTrainings);
router.get('/stats/all', authorizeRoles('super_admin', 'hr'), getTrainingStats);

export default router; 