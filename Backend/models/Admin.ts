import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmin extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    company_id?: mongoose.Schema.Types.ObjectId;
    role: 'super_admin' | 'admin';
    permissions?: string[];
}

const AdminSchema = new Schema<IAdmin>({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    },
    role: {
        type: String,
        enum: ['super_admin', 'admin'],
        required: true,
        default: 'admin',
    },
    permissions: [{
        type: String,
        trim: true,
    }],
}, {
    timestamps: true,
});

export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);

