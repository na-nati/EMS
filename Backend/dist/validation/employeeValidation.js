"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentIdSchema = exports.employeeIdSchema = exports.employeeFiltersSchema = exports.updateEmployeeSchema = exports.createEmployeeSchema = void 0;
const Joi = __importStar(require("joi"));
// Emergency contact schema
const emergencyContactSchema = Joi.object({
    name: Joi.string().required().max(100),
    relationship: Joi.string().required().max(50),
    phone: Joi.string().required().pattern(/^\+?[\d\s\-\(\)]+$/).max(20)
});
// Address schema
const addressSchema = Joi.object({
    street: Joi.string().required().max(200),
    city: Joi.string().required().max(100),
    state: Joi.string().required().max(100),
    zip_code: Joi.string().required().max(20),
    country: Joi.string().required().max(100)
});
// Create employee schema
exports.createEmployeeSchema = Joi.object({
    user_id: Joi.string().required().hex().length(24),
    employee_code: Joi.string().required().max(20).pattern(/^[A-Z0-9]+$/),
    job_profile: Joi.string().required().max(200),
    salary_id: Joi.string().optional().hex().length(24),
    manager_id: Joi.string().optional().hex().length(24),
    joining_date: Joi.date().required().max('now'),
    employment_status: Joi.string().valid('active', 'inactive', 'terminated', 'on_leave').default('active'),
    department_id: Joi.string().optional().hex().length(24),
    position: Joi.string().optional().max(100),
    salary: Joi.number().optional().positive(),
    contact_number: Joi.string().optional().pattern(/^\+?[\d\s\-\(\)]+$/).max(20),
    emergency_contact: emergencyContactSchema.optional(),
    address: addressSchema.optional()
});
// Update employee schema
exports.updateEmployeeSchema = Joi.object({
    user_id: Joi.string().optional().hex().length(24),
    employee_code: Joi.string().optional().max(20).pattern(/^[A-Z0-9]+$/),
    job_profile: Joi.string().optional().max(200),
    salary_id: Joi.string().optional().hex().length(24),
    manager_id: Joi.string().optional().hex().length(24),
    joining_date: Joi.date().optional().max('now'),
    employment_status: Joi.string().valid('active', 'inactive', 'terminated', 'on_leave'),
    department_id: Joi.string().optional().hex().length(24),
    position: Joi.string().optional().max(100),
    salary: Joi.number().optional().positive(),
    contact_number: Joi.string().optional().pattern(/^\+?[\d\s\-\(\)]+$/).max(20),
    emergency_contact: emergencyContactSchema.optional(),
    address: addressSchema.optional()
});
// Employee filters schema
exports.employeeFiltersSchema = Joi.object({
    department_id: Joi.string().optional().hex().length(24),
    employment_status: Joi.string().valid('active', 'inactive', 'terminated', 'on_leave'),
    position: Joi.string().optional().max(100),
    search: Joi.string().optional().max(100),
    page: Joi.number().optional().integer().min(1),
    limit: Joi.number().optional().integer().min(1).max(100)
});
// Employee ID parameter schema
exports.employeeIdSchema = Joi.object({
    id: Joi.string().required().hex().length(24)
});
// Department ID parameter schema
exports.departmentIdSchema = Joi.object({
    departmentId: Joi.string().required().hex().length(24)
});
//# sourceMappingURL=employeeValidation.js.map