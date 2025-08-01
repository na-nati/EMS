"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const documentRequestController_1 = require("../controllers/documentRequestController");
const router = express_1.default.Router();
// CRUD operations
router.post('/', documentRequestController_1.createDocumentRequest);
router.get('/', documentRequestController_1.getAllDocumentRequests);
router.get('/:id', documentRequestController_1.getDocumentRequestById);
router.put('/:id', documentRequestController_1.updateDocumentRequest);
router.delete('/:id', documentRequestController_1.deleteDocumentRequest);
// Document request-specific operations
router.patch('/:id/status', documentRequestController_1.updateDocumentRequestStatus);
router.patch('/:id/fulfill', documentRequestController_1.fulfillDocumentRequest);
router.get('/employee/:employeeId', documentRequestController_1.getDocumentRequestsByEmployee);
router.get('/pending/all', documentRequestController_1.getPendingDocumentRequests);
router.get('/stats/all', documentRequestController_1.getDocumentRequestStats);
exports.default = router;
