"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const trainingController_1 = require("../controllers/trainingController");
const router = express_1.default.Router();
// CRUD operations
router.post('/', trainingController_1.createTraining);
router.get('/', trainingController_1.getAllTrainings);
router.get('/:id', trainingController_1.getTrainingById);
router.put('/:id', trainingController_1.updateTraining);
router.delete('/:id', trainingController_1.deleteTraining);
// Training-specific operations
router.patch('/:id/status', trainingController_1.updateTrainingStatus);
router.get('/upcoming/all', trainingController_1.getUpcomingTrainings);
router.get('/completed/all', trainingController_1.getCompletedTrainings);
router.get('/stats/all', trainingController_1.getTrainingStats);
exports.default = router;
