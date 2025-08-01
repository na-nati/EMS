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

const router = express.Router();

// CRUD operations
router.post('/', createTrainingRequest);
router.get('/', getAllTrainingRequests);
router.get('/:id', getTrainingRequestById);
router.put('/:id', updateTrainingRequest);
router.delete('/:id', deleteTrainingRequest);

// Training request-specific operations
router.patch('/:id/approve', approveTrainingRequest);
router.patch('/:id/reject', rejectTrainingRequest);
router.patch('/:id/progress', updateTrainingProgress);
router.get('/employee/:employeeId', getTrainingRequestsByEmployee);
router.get('/pending/all', getPendingTrainingRequests);

export default router; 