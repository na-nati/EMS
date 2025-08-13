import express from 'express';
import {
    createPayroll,
    getAllPayrolls,
    getPayrollById,
    updatePayroll,
    deletePayroll,
    getPayrollByEmployee,
    getPayrollByMonthYear,
    updatePayrollStatus,
    getPayrollStats,
    bulkCreatePayroll
} from '../controllers/payrollController';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

// CRUD operations
router.post('/', authorizeRoles('super_admin', 'hr'), createPayroll);
router.get('/', authorizeRoles('super_admin', 'hr', 'manager'), getAllPayrolls);
router.get('/:id', authorizeRoles('super_admin', 'hr', 'manager'), getPayrollById);
router.put('/:id', authorizeRoles('super_admin', 'hr'), updatePayroll);
router.delete('/:id', authorizeRoles('super_admin', 'hr'), deletePayroll);

// Payroll-specific operations
router.post('/bulk', authorizeRoles('super_admin', 'hr'), bulkCreatePayroll);
router.get('/employee/:employeeId', authorizeRoles('super_admin', 'hr', 'manager', 'employee'), getPayrollByEmployee);
router.get('/month/:month/year/:year', authorizeRoles('super_admin', 'hr', 'manager'), getPayrollByMonthYear);
router.patch('/:id/status', authorizeRoles('super_admin', 'hr'), updatePayrollStatus);
router.get('/stats/:year', authorizeRoles('super_admin', 'hr', 'manager'), getPayrollStats);

export default router; 