import mongoose, { Document } from 'mongoose';
export interface ITraining extends Document {
    course_name: string;
    description: string;
    start_date: Date;
    end_date: Date;
    status: 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';
}
export declare const Training: mongoose.Model<ITraining, {}, {}, {}, mongoose.Document<unknown, {}, ITraining, {}, {}> & ITraining & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Training.d.ts.map