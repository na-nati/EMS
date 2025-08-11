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
exports.handleMulterError = exports.upload = void 0;
const multer_1 = __importStar(require("multer"));
// Configure multer for memory storage
const storage = multer_1.default.memoryStorage();
// File filter to only allow images
const fileFilter = (req, file, cb) => {
    console.log('Multer file filter:', {
        originalname: file?.originalname,
        mimetype: file?.mimetype
    });
    if (file?.mimetype?.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed!'));
    }
};
// Configure multer
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});
// Enhanced error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer_1.MulterError) {
        console.error('Multer error:', error);
        return res.status(400).json({
            success: false,
            message: `File upload error: ${error.message}`,
            code: error.code
        });
    }
    if (error instanceof Error) {
        console.error('File upload error:', error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    if (error) {
        console.error('Unknown file upload error:', error);
        return res.status(500).json({
            success: false,
            message: 'An unknown file upload error occurred'
        });
    }
    next();
};
exports.handleMulterError = handleMulterError;
//# sourceMappingURL=uploadMiddleware.js.map