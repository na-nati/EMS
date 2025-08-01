"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leaveRequestController_1 = require("../controllers/leaveRequestController");
const router = express_1.default.Router();
// CRUD operations
router.post('/', leaveRequestController_1.createLeaveRequest);
router.get('/', leaveRequestController_1.getAllLeaveRequests);
router.get('/:id', leaveRequestController_1.getLeaveRequestById);
router.put('/:id', leaveRequestController_1.updateLeaveRequest);
router.delete('/:id', leaveRequestController_1.deleteLeaveRequest);
// Leave-specific operations
router.patch('/:id/approve', leaveRequestController_1.approveLeaveRequest);
router.patch('/:id/reject', leaveRequestController_1.rejectLeaveRequest);
router.get('/employee/:employeeId', leaveRequestController_1.getLeaveRequestsByEmployee);
router.get('/pending/all', leaveRequestController_1.getPendingLeaveRequests);
exports.default = router;
