"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const trainingRequestController_1 = require("../controllers/trainingRequestController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authMiddleware);
// CRUD operations
router.post('/', (0, authMiddleware_1.authorizeRoles)('employee'), trainingRequestController_1.createTrainingRequest);
router.get('/', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), trainingRequestController_1.getAllTrainingRequests);
router.get('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), trainingRequestController_1.getTrainingRequestById);
router.put('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), trainingRequestController_1.updateTrainingRequest);
router.delete('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), trainingRequestController_1.deleteTrainingRequest);
// Training request-specific operations
router.patch('/:id/approve', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), trainingRequestController_1.approveTrainingRequest);
router.patch('/:id/reject', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), trainingRequestController_1.rejectTrainingRequest);
router.patch('/:id/progress', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), trainingRequestController_1.updateTrainingProgress);
router.get('/employee/:employeeId', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager', 'employee'), trainingRequestController_1.getTrainingRequestsByEmployee);
router.get('/pending/all', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), trainingRequestController_1.getPendingTrainingRequests);
exports.default = router;
//# sourceMappingURL=trainingRequestRoutes.js.map