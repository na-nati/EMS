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

const router = express.Router();

// CRUD operations
router.post('/', createRecruitment);
router.get('/', getAllRecruitments);
router.get('/:id', getRecruitmentById);
router.put('/:id', updateRecruitment);
router.delete('/:id', deleteRecruitment);

// Recruitment-specific operations
router.patch('/:id/status', updateRecruitmentStatus);
router.get('/requester/:requesterId', getRecruitmentsByRequester);
router.get('/active/all', getActiveRecruitments);
router.get('/stats/all', getRecruitmentStats);

export default router; 