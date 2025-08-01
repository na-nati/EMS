import mongoose, { Document, Schema } from 'mongoose';

export interface IRecruitment extends Document {
    requested_by: mongoose.Schema.Types.ObjectId;
    job_title: string;
    requirements: string;
    openings: number;
    status: 'Draft' | 'Posted' | 'In Progress' | 'Closed' | 'Cancelled';
    created_at: Date;
}

const RecruitmentSchema = new Schema<IRecruitment>({
    requested_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    job_title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    requirements: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
    },
    openings: {
        type: Number,
        required: true,
        min: 1,
        max: 100,
    },
    status: {
        type: String,
        enum: ['Draft', 'Posted', 'In Progress', 'Closed', 'Cancelled'],
        default: 'Draft',
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Create indexes for efficient querying
RecruitmentSchema.index({ status: 1, created_at: -1 });
RecruitmentSchema.index({ requested_by: 1 });
RecruitmentSchema.index({ job_title: 1 });

// Validate that openings is a positive number
RecruitmentSchema.pre('save', function (next) {
    if (this.openings <= 0) {
        next(new Error('Number of openings must be greater than 0'));
    }
    next();
});

export const Recruitment = mongoose.model<IRecruitment>('Recruitment', RecruitmentSchema); 