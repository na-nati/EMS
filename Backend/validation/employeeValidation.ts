import Joi from 'joi';

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
export const createEmployeeSchema = Joi.object({
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
export const updateEmployeeSchema = Joi.object({
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
export const employeeFiltersSchema = Joi.object({
    department_id: Joi.string().optional().hex().length(24),
    employment_status: Joi.string().valid('active', 'inactive', 'terminated', 'on_leave'),
    position: Joi.string().optional().max(100),
    search: Joi.string().optional().max(100),
    page: Joi.number().optional().integer().min(1),
    limit: Joi.number().optional().integer().min(1).max(100)
});

// Employee ID parameter schema
export const employeeIdSchema = Joi.object({
    id: Joi.string().required().hex().length(24)
});

// Department ID parameter schema
export const departmentIdSchema = Joi.object({
    departmentId: Joi.string().required().hex().length(24)
}); 