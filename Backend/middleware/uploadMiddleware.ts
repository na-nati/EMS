import multer, { Multer, FileFilterCallback, MulterError } from 'multer';
import { Request, Response, NextFunction } from 'express';

// Define custom file type with Express Request extension
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
    }
  }
}

// Configure multer for memory storage
const storage = multer.memoryStorage();

// Type for file filter callback
type FileFilterCallbackType = (
  error: Error | null,
  acceptFile: boolean
) => void;

// File filter to only allow images
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  console.log('Multer file filter:', {
    originalname: file.originalname,
    mimetype: file.mimetype
  });

  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Configure multer with proper typing
export const upload: Multer = multer({
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
  } else if (error instanceof Error) {
    console.error('File upload error:', error);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  } else if (error) {
    console.error('Unknown file upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'An unknown file upload error occurred'
    });
  }
  next();
};