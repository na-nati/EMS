import mongoose, { Document } from 'mongoose';
export interface ILeaveRequest extends Document {
    employee_id: mongoose.Schema.Types.ObjectId;
    start_date: Date;
    end_date: Date;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    approved_by?: mongoose.Schema.Types.ObjectId;
    created_at: Date;
}
export declare const LeaveRequest: mongoose.Model<ILeaveRequest, {}, {}, {}, mongoose.Document<unknown, {}, ILeaveRequest, {}, {}> & ILeaveRequest & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=LeaveRequest.d.ts.map