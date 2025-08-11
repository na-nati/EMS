import { Request, Response } from 'express';
export declare const getAllDocuments: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getDocument: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createDocument: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateDocument: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteDocument: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllDocumentRequests: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createDocumentRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateDocumentRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getDocumentRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=documentController.d.ts.map