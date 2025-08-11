import multer, { FileFilterCallback, MulterError } from 'multer';
import { Request, Response, NextFunction } from 'express';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to only allow images
const fileFilter = (
  req: Request,
  file: any,
  cb: FileFilterCallback
) => {
  console.log('Multer file filter:', {
    originalname: file?.originalname,
    mimetype: file?.mimetype
  });

  if (file?.mimetype?.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
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

// Enhanced error handling middleware for multer
export const handleMulterError = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof MulterError) {
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