import mongoose, { Document } from 'mongoose';
export interface IAttendance extends Document {
    employee_id: mongoose.Schema.Types.ObjectId;
    date: Date;
    status: 'Present' | 'Absent' | 'Leave' | 'Half-Day';
    checked_by?: mongoose.Schema.Types.ObjectId;
}
export declare const Attendance: mongoose.Model<IAttendance, {}, {}, {}, mongoose.Document<unknown, {}, IAttendance, {}, {}> & IAttendance & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Attendance.d.ts.map