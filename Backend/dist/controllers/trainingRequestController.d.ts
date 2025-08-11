import { Request, Response } from 'express';
export declare const createTrainingRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllTrainingRequests: (req: Request, res: Response) => Promise<void>;
export declare const getTrainingRequestById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateTrainingRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteTrainingRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const approveTrainingRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const rejectTrainingRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateTrainingProgress: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getTrainingRequestsByEmployee: (req: Request, res: Response) => Promise<void>;
export declare const getPendingTrainingRequests: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=trainingRequestController.d.ts.map