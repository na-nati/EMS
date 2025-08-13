import express from 'express';
import {
    createManager,
    getAllManagers,
    getManagerById,
    updateManager,
    deleteManager,
    getManagersByDepartment,
    checkIfUserIsManager,
    getManagers
} from '../controllers/managerController';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

// CRUD operations
router.post('/', authorizeRoles('super_admin', 'hr'), createManager);
router.get('/', authorizeRoles('super_admin', 'hr', 'manager'), getAllManagers);
router.get('/managers', authorizeRoles('super_admin', 'hr'), getManagers);
router.get('/:id', authorizeRoles('super_admin', 'hr', 'manager'), getManagerById);
router.put('/:id', authorizeRoles('super_admin', 'hr'), updateManager);
router.delete('/:id', authorizeRoles('super_admin', 'hr'), deleteManager);

// Manager-specific operations
router.get('/department/:departmentId', authorizeRoles('super_admin', 'hr', 'manager'), getManagersByDepartment);
router.get('/check/:userId', authorizeRoles('super_admin', 'hr', 'manager'), checkIfUserIsManager);



export default router; 