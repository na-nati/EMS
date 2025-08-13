"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const trainingController_1 = require("../controllers/trainingController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authMiddleware);
// CRUD operations
router.post('/', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), trainingController_1.createTraining);
router.get('/', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), trainingController_1.getAllTrainings);
router.get('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), trainingController_1.getTrainingById);
router.put('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), trainingController_1.updateTraining);
router.delete('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), trainingController_1.deleteTraining);
// Training-specific operations
router.patch('/:id/status', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), trainingController_1.updateTrainingStatus);
router.get('/upcoming/all', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), trainingController_1.getUpcomingTrainings);
router.get('/completed/all', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), trainingController_1.getCompletedTrainings);
router.get('/stats/all', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), trainingController_1.getTrainingStats);
exports.default = router;
//# sourceMappingURL=trainingRoutes.js.map