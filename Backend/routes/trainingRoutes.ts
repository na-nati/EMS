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

const router = express.Router();

// CRUD operations
router.post('/', createTraining);
router.get('/', getAllTrainings);
router.get('/:id', getTrainingById);
router.put('/:id', updateTraining);
router.delete('/:id', deleteTraining);

// Training-specific operations
router.patch('/:id/status', updateTrainingStatus);
router.get('/upcoming/all', getUpcomingTrainings);
router.get('/completed/all', getCompletedTrainings);
router.get('/stats/all', getTrainingStats);

export default router; 