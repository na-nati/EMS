import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'employee' | 'manager' | 'hr' | 'super_admin';
    department?: mongoose.Schema.Types.ObjectId; // Reference by ObjectId
    position?: string;
    profilePicture?: string; // URL to profile picture
    isActive?: boolean;
    tokenVersion?: number;
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: false,
    },
    position: {
        type: String,
        trim: true,
    },
    profilePicture: {
        type: String,
        trim: true,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    tokenVersion: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

export const User = mongoose.model<IUser>('User', UserSchema);
