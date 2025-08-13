import express from 'express';
import {
    createAttendance,
    getAllAttendance,
    getAttendanceById,
    updateAttendance,
    deleteAttendance,
    getAttendanceByEmployee,
    getAttendanceStats,
    bulkCreateAttendance
} from '../controllers/attendanceController';
import { validateBody } from '../middleware/validateBody';
import { createAttendanceSchema, updateAttendanceSchema, bulkAttendanceSchema } from '../validation/attendanceValidation';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

// Apply authentication to all routes
router.use(authMiddleware);

// CRUD operations
router.post('/', authorizeRoles('super_admin', 'hr', 'manager'), validateBody(createAttendanceSchema), createAttendance);
router.get('/', authorizeRoles('super_admin', 'hr', 'manager', 'employee'), getAllAttendance);
router.get('/:id', authorizeRoles('super_admin', 'hr', 'manager', 'employee'), getAttendanceById);
router.put('/:id', authorizeRoles('super_admin', 'hr', 'manager'), validateBody(updateAttendanceSchema), updateAttendance);
router.delete('/:id', authorizeRoles('super_admin', 'hr'), deleteAttendance);

// Attendance-specific operations
router.post('/bulk', authorizeRoles('super_admin', 'hr'), validateBody(bulkAttendanceSchema), bulkCreateAttendance);
router.get('/employee/:employeeId', authorizeRoles('super_admin', 'hr', 'manager', 'employee'), getAttendanceByEmployee);
router.get('/employee/:employeeId/stats', authorizeRoles('super_admin', 'hr', 'manager'), getAttendanceStats);

export default router; 