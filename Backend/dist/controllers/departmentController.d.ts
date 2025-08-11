import { Request, Response } from 'express';
export declare const createDepartment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Get all Departments with their active employee counts and manager names.
 * This function uses a Mongoose aggregation pipeline for optimal performance,
 * executing only a single query to the database.
 */
export declare const getDepartments: (req: Request, res: Response) => Promise<void>;
export declare const getDepartmentById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateDepartment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteDepartment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=departmentController.d.ts.map