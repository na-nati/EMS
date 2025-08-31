import mongoose, { Document, Schema } from 'mongoose';

export interface IModule extends Document {
    name: string;
    key: string; // unique identifier like 'hr', 'payroll', etc.
    description?: string;
    enabled: boolean;
    company_id?: mongoose.Schema.Types.ObjectId; // optional company scoping
}

const ModuleSchema = new Schema<IModule>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    key: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    description: {
        type: String,
        trim: true,
    },
    enabled: {
        type: Boolean,
        default: true,
    },
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    },
}, {
    timestamps: true,
});

export const Module = mongoose.model<IModule>('Module', ModuleSchema);

