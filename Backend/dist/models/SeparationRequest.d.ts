import mongoose, { Document } from 'mongoose';
export interface ISeparationRequest extends Document {
    employee_id: mongoose.Schema.Types.ObjectId;
    reason: string;
    status: 'pending' | 'approved' | 'hr_processed';
    approved_by?: mongoose.Schema.Types.ObjectId;
    processed_by?: mongoose.Schema.Types.ObjectId;
    created_at: Date;
}
export declare const SeparationRequest: mongoose.Model<ISeparationRequest, {}, {}, {}, mongoose.Document<unknown, {}, ISeparationRequest, {}, {}> & ISeparationRequest & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=SeparationRequest.d.ts.map