import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'employee' | 'manager' | 'hr' | 'super_admin';
    department?: mongoose.Schema.Types.ObjectId;
    position?: string;
    profilePicture?: string;
    isActive?: boolean;
    tokenVersion?: number;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map