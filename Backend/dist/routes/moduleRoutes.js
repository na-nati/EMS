"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const moduleController_1 = require("../controllers/moduleController");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.post('/', (0, authMiddleware_1.authorizeRoles)('super_admin', 'admin'), moduleController_1.createModule);
router.get('/', (0, authMiddleware_1.authorizeRoles)('super_admin', 'admin', 'hr', 'manager'), moduleController_1.getModules);
router.get('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'admin', 'hr', 'manager'), moduleController_1.getModuleById);
router.put('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'admin'), moduleController_1.updateModule);
router.delete('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin'), moduleController_1.deleteModule);
exports.default = router;
//# sourceMappingURL=moduleRoutes.js.map