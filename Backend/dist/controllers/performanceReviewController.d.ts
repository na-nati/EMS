import { Request, Response } from 'express';
export declare const createPerformanceReview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllPerformanceReviews: (req: Request, res: Response) => Promise<void>;
export declare const getPerformanceReviewById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updatePerformanceReview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deletePerformanceReview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPerformanceReviewsByEmployee: (req: Request, res: Response) => Promise<void>;
export declare const getPerformanceReviewsByEvaluator: (req: Request, res: Response) => Promise<void>;
export declare const getPerformanceStats: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=performanceReviewController.d.ts.map