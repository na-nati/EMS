"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
function validateBody(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                message: 'Validation error',
                details: error.details.map((d) => d.message),
            });
        }
        next();
    };
}
//# sourceMappingURL=validateBody.js.map