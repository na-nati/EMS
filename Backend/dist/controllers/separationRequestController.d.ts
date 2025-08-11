import { Request, Response } from 'express';
export declare const createSeparationRequest: (req: Request, res: Response) => Promise<void>;
export declare const getAllSeparationRequests: (req: Request, res: Response) => Promise<void>;
export declare const getSeparationRequestById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateSeparationRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteSeparationRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const approveSeparationRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const processSeparationRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getSeparationRequestsByEmployee: (req: Request, res: Response) => Promise<void>;
export declare const getPendingSeparationRequests: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=separationRequestController.d.ts.map