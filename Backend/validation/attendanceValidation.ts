import Joi from 'joi';

export const createAttendanceSchema = Joi.object({
    employee_id: Joi.string().required(),
    date: Joi.date().required(),
    check_in: Joi.date().required(),
    check_out: Joi.date().optional(),
    status: Joi.string().required().valid('present', 'absent', 'late', 'half-day', 'leave'),
    notes: Joi.string().optional().max(500),
    checked_by: Joi.string().optional()
});

export const updateAttendanceSchema = Joi.object({
    date: Joi.date(),
    check_in: Joi.date(),
    check_out: Joi.date(),
    status: Joi.string().valid('present', 'absent', 'late', 'half-day', 'leave'),
    notes: Joi.string().max(500),
    checked_by: Joi.string()
});

export const bulkAttendanceSchema = Joi.object({
    records: Joi.array().items(createAttendanceSchema).min(1).required()
});
