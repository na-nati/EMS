"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveLeaveRequestSchema = exports.updateLeaveRequestSchema = exports.createLeaveRequestSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createLeaveRequestSchema = joi_1.default.object({
    employee_id: joi_1.default.string().required(),
    leave_type: joi_1.default.string().optional().valid('annual', 'sick', 'personal', 'maternity', 'paternity', 'other'),
    start_date: joi_1.default.date().required(),
    end_date: joi_1.default.date().required(),
    reason: joi_1.default.string().required().min(4).max(500),
    status: joi_1.default.string().default('pending').valid('pending', 'approved', 'rejected'),
    approved_by: joi_1.default.string().optional(),
    approved_at: joi_1.default.date().optional(),
    notes: joi_1.default.string().optional().max(500)
});
exports.updateLeaveRequestSchema = joi_1.default.object({
    leave_type: joi_1.default.string().valid('annual', 'sick', 'personal', 'maternity', 'paternity', 'other'),
    start_date: joi_1.default.date(),
    end_date: joi_1.default.date(),
    reason: joi_1.default.string().min(10).max(500),
    status: joi_1.default.string().valid('pending', 'approved', 'rejected'),
    approved_by: joi_1.default.string(),
    approved_at: joi_1.default.date(),
    notes: joi_1.default.string().max(500)
});
exports.approveLeaveRequestSchema = joi_1.default.object({
    approved_by: joi_1.default.string().optional(),
    notes: joi_1.default.string().optional().max(500)
});
//# sourceMappingURL=leaveRequestValidation.js.map