import express from 'express';
import {
    createRecruitment,
    getAllRecruitments,
    getRecruitmentById,
    updateRecruitment,
    deleteRecruitment,
    updateRecruitmentStatus,
    getRecruitmentsByRequester,
    getActiveRecruitments,
    getRecruitmentStats
} from '../controllers/recruitmentController';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

// CRUD operations
router.post('/', authorizeRoles('super_admin', 'hr'), createRecruitment);
router.get('/', authorizeRoles('super_admin', 'hr', 'manager'), getAllRecruitments);
router.get('/:id', authorizeRoles('super_admin', 'hr', 'manager'), getRecruitmentById);
router.put('/:id', authorizeRoles('super_admin', 'hr'), updateRecruitment);
router.delete('/:id', authorizeRoles('super_admin', 'hr'), deleteRecruitment);

// Recruitment-specific operations
router.patch('/:id/status', authorizeRoles('super_admin', 'hr'), updateRecruitmentStatus);
router.get('/requester/:requesterId', authorizeRoles('super_admin', 'hr', 'manager'), getRecruitmentsByRequester);
router.get('/active/all', authorizeRoles('super_admin', 'hr', 'manager'), getActiveRecruitments);
router.get('/stats/all', authorizeRoles('super_admin', 'hr', 'manager'), getRecruitmentStats);

export default router; 