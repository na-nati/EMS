import express from 'express';
import {
    createSalary,
    getAllSalaries,
    getSalaryById,
    updateSalary,
    deleteSalary
} from '../controllers/salaryController';

const router = express.Router();

router.post('/', createSalary);
router.get('/', getAllSalaries);
router.get('/:id', getSalaryById);
router.put('/:id', updateSalary);
router.delete('/:id', deleteSalary);

export default router;
