import { Request, Response } from 'express';
export declare const createAdmin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAdmins: (_req: Request, res: Response) => Promise<void>;
export declare const getAdminById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateAdmin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteAdmin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=adminController.d.ts.map