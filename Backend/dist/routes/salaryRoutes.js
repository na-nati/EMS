"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const salaryController_1 = require("../controllers/salaryController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authMiddleware);
router.post('/', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), salaryController_1.createSalary);
router.get('/', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), salaryController_1.getAllSalaries);
router.get('/user/:userId', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'employee'), salaryController_1.getSalariesByUser);
router.get('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), salaryController_1.getSalaryById);
router.put('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), salaryController_1.updateSalary);
router.delete('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), salaryController_1.deleteSalary);
exports.default = router;
//# sourceMappingURL=salaryRoutes.js.map