import express from 'express';
import {
    createLeaveRequest,
    getAllLeaveRequests,
    getLeaveRequestById,
    updateLeaveRequest,
    deleteLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    getLeaveRequestsByEmployee,
    getPendingLeaveRequests
} from '../controllers/leaveRequestController';

const router = express.Router();

// CRUD operations
router.post('/', createLeaveRequest);
router.get('/', getAllLeaveRequests);
router.get('/:id', getLeaveRequestById);
router.put('/:id', updateLeaveRequest);
router.delete('/:id', deleteLeaveRequest);

// Leave-specific operations
router.patch('/:id/approve', approveLeaveRequest);
router.patch('/:id/reject', rejectLeaveRequest);
router.get('/employee/:employeeId', getLeaveRequestsByEmployee);
router.get('/pending/all', getPendingLeaveRequests);

export default router; 