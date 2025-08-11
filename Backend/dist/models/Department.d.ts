import mongoose, { Document } from 'mongoose';
export interface IDepartment extends Document {
    name: string;
    description?: string;
}
export declare const Department: mongoose.Model<IDepartment, {}, {}, {}, mongoose.Document<unknown, {}, IDepartment, {}, {}> & IDepartment & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Department.d.ts.map