import Joi from 'joi';

export const createAssetSchema = Joi.object({
    name: Joi.string().required().min(2).max(100),
    serial_number: Joi.string().required().min(3).max(50),
    type: Joi.string().required().valid('laptop', 'desktop', 'mobile', 'tablet', 'other'),
    condition: Joi.string().required().valid('excellent', 'good', 'fair', 'poor'),
    purchase_date: Joi.date().required(),
    warranty_expiry: Joi.date().optional(),
    assigned_to: Joi.string().optional(),
    location: Joi.string().optional(),
    notes: Joi.string().optional().max(500)
});

export const updateAssetSchema = Joi.object({
    name: Joi.string().min(2).max(100),
    serial_number: Joi.string().min(3).max(50),
    type: Joi.string().valid('laptop', 'desktop', 'mobile', 'tablet', 'other'),
    condition: Joi.string().valid('excellent', 'good', 'fair', 'poor'),
    purchase_date: Joi.date(),
    warranty_expiry: Joi.date(),
    assigned_to: Joi.string().optional(),
    location: Joi.string(),
    notes: Joi.string().max(500)
});

export const assignAssetSchema = Joi.object({
    assigned_to: Joi.string().required()
});
