import express from 'express';
import {
    createAsset,
    getAllAssets,
    getAssetById,
    updateAsset,
    deleteAsset,
    assignAsset,
    unassignAsset,
    getAssetsByEmployee
} from '../controllers/assetController';
import { validateBody } from '../middleware/validateBody';
import { createAssetSchema, updateAssetSchema, assignAssetSchema } from '../validation/assetValidation';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

// Apply authentication to all routes
router.use(authMiddleware);

// CRUD operations
router.post('/', authorizeRoles('super_admin', 'hr'), validateBody(createAssetSchema), createAsset);
router.get('/', authorizeRoles('super_admin', 'hr'), getAllAssets);
router.get('/:id', authorizeRoles('super_admin', 'hr'), getAssetById);
router.put('/:id', authorizeRoles('super_admin', 'hr'), validateBody(updateAssetSchema), updateAsset);
router.delete('/:id', authorizeRoles('super_admin', 'hr'), deleteAsset);

// Asset-specific operations
router.patch('/:id/assign', authorizeRoles('super_admin', 'hr'), validateBody(assignAssetSchema), assignAsset);
router.patch('/:id/unassign', authorizeRoles('super_admin', 'hr'), unassignAsset);
router.get('/employee/:employeeId', authorizeRoles('super_admin', 'hr', 'employee'), getAssetsByEmployee);

export default router; 