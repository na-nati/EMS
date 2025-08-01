import mongoose, { Document, Schema } from 'mongoose';

export interface IAsset extends Document {
    name: string;
    serial_number: string;
    assigned_to?: mongoose.Schema.Types.ObjectId;
    assigned_at?: Date;
    condition: 'New' | 'Good' | 'Fair' | 'Damaged' | 'Lost' | 'Under Maintenance';
}

const AssetSchema = new Schema<IAsset>({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    serial_number: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 100,
    },
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
    },
    assigned_at: {
        type: Date,
    },
    condition: {
        type: String,
        enum: ['New', 'Good', 'Fair', 'Damaged', 'Lost', 'Under Maintenance'],
        default: 'New',
        required: true,
    },
}, {
    timestamps: true,
});

// Create indexes for efficient querying
AssetSchema.index({ assigned_to: 1 });
AssetSchema.index({ condition: 1 });
AssetSchema.index({ serial_number: 1 });

// Auto-update assigned_at when asset is assigned
AssetSchema.pre('save', function (next) {
    if (this.assigned_to && !this.assigned_at) {
        this.assigned_at = new Date();
    }
    // If asset is unassigned, clear assigned_at
    if (!this.assigned_to) {
        this.assigned_at = undefined;
    }
    next();
});

// Validate that assigned_at is set when asset is assigned
AssetSchema.pre('save', function (next) {
    if (this.assigned_to && !this.assigned_at) {
        next(new Error('Assigned date must be set when asset is assigned to an employee'));
    }
    next();
});

export const Asset = mongoose.model<IAsset>('Asset', AssetSchema); 