import { Request, Response } from 'express';
export declare const createLeaveRequest: (req: Request, res: Response) => Promise<void>;
export declare const getAllLeaveRequests: (req: Request, res: Response) => Promise<void>;
export declare const getLeaveRequestById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateLeaveRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteLeaveRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const approveLeaveRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const rejectLeaveRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getLeaveRequestsByEmployee: (req: Request, res: Response) => Promise<void>;
export declare const getPendingLeaveRequests: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=leaveRequestController.d.ts.map