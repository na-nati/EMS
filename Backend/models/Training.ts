import mongoose, { Document, Schema } from 'mongoose';

export interface ITraining extends Document {
    course_name: string;
    description: string;
    start_date: Date;
    end_date: Date;
    status: 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';
}

const TrainingSchema = new Schema<ITraining>({
    course_name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
    },
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Planned', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Planned',
        required: true,
    },
}, {
    timestamps: true,
});

// Create indexes for efficient querying
TrainingSchema.index({ status: 1, start_date: 1 });
TrainingSchema.index({ course_name: 1 });

// Validate that end_date is after start_date
TrainingSchema.pre('save', function (next) {
    if (this.end_date <= this.start_date) {
        next(new Error('Training end date must be after start date'));
    }
    next();
});

export const Training = mongoose.model<ITraining>('Training', TrainingSchema); 