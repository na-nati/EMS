import mongoose, { Document, Schema } from 'mongoose';

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

const SalarySchema = new Schema<ISalary>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    basicSalary: {
        type: Number,
        required: true,
        min: 0,
    },
    bonus: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    deductions: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    netSalary: {
        type: Number,
        required: false,
        min: 0,
    },
    month: {
        type: String,
        required: true,
        maxlength: 20,
    },
    year: {
        type: Number,
        required: true,
        min: 2000,
        max: 2100,
    },
    status: {
        type: String,
        enum: ['paid', 'pending', 'processing'],
        default: 'pending',
    },
}, {
    timestamps: true,
});

// Auto-calculate net salary
SalarySchema.pre('save', function (next) {
    this.netSalary = this.basicSalary + this.bonus - this.deductions;
    next();
});

// Create indexes for efficient querying
SalarySchema.index({ user: 1, month: 1, year: 1 });
SalarySchema.index({ department: 1 });
SalarySchema.index({ status: 1 });

export const Salary = mongoose.model<ISalary>('Salary', SalarySchema);
