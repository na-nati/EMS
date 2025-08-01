"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const managerController_1 = require("../controllers/managerController");
const router = express_1.default.Router();
// CRUD operations
router.post('/', managerController_1.createManager);
router.get('/', managerController_1.getAllManagers);
router.get('/:id', managerController_1.getManagerById);
router.put('/:id', managerController_1.updateManager);
router.delete('/:id', managerController_1.deleteManager);
// Manager-specific operations
router.get('/department/:departmentId', managerController_1.getManagersByDepartment);
router.get('/check/:userId', managerController_1.checkIfUserIsManager);
exports.default = router;
