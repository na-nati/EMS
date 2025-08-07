import * as Joi from 'joi';

export const createDocumentSchema = Joi.object({
    name: Joi.string().required(),
    doc_type: Joi.string().required(),
    employee_id: Joi.string().required(),
    file_url: Joi.string().uri().required(),
}); 