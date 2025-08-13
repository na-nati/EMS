"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const employeeController_1 = require("../controllers/employeeController");
const router = express_1.default.Router();
// Protect all employee routes
router.use(authMiddleware_1.authMiddleware);
// CRUD operations
router.post('/', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), employeeController_1.createEmployee);
router.get('/', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), employeeController_1.getAllEmployees);
// Dashboard chart endpoints (must come before /:id route)
router.get('/registration-trends', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), employeeController_1.getEmployeeRegistrationTrends);
router.get('/active-leave-trends', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), employeeController_1.getActiveLeaveTrends);
// Employee-specific operations
router.get('/department/:departmentId', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), employeeController_1.getEmployeesByDepartment);
router.get('/stats/all', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), employeeController_1.getEmployeeStats);
// Individual employee operations (must come last)
router.get('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), employeeController_1.getEmployeeById);
router.put('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), employeeController_1.updateEmployee);
router.delete('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), employeeController_1.deleteEmployee);
exports.default = router;
//# sourceMappingURL=employeeRoutes.js.map