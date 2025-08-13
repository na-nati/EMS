import { Request, Response } from 'express';
export declare const createEmployee: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllEmployees: (req: Request, res: Response) => Promise<void>;
export declare const getEmployeeById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateEmployee: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteEmployee: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getEmployeesByDepartment: (req: Request, res: Response) => Promise<void>;
export declare const getEmployeeStats: (req: Request, res: Response) => Promise<void>;
export declare const getEmployeeRegistrationTrends: (req: Request, res: Response) => Promise<void>;
export declare const getActiveLeaveTrends: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=employeeController.d.ts.map