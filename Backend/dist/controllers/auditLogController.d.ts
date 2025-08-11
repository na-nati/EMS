import { Request, Response } from 'express';
export declare const createAuditLog: (req: Request, res: Response) => Promise<void>;
export declare const getAllAuditLogs: (req: Request, res: Response) => Promise<void>;
export declare const getAuditLogById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateAuditLog: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteAuditLog: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAuditLogsByUser: (req: Request, res: Response) => Promise<void>;
export declare const getAuditLogsByTargetTable: (req: Request, res: Response) => Promise<void>;
export declare const getAuditLogStats: (req: Request, res: Response) => Promise<void>;
export declare const clearOldAuditLogs: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=auditLogController.d.ts.map