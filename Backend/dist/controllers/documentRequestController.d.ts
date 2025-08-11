import { Request, Response } from 'express';
export declare const createDocumentRequest: (req: Request, res: Response) => Promise<void>;
export declare const getAllDocumentRequests: (req: Request, res: Response) => Promise<void>;
export declare const getDocumentRequestById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateDocumentRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteDocumentRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateDocumentRequestStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const fulfillDocumentRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getDocumentRequestsByEmployee: (req: Request, res: Response) => Promise<void>;
export declare const getPendingDocumentRequests: (req: Request, res: Response) => Promise<void>;
export declare const getDocumentRequestStats: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=documentRequestController.d.ts.map