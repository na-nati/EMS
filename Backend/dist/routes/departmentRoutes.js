"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const departmentController_1 = require("../controllers/departmentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)('hr', 'super_admin'), departmentController_1.createDepartment);
router.get('/', authMiddleware_1.authMiddleware, departmentController_1.getDepartments);
router.get('/:id', authMiddleware_1.authMiddleware, departmentController_1.getDepartmentById);
router.put('/:id', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)('hr', 'super_admin'), departmentController_1.updateDepartment);
router.delete('/:id', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)('hr', 'super_admin'), departmentController_1.deleteDepartment);
exports.default = router;
//# sourceMappingURL=departmentRoutes.js.map