import { Request, Response } from 'express';
export declare const createCompany: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getCompanies: (_req: Request, res: Response) => Promise<void>;
export declare const getCompanyById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateCompany: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteCompany: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=companyController.d.ts.map