import mongoose, { Document } from 'mongoose';
export interface IDocument extends Document {
    employee_id: mongoose.Schema.Types.ObjectId;
    doc_type: string;
    file_url: string;
    uploaded_by: mongoose.Schema.Types.ObjectId;
    uploaded_at: Date;
    status: 'Approved' | 'Pending' | 'Rejected';
}
export declare const EmployeeDocument: mongoose.Model<IDocument, {}, {}, {}, mongoose.Document<unknown, {}, IDocument, {}, {}> & IDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Document.d.ts.map