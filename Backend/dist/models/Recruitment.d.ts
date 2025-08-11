import mongoose, { Document } from 'mongoose';
export interface IRecruitment extends Document {
    requested_by: mongoose.Schema.Types.ObjectId;
    job_title: string;
    requirements: string;
    openings: number;
    status: 'Draft' | 'Posted' | 'In Progress' | 'Closed' | 'Cancelled';
    created_at: Date;
}
export declare const Recruitment: mongoose.Model<IRecruitment, {}, {}, {}, mongoose.Document<unknown, {}, IRecruitment, {}, {}> & IRecruitment & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Recruitment.d.ts.map