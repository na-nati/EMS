"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const companyController_1 = require("../controllers/companyController");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.post('/', (0, authMiddleware_1.authorizeRoles)('super_admin'), companyController_1.createCompany);
router.get('/', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), companyController_1.getCompanies);
router.get('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), companyController_1.getCompanyById);
router.put('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin'), companyController_1.updateCompany);
router.delete('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin'), companyController_1.deleteCompany);
exports.default = router;
//# sourceMappingURL=companyRoutes.js.map