import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployee extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    employee_code: string;
    job_profile: string;
    salary_id?: mongoose.Schema.Types.ObjectId;
    manager_id?: mongoose.Schema.Types.ObjectId;
    department_id?: mongoose.Schema.Types.ObjectId;
    joining_date: Date;
    employment_status: 'Active' | 'Resigned' | 'Terminated';
}

const EmployeeSchema = new Schema<IEmployee>({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true,
    },
    employee_code: {
        type: String,
        unique: true,
        required: true,
    },
    job_profile: {
        type: String,
        required: true,
    },
    salary_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salary',
    },
    manager_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    department_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
    },
    joining_date: {
        type: Date,
        required: true,
    },
    employment_status: {
        type: String,
        enum: ['Active', 'Resigned', 'Terminated'],
        default: 'Active',
    },
}, {
    timestamps: true,
});

export const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema); 