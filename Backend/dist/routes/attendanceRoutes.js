"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attendanceController_1 = require("../controllers/attendanceController");
const router = express_1.default.Router();
// CRUD operations
router.post('/', attendanceController_1.createAttendance);
router.get('/', attendanceController_1.getAllAttendance);
router.get('/:id', attendanceController_1.getAttendanceById);
router.put('/:id', attendanceController_1.updateAttendance);
router.delete('/:id', attendanceController_1.deleteAttendance);
// Attendance-specific operations
router.post('/bulk', attendanceController_1.bulkCreateAttendance);
router.get('/employee/:employeeId', attendanceController_1.getAttendanceByEmployee);
router.get('/employee/:employeeId/stats', attendanceController_1.getAttendanceStats);
exports.default = router;
