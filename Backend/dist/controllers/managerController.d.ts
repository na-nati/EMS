import { Request, Response } from 'express';
export declare const createManager: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllManagers: (req: Request, res: Response) => Promise<void>;
export declare const getManagerById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateManager: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteManager: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getManagersByDepartment: (req: Request, res: Response) => Promise<void>;
export declare const checkIfUserIsManager: (req: Request, res: Response) => Promise<void>;
export declare const getManagers: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=managerController.d.ts.map