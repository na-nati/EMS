import express from 'express';
import {
    createSalary,
    getAllSalaries,
    getSalaryById,
    updateSalary,
    deleteSalary,
    getSalariesByUser
} from '../controllers/salaryController';

const router = express.Router();

router.post('/', createSalary);
router.get('/', getAllSalaries);
router.get('/user/:userId', getSalariesByUser);
router.get('/:id', getSalaryById);
router.put('/:id', updateSalary);
router.delete('/:id', deleteSalary);

export default router;
