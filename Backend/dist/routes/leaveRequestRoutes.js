"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leaveRequestController_1 = require("../controllers/leaveRequestController");
const validateBody_1 = require("../middleware/validateBody");
const leaveRequestValidation_1 = require("../validation/leaveRequestValidation");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Apply authentication to all routes
router.use(authMiddleware_1.authMiddleware);
// CRUD operations
router.post('/', (0, validateBody_1.validateBody)(leaveRequestValidation_1.createLeaveRequestSchema), leaveRequestController_1.createLeaveRequest);
router.get('/', leaveRequestController_1.getAllLeaveRequests);
router.get('/:id', leaveRequestController_1.getLeaveRequestById);
router.put('/:id', (0, validateBody_1.validateBody)(leaveRequestValidation_1.updateLeaveRequestSchema), leaveRequestController_1.updateLeaveRequest);
router.delete('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), leaveRequestController_1.deleteLeaveRequest);
// Leave request-specific operations
router.patch('/:id/approve', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), (0, validateBody_1.validateBody)(leaveRequestValidation_1.approveLeaveRequestSchema), leaveRequestController_1.approveLeaveRequest);
router.patch('/:id/reject', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), (0, validateBody_1.validateBody)(leaveRequestValidation_1.approveLeaveRequestSchema), leaveRequestController_1.rejectLeaveRequest);
router.get('/employee/:employeeId', leaveRequestController_1.getLeaveRequestsByEmployee);
router.get('/pending/all', leaveRequestController_1.getPendingLeaveRequests);
exports.default = router;
//# sourceMappingURL=leaveRequestRoutes.js.map