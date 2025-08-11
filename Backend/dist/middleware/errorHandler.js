"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    console.error(err.stack || err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        details: err.details || undefined,
    });
}
//# sourceMappingURL=errorHandler.js.map