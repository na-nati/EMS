import multer from 'multer';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to only allow images
const fileFilter = (req: any, file: any, cb: any) => {
    console.log('Multer file filter:', {
        originalname: file.originalname,
        mimetype: file.mimetype
    });

    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Configure multer
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

// Error handling middleware for multer
export const handleMulterError = (error: any, req: any, res: any, next: any) => {
    if (error instanceof multer.MulterError) {
        console.error('Multer error:', error);
        return res.status(400).json({
            success: false,
            message: `File upload error: ${error.message}`
        });
    } else if (error) {
        console.error('File upload error:', error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    next();
}; 