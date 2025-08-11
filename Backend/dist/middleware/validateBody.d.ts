import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
export declare function validateBody(schema: Joi.ObjectSchema): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
//# sourceMappingURL=validateBody.d.ts.map