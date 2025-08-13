"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const auditLogController_1 = require("../controllers/auditLogController");
const router = express_1.default.Router();
// Super Admin only access for audit logs
router.use(authMiddleware_1.authMiddleware);
router.use((0, authMiddleware_1.authorizeRoles)('super_admin'));
// CRUD operations
router.post('/', auditLogController_1.createAuditLog);
router.get('/', auditLogController_1.getAllAuditLogs);
router.get('/:id', auditLogController_1.getAuditLogById);
router.put('/:id', auditLogController_1.updateAuditLog);
router.delete('/:id', auditLogController_1.deleteAuditLog);
// Audit-specific operations
router.get('/user/:userId', auditLogController_1.getAuditLogsByUser);
router.get('/table/:targetTable', auditLogController_1.getAuditLogsByTargetTable);
router.get('/stats/all', auditLogController_1.getAuditLogStats);
router.delete('/clear/:days', auditLogController_1.clearOldAuditLogs);
exports.default = router;
//# sourceMappingURL=auditLogRoutes.js.map