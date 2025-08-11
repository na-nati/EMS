import { Request, Response } from 'express';
interface MulterRequest extends Request {
    file?: Express.Multer.File;
}
export declare const registeruser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const loginuser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllUsers: (req: Request, res: Response) => Promise<void>;
export declare const updateProfilePicture: (req: MulterRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=userController.d.ts.map