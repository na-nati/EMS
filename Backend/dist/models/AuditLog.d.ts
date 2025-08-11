import mongoose, { Document } from 'mongoose';
export interface IAuditLog extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    action: string;
    target_table: string;
    timestamp: Date;
    details?: string;
    ip_address?: string;
    user_agent?: string;
}
export declare const AuditLog: mongoose.Model<IAuditLog, {}, {}, {}, mongoose.Document<unknown, {}, IAuditLog, {}, {}> & IAuditLog & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=AuditLog.d.ts.map