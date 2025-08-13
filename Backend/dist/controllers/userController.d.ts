import { Request, Response } from 'express';
export declare const registeruser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const loginuser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const refreshToken: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const logout: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllUsers: (req: Request, res: Response) => Promise<void>;
export declare const updateProfilePicture: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=userController.d.ts.map