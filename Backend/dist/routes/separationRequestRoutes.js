"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const separationRequestController_1 = require("../controllers/separationRequestController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authMiddleware);
// CRUD operations
router.post('/', (0, authMiddleware_1.authorizeRoles)('employee'), separationRequestController_1.createSeparationRequest);
router.get('/', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), separationRequestController_1.getAllSeparationRequests);
router.get('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), separationRequestController_1.getSeparationRequestById);
router.put('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), separationRequestController_1.updateSeparationRequest);
router.delete('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), separationRequestController_1.deleteSeparationRequest);
// Separation-specific operations
router.patch('/:id/approve', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), separationRequestController_1.approveSeparationRequest);
router.patch('/:id/process', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), separationRequestController_1.processSeparationRequest);
router.get('/employee/:employeeId', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager', 'employee'), separationRequestController_1.getSeparationRequestsByEmployee);
router.get('/pending/all', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), separationRequestController_1.getPendingSeparationRequests);
exports.default = router;
//# sourceMappingURL=separationRequestRoutes.js.map