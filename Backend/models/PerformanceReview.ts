import mongoose, { Document, Schema } from 'mongoose';

export interface IPerformanceReview extends Document {
    employee_id: mongoose.Schema.Types.ObjectId;
    evaluator_id: mongoose.Schema.Types.ObjectId;
    period_start: Date;
    period_end: Date;
    self_assessment: string;
    score: number;
    feedback: string;
}

const PerformanceReviewSchema = new Schema<IPerformanceReview>({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    evaluator_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    period_start: {
        type: Date,
        required: true,
    },
    period_end: {
        type: Date,
        required: true,
    },
    self_assessment: {
        type: String,
        required: true,
        trim: true,
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    feedback: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});

// Create a compound index to ensure one performance review per employee per period
PerformanceReviewSchema.index({ employee_id: 1, period_start: 1, period_end: 1 }, { unique: true });

// Validate that period_end is after period_start
PerformanceReviewSchema.pre('save', function (next) {
    if (this.period_end <= this.period_start) {
        next(new Error('Period end date must be after period start date'));
    }
    next();
});

export const PerformanceReview = mongoose.model<IPerformanceReview>('PerformanceReview', PerformanceReviewSchema); 