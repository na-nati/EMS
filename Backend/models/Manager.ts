import mongoose, { Document, Schema } from 'mongoose';

export interface IManager extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    department_id: mongoose.Schema.Types.ObjectId;
}

const ManagerSchema = new Schema<IManager>({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true,
    },
    department_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
        unique: true // only one manager per department
    }

}, {
    timestamps: true,
});

export const Manager = mongoose.model<IManager>('Manager', ManagerSchema); 