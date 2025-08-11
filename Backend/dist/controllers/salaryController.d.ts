import { Request, Response } from 'express';
export declare const createSalary: (req: Request, res: Response) => Promise<void>;
export declare const getAllSalaries: (req: Request, res: Response) => Promise<void>;
export declare const getSalaryById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateSalary: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteSalary: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getSalariesByUser: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=salaryController.d.ts.map