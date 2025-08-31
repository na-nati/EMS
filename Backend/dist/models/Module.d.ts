import mongoose, { Document } from 'mongoose';
export interface IModule extends Document {
    name: string;
    key: string;
    description?: string;
    enabled: boolean;
    company_id?: mongoose.Schema.Types.ObjectId;
}
export declare const Module: mongoose.Model<IModule, {}, {}, {}, mongoose.Document<unknown, {}, IModule, {}, {}> & IModule & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Module.d.ts.map