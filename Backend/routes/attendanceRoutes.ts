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

const router = express.Router();

// CRUD operations
router.post('/', createAttendance);
router.get('/', getAllAttendance);
router.get('/:id', getAttendanceById);
router.put('/:id', updateAttendance);
router.delete('/:id', deleteAttendance);

// Attendance-specific operations
router.post('/bulk', bulkCreateAttendance);
router.get('/employee/:employeeId', getAttendanceByEmployee);
router.get('/employee/:employeeId/stats', getAttendanceStats);

export default router; 