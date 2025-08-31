import mongoose, { Document } from 'mongoose';
export interface ISalary extends Document {
    user: mongoose.Schema.Types.ObjectId;
    basicSalary: number;
    bonus: number;
    deductions: number;
    netSalary: number;
    month: string;
    year: number;
    status: 'paid' | 'pending' | 'processing';
}
export declare const Salary: mongoose.Model<ISalary, {}, {}, {}, mongoose.Document<unknown, {}, ISalary, {}, {}> & ISalary & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Salary.d.ts.map