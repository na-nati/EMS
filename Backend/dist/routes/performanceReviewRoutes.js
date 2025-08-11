"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const performanceReviewController_1 = require("../controllers/performanceReviewController");
const router = express_1.default.Router();
// CRUD operations
router.post('/', performanceReviewController_1.createPerformanceReview);
router.get('/', performanceReviewController_1.getAllPerformanceReviews);
router.get('/:id', performanceReviewController_1.getPerformanceReviewById);
router.put('/:id', performanceReviewController_1.updatePerformanceReview);
router.delete('/:id', performanceReviewController_1.deletePerformanceReview);
// Performance-specific operations
router.get('/employee/:employeeId', performanceReviewController_1.getPerformanceReviewsByEmployee);
router.get('/evaluator/:evaluatorId', performanceReviewController_1.getPerformanceReviewsByEvaluator);
router.get('/employee/:employeeId/stats', performanceReviewController_1.getPerformanceStats);
exports.default = router;
//# sourceMappingURL=performanceReviewRoutes.js.map