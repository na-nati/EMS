"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assetController_1 = require("../controllers/assetController");
const validateBody_1 = require("../middleware/validateBody");
const assetValidation_1 = require("../validation/assetValidation");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Apply authentication to all routes
router.use(authMiddleware_1.authMiddleware);
// CRUD operations
router.post('/', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), (0, validateBody_1.validateBody)(assetValidation_1.createAssetSchema), assetController_1.createAsset);
router.get('/', assetController_1.getAllAssets);
router.get('/:id', assetController_1.getAssetById);
router.put('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), (0, validateBody_1.validateBody)(assetValidation_1.updateAssetSchema), assetController_1.updateAsset);
router.delete('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), assetController_1.deleteAsset);
// Asset-specific operations
router.patch('/:id/assign', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), (0, validateBody_1.validateBody)(assetValidation_1.assignAssetSchema), assetController_1.assignAsset);
router.patch('/:id/unassign', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), assetController_1.unassignAsset);
router.get('/employee/:employeeId', assetController_1.getAssetsByEmployee);
exports.default = router;
//# sourceMappingURL=assetRoutes.js.map