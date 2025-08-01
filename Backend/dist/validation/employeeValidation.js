"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentIdSchema = exports.employeeIdSchema = exports.employeeFiltersSchema = exports.updateEmployeeSchema = exports.createEmployeeSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// Emergency contact schema
const emergencyContactSchema = joi_1.default.object({
    name: joi_1.default.string().required().max(100),
    relationship: joi_1.default.string().required().max(50),
    phone: joi_1.default.string().required().pattern(/^\+?[\d\s\-\(\)]+$/).max(20)
});
// Address schema
const addressSchema = joi_1.default.object({
    street: joi_1.default.string().required().max(200),
    city: joi_1.default.string().required().max(100),
    state: joi_1.default.string().required().max(100),
    zip_code: joi_1.default.string().required().max(20),
    country: joi_1.default.string().required().max(100)
});
// Create employee schema
exports.createEmployeeSchema = joi_1.default.object({
    user_id: joi_1.default.string().required().hex().length(24),
    employee_code: joi_1.default.string().required().max(20).pattern(/^[A-Z0-9]+$/),
    job_profile: joi_1.default.string().required().max(200),
    salary_id: joi_1.default.string().optional().hex().length(24),
    manager_id: joi_1.default.string().optional().hex().length(24),
    joining_date: joi_1.default.date().required().max('now'),
    employment_status: joi_1.default.string().valid('active', 'inactive', 'terminated', 'on_leave').default('active'),
    department_id: joi_1.default.string().optional().hex().length(24),
    position: joi_1.default.string().optional().max(100),
    salary: joi_1.default.number().optional().positive(),
    contact_number: joi_1.default.string().optional().pattern(/^\+?[\d\s\-\(\)]+$/).max(20),
    emergency_contact: emergencyContactSchema.optional(),
    address: addressSchema.optional()
});
// Update employee schema
exports.updateEmployeeSchema = joi_1.default.object({
    user_id: joi_1.default.string().optional().hex().length(24),
    employee_code: joi_1.default.string().optional().max(20).pattern(/^[A-Z0-9]+$/),
    job_profile: joi_1.default.string().optional().max(200),
    salary_id: joi_1.default.string().optional().hex().length(24),
    manager_id: joi_1.default.string().optional().hex().length(24),
    joining_date: joi_1.default.date().optional().max('now'),
    employment_status: joi_1.default.string().valid('active', 'inactive', 'terminated', 'on_leave'),
    department_id: joi_1.default.string().optional().hex().length(24),
    position: joi_1.default.string().optional().max(100),
    salary: joi_1.default.number().optional().positive(),
    contact_number: joi_1.default.string().optional().pattern(/^\+?[\d\s\-\(\)]+$/).max(20),
    emergency_contact: emergencyContactSchema.optional(),
    address: addressSchema.optional()
});
// Employee filters schema
exports.employeeFiltersSchema = joi_1.default.object({
    department_id: joi_1.default.string().optional().hex().length(24),
    employment_status: joi_1.default.string().valid('active', 'inactive', 'terminated', 'on_leave'),
    position: joi_1.default.string().optional().max(100),
    search: joi_1.default.string().optional().max(100),
    page: joi_1.default.number().optional().integer().min(1),
    limit: joi_1.default.number().optional().integer().min(1).max(100)
});
// Employee ID parameter schema
exports.employeeIdSchema = joi_1.default.object({
    id: joi_1.default.string().required().hex().length(24)
});
// Department ID parameter schema
exports.departmentIdSchema = joi_1.default.object({
    departmentId: joi_1.default.string().required().hex().length(24)
});
