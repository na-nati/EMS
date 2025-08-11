import mongoose, { Document } from 'mongoose';
export interface IManager extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    department_id: mongoose.Schema.Types.ObjectId;
}
export declare const Manager: mongoose.Model<IManager, {}, {}, {}, mongoose.Document<unknown, {}, IManager, {}, {}> & IManager & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Manager.d.ts.map