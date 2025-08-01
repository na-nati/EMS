import { Router } from 'express';
import {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
} from '../controllers/departmentController';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();


router.post('/', authMiddleware, authorizeRoles('hr', 'super_admin'), createDepartment);


router.get('/', authMiddleware, getDepartments);


router.get('/:id', authMiddleware, getDepartmentById);


router.put('/:id', authMiddleware, authorizeRoles('hr', 'super_admin'), updateDepartment);



router.delete('/:id', authMiddleware, authorizeRoles('hr', 'super_admin'), deleteDepartment);

export default router; 