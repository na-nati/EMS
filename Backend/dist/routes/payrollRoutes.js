"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payrollController_1 = require("../controllers/payrollController");
const router = express_1.default.Router();
// CRUD operations
router.post('/', payrollController_1.createPayroll);
router.get('/', payrollController_1.getAllPayrolls);
router.get('/:id', payrollController_1.getPayrollById);
router.put('/:id', payrollController_1.updatePayroll);
router.delete('/:id', payrollController_1.deletePayroll);
// Payroll-specific operations
router.post('/bulk', payrollController_1.bulkCreatePayroll);
router.get('/employee/:employeeId', payrollController_1.getPayrollByEmployee);
router.get('/month/:month/year/:year', payrollController_1.getPayrollByMonthYear);
router.patch('/:id/status', payrollController_1.updatePayrollStatus);
router.get('/stats/:year', payrollController_1.getPayrollStats);
exports.default = router;
