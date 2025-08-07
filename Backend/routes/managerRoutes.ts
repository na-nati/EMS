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

const router = express.Router();

// CRUD operations
router.post('/', createManager);
router.get('/', getAllManagers);
router.get('/managers', getManagers);
router.get('/:id', getManagerById);
router.put('/:id', updateManager);
router.delete('/:id', deleteManager);
router.get('/managers', getManagers);

// Manager-specific operations
router.get('/department/:departmentId', getManagersByDepartment);
router.get('/check/:userId', checkIfUserIsManager);



export default router; 