import mongoose, { Document, Schema } from 'mongoose';

export interface ITrainingRequest extends Document {
    employee_id: mongoose.Schema.Types.ObjectId;
    training_id: mongoose.Schema.Types.ObjectId;
    progress: 'Not Started' | 'Ongoing' | 'Completed';
    status: 'Pending' | 'Approved' | 'Rejected';
    requested_at: Date;
}

const TrainingRequestSchema = new Schema<ITrainingRequest>({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    training_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Training',
        required: true,
    },
    progress: {
        type: String,
        enum: ['Not Started', 'Ongoing', 'Completed'],
        default: 'Not Started',
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
        required: true,
    },
    requested_at: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Create a compound index to ensure one training request per employee per training
TrainingRequestSchema.index({ employee_id: 1, training_id: 1 }, { unique: true });

// Create indexes for efficient querying
TrainingRequestSchema.index({ status: 1, requested_at: -1 });
TrainingRequestSchema.index({ progress: 1 });
TrainingRequestSchema.index({ employee_id: 1, status: 1 });

// Auto-update progress based on training status
TrainingRequestSchema.pre('save', function (next) {
    // If training is completed, automatically update progress to completed
    if (this.status === 'Approved') {
        // This could be enhanced with logic to check training completion
        // For now, we'll keep the manual progress tracking
    }
    next();
});

export const TrainingRequest = mongoose.model<ITrainingRequest>('TrainingRequest', TrainingRequestSchema); 