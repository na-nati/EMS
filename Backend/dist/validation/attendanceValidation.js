"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkAttendanceSchema = exports.updateAttendanceSchema = exports.createAttendanceSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createAttendanceSchema = joi_1.default.object({
    employee_id: joi_1.default.string().required(),
    date: joi_1.default.date().required(),
    check_in: joi_1.default.date().required(),
    check_out: joi_1.default.date().optional(),
    status: joi_1.default.string().required().valid('present', 'absent', 'late', 'half-day', 'leave'),
    notes: joi_1.default.string().optional().max(500),
    checked_by: joi_1.default.string().optional()
});
exports.updateAttendanceSchema = joi_1.default.object({
    date: joi_1.default.date(),
    check_in: joi_1.default.date(),
    check_out: joi_1.default.date(),
    status: joi_1.default.string().valid('present', 'absent', 'late', 'half-day', 'leave'),
    notes: joi_1.default.string().max(500),
    checked_by: joi_1.default.string()
});
exports.bulkAttendanceSchema = joi_1.default.object({
    records: joi_1.default.array().items(exports.createAttendanceSchema).min(1).required()
});
//# sourceMappingURL=attendanceValidation.js.map