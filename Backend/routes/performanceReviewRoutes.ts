import express from 'express';
import {
    createPerformanceReview,
    getAllPerformanceReviews,
    getPerformanceReviewById,
    updatePerformanceReview,
    deletePerformanceReview,
    getPerformanceReviewsByEmployee,
    getPerformanceReviewsByEvaluator,
    getPerformanceStats
} from '../controllers/performanceReviewController';

const router = express.Router();

// CRUD operations
router.post('/', createPerformanceReview);
router.get('/', getAllPerformanceReviews);
router.get('/:id', getPerformanceReviewById);
router.put('/:id', updatePerformanceReview);
router.delete('/:id', deletePerformanceReview);

// Performance-specific operations
router.get('/employee/:employeeId', getPerformanceReviewsByEmployee);
router.get('/evaluator/:evaluatorId', getPerformanceReviewsByEvaluator);
router.get('/employee/:employeeId/stats', getPerformanceStats);

export default router; 