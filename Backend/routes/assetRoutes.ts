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

const router = express.Router();

// CRUD operations
router.post('/', createAsset);
router.get('/', getAllAssets);
router.get('/:id', getAssetById);
router.put('/:id', updateAsset);
router.delete('/:id', deleteAsset);

// Asset-specific operations
router.patch('/:id/assign', assignAsset);
router.patch('/:id/unassign', unassignAsset);
router.get('/employee/:employeeId', getAssetsByEmployee);

export default router; 