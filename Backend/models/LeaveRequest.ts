import mongoose, { Document, Schema } from 'mongoose';

export interface ILeaveRequest extends Document {
    employee_id: mongoose.Schema.Types.ObjectId;
    start_date: Date;
    end_date: Date;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    approved_by?: mongoose.Schema.Types.ObjectId;
    created_at: Date;
}

const LeaveRequestSchema = new Schema<ILeaveRequest>({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    approved_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

export const LeaveRequest = mongoose.model<ILeaveRequest>('LeaveRequest', LeaveRequestSchema); 