import express from 'express';
import {
    createSalary,
    getAllSalaries,
    getSalaryById,
    updateSalary,
    deleteSalary,
    getSalariesByUser
} from '../controllers/salaryController';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

router.post('/', authorizeRoles('super_admin', 'hr'), createSalary);
router.get('/', authorizeRoles('super_admin', 'hr'), getAllSalaries);
router.get('/user/:userId', authorizeRoles('super_admin', 'hr', 'employee'), getSalariesByUser);
router.get('/:id', authorizeRoles('super_admin', 'hr'), getSalaryById);
router.put('/:id', authorizeRoles('super_admin', 'hr'), updateSalary);
router.delete('/:id', authorizeRoles('super_admin', 'hr'), deleteSalary);

export default router;
