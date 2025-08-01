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

const router = express.Router();

// CRUD operations
router.post('/', createSeparationRequest);
router.get('/', getAllSeparationRequests);
router.get('/:id', getSeparationRequestById);
router.put('/:id', updateSeparationRequest);
router.delete('/:id', deleteSeparationRequest);

// Separation-specific operations
router.patch('/:id/approve', approveSeparationRequest);
router.patch('/:id/process', processSeparationRequest);
router.get('/employee/:employeeId', getSeparationRequestsByEmployee);
router.get('/pending/all', getPendingSeparationRequests);

export default router; 