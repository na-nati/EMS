"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const documentController_1 = require("../controllers/documentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Apply authentication middleware to all routes
router.use(authMiddleware_1.authMiddleware);
// Document routes
router.get('/documents', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'employee'), documentController_1.getAllDocuments);
router.get('/documents/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'employee'), documentController_1.getDocument);
router.post('/documents', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), documentController_1.createDocument);
router.put('/documents/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), documentController_1.updateDocument);
router.delete('/documents/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), documentController_1.deleteDocument);
// Document request routes
router.get('/requests', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'employee'), documentController_1.getAllDocumentRequests);
router.get('/requests/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr', 'employee'), documentController_1.getDocumentRequest);
router.post('/requests', (0, authMiddleware_1.authorizeRoles)('employee'), documentController_1.createDocumentRequest);
router.put('/requests/:id', (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), documentController_1.updateDocumentRequest);
exports.default = router;
//# sourceMappingURL=documentRoutes.js.map