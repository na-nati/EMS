import mongoose, { Document } from 'mongoose';
export interface IEmployee extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    employee_code: string;
    job_profile: string;
    salary_id?: mongoose.Schema.Types.ObjectId;
    manager_id?: mongoose.Schema.Types.ObjectId;
    department_id?: mongoose.Schema.Types.ObjectId;
    joining_date: Date;
    employment_status: 'Active' | 'Resigned' | 'Terminated';
    phone_number?: string;
}
export declare const Employee: mongoose.Model<IEmployee, {}, {}, {}, mongoose.Document<unknown, {}, IEmployee, {}, {}> & IEmployee & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Employee.d.ts.map