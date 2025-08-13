import express from 'express';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware';
import {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    getEmployeesByDepartment,
    getEmployeeStats,
    getEmployeeRegistrationTrends,
    getActiveLeaveTrends
} from '../controllers/employeeController';

const router = express.Router();

// Protect all employee routes
router.use(authMiddleware);

// CRUD operations
router.post('/', authorizeRoles('super_admin', 'hr'), createEmployee);
router.get('/', authorizeRoles('super_admin', 'hr', 'manager'), getAllEmployees);

// Dashboard chart endpoints (must come before /:id route)
router.get('/registration-trends', authorizeRoles('super_admin', 'hr'), getEmployeeRegistrationTrends);
router.get('/active-leave-trends', authorizeRoles('super_admin', 'hr'), getActiveLeaveTrends);

// Employee-specific operations
router.get('/department/:departmentId', authorizeRoles('super_admin', 'hr', 'manager'), getEmployeesByDepartment);
router.get('/stats/all', authorizeRoles('super_admin', 'hr'), getEmployeeStats);

// Individual employee operations (must come last)
router.get('/:id', authorizeRoles('super_admin', 'hr', 'manager'), getEmployeeById);
router.put('/:id', authorizeRoles('super_admin', 'hr'), updateEmployee);
router.delete('/:id', authorizeRoles('super_admin', 'hr'), deleteEmployee);

export default router; 