import { Request, Response } from 'express';
export declare const createModule: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getModules: (_req: Request, res: Response) => Promise<void>;
export declare const getModuleById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateModule: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteModule: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=moduleController.d.ts.map