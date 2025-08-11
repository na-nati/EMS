import mongoose, { Document } from 'mongoose';
export interface ITrainingRequest extends Document {
    employee_id: mongoose.Schema.Types.ObjectId;
    training_id: mongoose.Schema.Types.ObjectId;
    progress: 'Not Started' | 'Ongoing' | 'Completed';
    status: 'Pending' | 'Approved' | 'Rejected';
    requested_at: Date;
}
export declare const TrainingRequest: mongoose.Model<ITrainingRequest, {}, {}, {}, mongoose.Document<unknown, {}, ITrainingRequest, {}, {}> & ITrainingRequest & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=TrainingRequest.d.ts.map