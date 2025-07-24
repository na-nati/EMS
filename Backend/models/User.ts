import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'employee' | 'manager' | 'hr' | 'super_admin';
    department?: string;
    position?: string;
    isActive?: boolean;
}

const UserSchema = new Schema<IUser>({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['employee', 'manager', 'hr', 'super_admin'],
        default: 'employee',
    },
    department: {
        type: String,
        trim: true,
    },
    position: {
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

export const User = mongoose.model<IUser>('User', UserSchema);
