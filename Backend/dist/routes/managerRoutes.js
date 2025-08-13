"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const managerController_1 = require("../controllers/managerController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authMiddleware);
// CRUD operations
router.post('/', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), managerController_1.createManager);
router.get('/', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), managerController_1.getAllManagers);
router.get('/managers', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), managerController_1.getManagers);
router.get('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), managerController_1.getManagerById);
router.put('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), managerController_1.updateManager);
router.delete('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), managerController_1.deleteManager);
// Manager-specific operations
router.get('/department/:departmentId', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), managerController_1.getManagersByDepartment);
router.get('/check/:userId', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager'), managerController_1.checkIfUserIsManager);
exports.default = router;
//# sourceMappingURL=managerRoutes.js.map