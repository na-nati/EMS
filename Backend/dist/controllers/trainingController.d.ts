import { Request, Response } from 'express';
export declare const createTraining: (req: Request, res: Response) => Promise<void>;
export declare const getAllTrainings: (req: Request, res: Response) => Promise<void>;
export declare const getTrainingById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateTraining: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteTraining: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateTrainingStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUpcomingTrainings: (req: Request, res: Response) => Promise<void>;
export declare const getCompletedTrainings: (req: Request, res: Response) => Promise<void>;
export declare const getTrainingStats: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=trainingController.d.ts.map