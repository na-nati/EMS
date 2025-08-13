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
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

// CRUD operations
router.post('/', authorizeRoles('super_admin', 'hr', 'manager'), createPerformanceReview);
router.get('/', authorizeRoles('super_admin', 'hr', 'manager'), getAllPerformanceReviews);
router.get('/:id', authorizeRoles('super_admin', 'hr', 'manager'), getPerformanceReviewById);
router.put('/:id', authorizeRoles('super_admin', 'hr', 'manager'), updatePerformanceReview);
router.delete('/:id', authorizeRoles('super_admin', 'hr', 'manager'), deletePerformanceReview);

// Performance-specific operations
router.get('/employee/:employeeId', authorizeRoles('super_admin', 'hr', 'manager', 'employee'), getPerformanceReviewsByEmployee);
router.get('/evaluator/:evaluatorId', authorizeRoles('super_admin', 'hr', 'manager'), getPerformanceReviewsByEvaluator);
router.get('/employee/:employeeId/stats', authorizeRoles('super_admin', 'hr', 'manager'), getPerformanceStats);

export default router; 