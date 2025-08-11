import mongoose, { Document } from 'mongoose';
export interface IPerformanceReview extends Document {
    employee_id: mongoose.Schema.Types.ObjectId;
    evaluator_id: mongoose.Schema.Types.ObjectId;
    period_start: Date;
    period_end: Date;
    self_assessment: string;
    score: number;
    feedback: string;
}
export declare const PerformanceReview: mongoose.Model<IPerformanceReview, {}, {}, {}, mongoose.Document<unknown, {}, IPerformanceReview, {}, {}> & IPerformanceReview & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=PerformanceReview.d.ts.map