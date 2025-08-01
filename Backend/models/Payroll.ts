import mongoose, { Document, Schema } from 'mongoose';

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

const PayrollSchema = new Schema<IPayroll>({
    employeeName: {
        type: String,
        required: true,
    },
    employeeId: {
        type: String,
        required: true,
    },
    basicSalary: {
        type: Number,
        required: true,
    },
    bonus: {
        type: Number,
        required: true,
        default: 0,
    },
    deductions: {
        type: Number,
        required: true,
        default: 0,
    },
    netSalary: {
        type: Number,
        required: true,
    },
    month: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['paid', 'pending', 'processing'],
        default: 'pending',
    },
    department: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export const Payroll = mongoose.model<IPayroll>('Payroll', PayrollSchema); 