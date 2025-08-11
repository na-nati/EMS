import Joi from 'joi';

export const createLeaveRequestSchema = Joi.object({
    employee_id: Joi.string().required(),
    leave_type: Joi.string().required().valid('annual', 'sick', 'personal', 'maternity', 'paternity', 'other'),
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    reason: Joi.string().required().min(10).max(500),
    status: Joi.string().default('pending').valid('pending', 'approved', 'rejected'),
    approved_by: Joi.string().optional(),
    approved_at: Joi.date().optional(),
    notes: Joi.string().optional().max(500)
});

export const updateLeaveRequestSchema = Joi.object({
    leave_type: Joi.string().valid('annual', 'sick', 'personal', 'maternity', 'paternity', 'other'),
    start_date: Joi.date(),
    end_date: Joi.date(),
    reason: Joi.string().min(10).max(500),
    status: Joi.string().valid('pending', 'approved', 'rejected'),
    approved_by: Joi.string(),
    approved_at: Joi.date(),
    notes: Joi.string().max(500)
});

export const approveLeaveRequestSchema = Joi.object({
    approved_by: Joi.string().required(),
    notes: Joi.string().optional().max(500)
});
