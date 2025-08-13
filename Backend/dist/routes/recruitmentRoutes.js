"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recruitmentController_1 = require("../controllers/recruitmentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authMiddleware);
// CRUD operations
router.post('/', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), recruitmentController_1.createRecruitment);
router.get('/', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), recruitmentController_1.getAllRecruitments);
router.get('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), recruitmentController_1.getRecruitmentById);
router.put('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), recruitmentController_1.updateRecruitment);
router.delete('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), recruitmentController_1.deleteRecruitment);
// Recruitment-specific operations
router.patch('/:id/status', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), recruitmentController_1.updateRecruitmentStatus);
router.get('/requester/:requesterId', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), recruitmentController_1.getRecruitmentsByRequester);
router.get('/active/all', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), recruitmentController_1.getActiveRecruitments);
router.get('/stats/all', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), recruitmentController_1.getRecruitmentStats);
exports.default = router;
//# sourceMappingURL=recruitmentRoutes.js.map