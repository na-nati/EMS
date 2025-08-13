"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attendanceController_1 = require("../controllers/attendanceController");
const validateBody_1 = require("../middleware/validateBody");
const attendanceValidation_1 = require("../validation/attendanceValidation");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Apply authentication to all routes
router.use(authMiddleware_1.authMiddleware);
// CRUD operations
router.post('/', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), (0, validateBody_1.validateBody)(attendanceValidation_1.createAttendanceSchema), attendanceController_1.createAttendance);
router.get('/', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager', 'employee'), attendanceController_1.getAllAttendance);
router.get('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager', 'employee'), attendanceController_1.getAttendanceById);
router.put('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), (0, validateBody_1.validateBody)(attendanceValidation_1.updateAttendanceSchema), attendanceController_1.updateAttendance);
router.delete('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), attendanceController_1.deleteAttendance);
// Attendance-specific operations
router.post('/bulk', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), (0, validateBody_1.validateBody)(attendanceValidation_1.bulkAttendanceSchema), attendanceController_1.bulkCreateAttendance);
router.get('/employee/:employeeId', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager', 'employee'), attendanceController_1.getAttendanceByEmployee);
router.get('/employee/:employeeId/stats', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), attendanceController_1.getAttendanceStats);
exports.default = router;
//# sourceMappingURL=attendanceRoutes.js.map