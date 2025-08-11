import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
export declare const upload: multer.Multer;
export declare const handleMulterError: (error: unknown, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
//# sourceMappingURL=uploadMiddleware.d.ts.map