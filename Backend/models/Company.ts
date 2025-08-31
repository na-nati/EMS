import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
    name: string;
    domain?: string;
    address?: string;
    phone?: string;
    email?: string;
    description?: string;
    isActive: boolean;
}

const CompanySchema = new Schema<ICompany>({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    domain: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    description: {
        type: String,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

export const Company = mongoose.model<ICompany>('Company', CompanySchema);

