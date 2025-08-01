"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMulterError = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
// Configure multer for memory storage
const storage = multer_1.default.memoryStorage();
// File filter to only allow images
const fileFilter = (req, file, cb) => {
    console.log('Multer file filter:', {
        originalname: file.originalname,
        mimetype: file.mimetype
    });
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed!'), false);
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
// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer_1.default.MulterError) {
        console.error('Multer error:', error);
        return res.status(400).json({
            success: false,
            message: `File upload error: ${error.message}`
        });
    }
    else if (error) {
        console.error('File upload error:', error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    next();
};
exports.handleMulterError = handleMulterError;
