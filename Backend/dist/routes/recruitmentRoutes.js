"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recruitmentController_1 = require("../controllers/recruitmentController");
const router = express_1.default.Router();
// CRUD operations
router.post('/', recruitmentController_1.createRecruitment);
router.get('/', recruitmentController_1.getAllRecruitments);
router.get('/:id', recruitmentController_1.getRecruitmentById);
router.put('/:id', recruitmentController_1.updateRecruitment);
router.delete('/:id', recruitmentController_1.deleteRecruitment);
// Recruitment-specific operations
router.patch('/:id/status', recruitmentController_1.updateRecruitmentStatus);
router.get('/requester/:requesterId', recruitmentController_1.getRecruitmentsByRequester);
router.get('/active/all', recruitmentController_1.getActiveRecruitments);
router.get('/stats/all', recruitmentController_1.getRecruitmentStats);
exports.default = router;
//# sourceMappingURL=recruitmentRoutes.js.map