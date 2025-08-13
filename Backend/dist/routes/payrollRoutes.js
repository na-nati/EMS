"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payrollController_1 = require("../controllers/payrollController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authMiddleware);
// CRUD operations
router.post('/', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), payrollController_1.createPayroll);
router.get('/', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), payrollController_1.getAllPayrolls);
router.get('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), payrollController_1.getPayrollById);
router.put('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), payrollController_1.updatePayroll);
router.delete('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), payrollController_1.deletePayroll);
// Payroll-specific operations
router.post('/bulk', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), payrollController_1.bulkCreatePayroll);
router.get('/employee/:employeeId', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager', 'employee'), payrollController_1.getPayrollByEmployee);
router.get('/month/:month/year/:year', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), payrollController_1.getPayrollByMonthYear);
router.patch('/:id/status', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), payrollController_1.updatePayrollStatus);
router.get('/stats/:year', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), payrollController_1.getPayrollStats);
exports.default = router;
//# sourceMappingURL=payrollRoutes.js.map