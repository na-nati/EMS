import { Request, Response } from 'express';
export declare const createPayroll: (req: Request, res: Response) => Promise<void>;
export declare const getAllPayrolls: (req: Request, res: Response) => Promise<void>;
export declare const getPayrollById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updatePayroll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deletePayroll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPayrollByEmployee: (req: Request, res: Response) => Promise<void>;
export declare const getPayrollByMonthYear: (req: Request, res: Response) => Promise<void>;
export declare const updatePayrollStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPayrollStats: (req: Request, res: Response) => Promise<void>;
export declare const bulkCreatePayroll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=payrollController.d.ts.map