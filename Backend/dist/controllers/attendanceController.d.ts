import { Request, Response } from 'express';
export declare const createAttendance: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllAttendance: (req: Request, res: Response) => Promise<void>;
export declare const getAttendanceById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateAttendance: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteAttendance: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAttendanceByEmployee: (req: Request, res: Response) => Promise<void>;
export declare const getAttendanceStats: (req: Request, res: Response) => Promise<void>;
export declare const bulkCreateAttendance: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=attendanceController.d.ts.map