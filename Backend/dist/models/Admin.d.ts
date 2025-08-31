import mongoose, { Document } from 'mongoose';
export interface IAdmin extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    company_id?: mongoose.Schema.Types.ObjectId;
    role: 'super_admin' | 'admin';
    permissions?: string[];
}
export declare const Admin: mongoose.Model<IAdmin, {}, {}, {}, mongoose.Document<unknown, {}, IAdmin, {}, {}> & IAdmin & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Admin.d.ts.map