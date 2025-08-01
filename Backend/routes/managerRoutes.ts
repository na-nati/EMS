import express from 'express';
import {
    createManager,
    getAllManagers,
    getManagerById,
    updateManager,
    deleteManager,
    getManagersByDepartment,
    checkIfUserIsManager
} from '../controllers/managerController';

const router = express.Router();

// CRUD operations
router.post('/', createManager);
router.get('/', getAllManagers);
router.get('/:id', getManagerById);
router.put('/:id', updateManager);
router.delete('/:id', deleteManager);

// Manager-specific operations
router.get('/department/:departmentId', getManagersByDepartment);
router.get('/check/:userId', checkIfUserIsManager);

export default router; 