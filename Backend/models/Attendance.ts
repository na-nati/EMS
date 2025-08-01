import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendance extends Document {
    employee_id: mongoose.Schema.Types.ObjectId;
    date: Date;
    status: 'Present' | 'Absent' | 'Leave' | 'Half-Day';
    checked_by?: mongoose.Schema.Types.ObjectId;
}

const AttendanceSchema = new Schema<IAttendance>({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Leave', 'Half-Day'],
        required: true,
    },
    checked_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

// Create a compound index to ensure one attendance record per employee per date
AttendanceSchema.index({ employee_id: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model<IAttendance>('Attendance', AttendanceSchema); 