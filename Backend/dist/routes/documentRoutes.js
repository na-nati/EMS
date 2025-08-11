"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const documentController_1 = require("../controllers/documentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Apply authentication middleware to all routes
router.use(authMiddleware_1.authMiddleware);
// Document routes
router.get('/documents', documentController_1.getAllDocuments);
router.get('/documents/:id', documentController_1.getDocument);
router.post('/documents', documentController_1.createDocument);
router.put('/documents/:id', documentController_1.updateDocument);
router.delete('/documents/:id', documentController_1.deleteDocument);
// Document request routes
router.get('/requests', documentController_1.getAllDocumentRequests);
router.get('/requests/:id', documentController_1.getDocumentRequest);
router.post('/requests', documentController_1.createDocumentRequest);
router.put('/requests/:id', documentController_1.updateDocumentRequest);
exports.default = router;
//# sourceMappingURL=documentRoutes.js.map