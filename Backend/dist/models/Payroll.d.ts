import mongoose, { Document } from 'mongoose';
export interface IPayroll extends Document {
    employeeName: string;
    employeeId: string;
    basicSalary: number;
    bonus: number;
    deductions: number;
    netSalary: number;
    month: string;
    year: number;
    status: 'paid' | 'pending' | 'processing';
    department: string;
}
export declare const Payroll: mongoose.Model<IPayroll, {}, {}, {}, mongoose.Document<unknown, {}, IPayroll, {}, {}> & IPayroll & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Payroll.d.ts.map