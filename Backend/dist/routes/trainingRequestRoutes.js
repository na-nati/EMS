"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const trainingRequestController_1 = require("../controllers/trainingRequestController");
const router = express_1.default.Router();
// CRUD operations
router.post('/', trainingRequestController_1.createTrainingRequest);
router.get('/', trainingRequestController_1.getAllTrainingRequests);
router.get('/:id', trainingRequestController_1.getTrainingRequestById);
router.put('/:id', trainingRequestController_1.updateTrainingRequest);
router.delete('/:id', trainingRequestController_1.deleteTrainingRequest);
// Training request-specific operations
router.patch('/:id/approve', trainingRequestController_1.approveTrainingRequest);
router.patch('/:id/reject', trainingRequestController_1.rejectTrainingRequest);
router.patch('/:id/progress', trainingRequestController_1.updateTrainingProgress);
router.get('/employee/:employeeId', trainingRequestController_1.getTrainingRequestsByEmployee);
router.get('/pending/all', trainingRequestController_1.getPendingTrainingRequests);
exports.default = router;
//# sourceMappingURL=trainingRequestRoutes.js.map