import express from 'express';
import {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    getEmployeesByDepartment,
    getEmployeeStats
} from '../controllers/employeeController';

const router = express.Router();

// CRUD operations
router.post('/', createEmployee);
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

// Employee-specific operations
router.get('/department/:departmentId', getEmployeesByDepartment);
router.get('/stats/all', getEmployeeStats);

export default router; 