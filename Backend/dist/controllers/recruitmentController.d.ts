import { Request, Response } from 'express';
export declare const createRecruitment: (req: Request, res: Response) => Promise<void>;
export declare const getAllRecruitments: (req: Request, res: Response) => Promise<void>;
export declare const getRecruitmentById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateRecruitment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteRecruitment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateRecruitmentStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getRecruitmentsByRequester: (req: Request, res: Response) => Promise<void>;
export declare const getActiveRecruitments: (req: Request, res: Response) => Promise<void>;
export declare const getRecruitmentStats: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=recruitmentController.d.ts.map