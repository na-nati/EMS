"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const separationRequestController_1 = require("../controllers/separationRequestController");
const router = express_1.default.Router();
// CRUD operations
router.post('/', separationRequestController_1.createSeparationRequest);
router.get('/', separationRequestController_1.getAllSeparationRequests);
router.get('/:id', separationRequestController_1.getSeparationRequestById);
router.put('/:id', separationRequestController_1.updateSeparationRequest);
router.delete('/:id', separationRequestController_1.deleteSeparationRequest);
// Separation-specific operations
router.patch('/:id/approve', separationRequestController_1.approveSeparationRequest);
router.patch('/:id/process', separationRequestController_1.processSeparationRequest);
router.get('/employee/:employeeId', separationRequestController_1.getSeparationRequestsByEmployee);
router.get('/pending/all', separationRequestController_1.getPendingSeparationRequests);
exports.default = router;
//# sourceMappingURL=separationRequestRoutes.js.map