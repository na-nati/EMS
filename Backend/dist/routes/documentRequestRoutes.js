"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const documentRequestController_1 = require("../controllers/documentRequestController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authMiddleware);
// CRUD operations
router.post('/', (0, authMiddleware_1.authorizeRoles)('employee'), documentRequestController_1.createDocumentRequest);
router.get('/', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'employee'), documentRequestController_1.getAllDocumentRequests);
router.get('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'employee'), documentRequestController_1.getDocumentRequestById);
router.put('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), documentRequestController_1.updateDocumentRequest);
router.delete('/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), documentRequestController_1.deleteDocumentRequest);
// Document request-specific operations
router.patch('/:id/status', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), documentRequestController_1.updateDocumentRequestStatus);
router.patch('/:id/fulfill', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), documentRequestController_1.fulfillDocumentRequest);
router.get('/employee/:employeeId', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'manager', 'employee'), documentRequestController_1.getDocumentRequestsByEmployee);
router.get('/pending/all', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), documentRequestController_1.getPendingDocumentRequests);
router.get('/stats/all', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), documentRequestController_1.getDocumentRequestStats);
exports.default = router;
//# sourceMappingURL=documentRequestRoutes.js.map