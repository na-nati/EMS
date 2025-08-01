import express from 'express';
import {
    createAuditLog,
    getAllAuditLogs,
    getAuditLogById,
    updateAuditLog,
    deleteAuditLog,
    getAuditLogsByUser,
    getAuditLogsByTargetTable,
    getAuditLogStats,
    clearOldAuditLogs
} from '../controllers/auditLogController';

const router = express.Router();

// CRUD operations
router.post('/', createAuditLog);
router.get('/', getAllAuditLogs);
router.get('/:id', getAuditLogById);
router.put('/:id', updateAuditLog);
router.delete('/:id', deleteAuditLog);

// Audit-specific operations
router.get('/user/:userId', getAuditLogsByUser);
router.get('/table/:targetTable', getAuditLogsByTargetTable);
router.get('/stats/all', getAuditLogStats);
router.delete('/clear/:days', clearOldAuditLogs);

export default router; 