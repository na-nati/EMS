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

const router = express.Router();

// CRUD operations
router.post('/', createPayroll);
router.get('/', getAllPayrolls);
router.get('/:id', getPayrollById);
router.put('/:id', updatePayroll);
router.delete('/:id', deletePayroll);

// Payroll-specific operations
router.post('/bulk', bulkCreatePayroll);
router.get('/employee/:employeeId', getPayrollByEmployee);
router.get('/month/:month/year/:year', getPayrollByMonthYear);
router.patch('/:id/status', updatePayrollStatus);
router.get('/stats/:year', getPayrollStats);

export default router; 