"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employeeController_1 = require("../controllers/employeeController");
const router = express_1.default.Router();
// CRUD operations
router.post('/', employeeController_1.createEmployee);
router.get('/', employeeController_1.getAllEmployees);
router.get('/:id', employeeController_1.getEmployeeById);
router.put('/:id', employeeController_1.updateEmployee);
router.delete('/:id', employeeController_1.deleteEmployee);
// Employee-specific operations
router.get('/department/:departmentId', employeeController_1.getEmployeesByDepartment);
router.get('/stats/all', employeeController_1.getEmployeeStats);
exports.default = router;
