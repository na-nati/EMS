"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const salaryController_1 = require("../controllers/salaryController");
const router = express_1.default.Router();
router.post('/', salaryController_1.createSalary);
router.get('/', salaryController_1.getAllSalaries);
router.get('/:id', salaryController_1.getSalaryById);
router.put('/:id', salaryController_1.updateSalary);
router.delete('/:id', salaryController_1.deleteSalary);
exports.default = router;
