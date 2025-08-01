import mongoose, { Document, Schema } from 'mongoose';

export interface ISeparationRequest extends Document {
    employee_id: mongoose.Schema.Types.ObjectId;
    reason: string;
    status: 'pending' | 'approved' | 'hr_processed';
    approved_by?: mongoose.Schema.Types.ObjectId;
    processed_by?: mongoose.Schema.Types.ObjectId;
    created_at: Date;
}

const SeparationRequestSchema = new Schema<ISeparationRequest>({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'hr_processed'],
        default: 'pending',
    },
    approved_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    processed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

export const SeparationRequest = mongoose.model<ISeparationRequest>('SeparationRequest', SeparationRequestSchema); 