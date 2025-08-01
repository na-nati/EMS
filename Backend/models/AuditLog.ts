import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    action: string;
    target_table: string;
    timestamp: Date;
    details?: string;
    ip_address?: string;
    user_agent?: string;
}

const AuditLogSchema = new Schema<IAuditLog>({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    action: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
    },
    target_table: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
        enum: [
            'User',
            'Employee',
            'Department',
            'LeaveRequest',
            'Payroll',
            'Salary',
            'Manager',
            'SeparationRequest',
            'Attendance',
            'PerformanceReview',
            'Document',
            'DocumentRequest',
            'Recruitment',
            'Training',
            'TrainingRequest',
            'Asset',
            'AuditLog'
        ],
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    },
    details: {
        type: String,
        trim: true,
        maxlength: 1000,
    },
    ip_address: {
        type: String,
        trim: true,
        maxlength: 45, // IPv6 max length
    },
    user_agent: {
        type: String,
        trim: true,
        maxlength: 500,
    },
}, {
    timestamps: true,
});

// Create indexes for efficient querying and reporting
AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ user_id: 1, timestamp: -1 });
AuditLogSchema.index({ target_table: 1, timestamp: -1 });
AuditLogSchema.index({ action: 1, timestamp: -1 });

// Compound index for comprehensive audit queries
AuditLogSchema.index({ user_id: 1, target_table: 1, timestamp: -1 });

// TTL index to automatically delete old audit logs (optional - uncomment if needed)
// AuditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 }); // 90 days

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema); 