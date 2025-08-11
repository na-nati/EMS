import { Request, Response } from 'express';
export declare const createAsset: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllAssets: (req: Request, res: Response) => Promise<void>;
export declare const getAssetById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateAsset: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteAsset: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const assignAsset: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const unassignAsset: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAssetsByEmployee: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=assetController.d.ts.map