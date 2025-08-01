"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assetController_1 = require("../controllers/assetController");
const router = express_1.default.Router();
// CRUD operations
router.post('/', assetController_1.createAsset);
router.get('/', assetController_1.getAllAssets);
router.get('/:id', assetController_1.getAssetById);
router.put('/:id', assetController_1.updateAsset);
router.delete('/:id', assetController_1.deleteAsset);
// Asset-specific operations
router.patch('/:id/assign', assetController_1.assignAsset);
router.patch('/:id/unassign', assetController_1.unassignAsset);
router.get('/employee/:employeeId', assetController_1.getAssetsByEmployee);
exports.default = router;
