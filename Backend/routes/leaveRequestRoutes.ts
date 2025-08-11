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
import { validateBody } from '../middleware/validateBody';
import { createLeaveRequestSchema, updateLeaveRequestSchema, approveLeaveRequestSchema } from '../validation/leaveRequestValidation';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

// Apply authentication to all routes
router.use(authMiddleware);

// CRUD operations
router.post('/', validateBody(createLeaveRequestSchema), createLeaveRequest);
router.get('/', getAllLeaveRequests);
router.get('/:id', getLeaveRequestById);
router.put('/:id', validateBody(updateLeaveRequestSchema), updateLeaveRequest);
router.delete('/:id', authorizeRoles('super_admin', 'hr'), deleteLeaveRequest);

// Leave request-specific operations
router.patch('/:id/approve', authorizeRoles('super_admin', 'hr', 'manager'), validateBody(approveLeaveRequestSchema), approveLeaveRequest);
router.patch('/:id/reject', authorizeRoles('super_admin', 'hr', 'manager'), validateBody(approveLeaveRequestSchema), rejectLeaveRequest);
router.get('/employee/:employeeId', getLeaveRequestsByEmployee);
router.get('/pending/all', getPendingLeaveRequests);

export default router; 