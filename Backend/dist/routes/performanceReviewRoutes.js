"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const performanceReviewController_1 = require("../controllers/performanceReviewController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authMiddleware);
// CRUD operations
router.post('/', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), performanceReviewController_1.createPerformanceReview);
router.get('/', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), performanceReviewController_1.getAllPerformanceReviews);
router.get('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), performanceReviewController_1.getPerformanceReviewById);
router.put('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), performanceReviewController_1.updatePerformanceReview);
router.delete('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), performanceReviewController_1.deletePerformanceReview);
// Performance-specific operations
router.get('/employee/:employeeId', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager', 'employee'), performanceReviewController_1.getPerformanceReviewsByEmployee);
router.get('/evaluator/:evaluatorId', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), performanceReviewController_1.getPerformanceReviewsByEvaluator);
router.get('/employee/:employeeId/stats', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), performanceReviewController_1.getPerformanceStats);
exports.default = router;
//# sourceMappingURL=performanceReviewRoutes.js.map