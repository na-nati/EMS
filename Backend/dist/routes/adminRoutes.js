"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminController_1 = require("../controllers/adminController");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.use((0, authMiddleware_1.authorizeRoles)('super_admin'));
router.post('/', adminController_1.createAdmin);
router.get('/', adminController_1.getAdmins);
router.get('/:id', adminController_1.getAdminById);
router.put('/:id', adminController_1.updateAdmin);
router.delete('/:id', adminController_1.deleteAdmin);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map