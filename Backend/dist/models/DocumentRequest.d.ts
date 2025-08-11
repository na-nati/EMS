import mongoose, { Document } from 'mongoose';
export interface IDocumentRequest extends Document {
    employee_id: mongoose.Schema.Types.ObjectId;
    requested_doc_type: string;
    request_details: string;
    request_date: Date;
    status: 'Pending' | 'In Progress' | 'Fulfilled' | 'Rejected';
    processed_by?: mongoose.Schema.Types.ObjectId;
    processed_date?: Date;
    hr_notes?: string;
    fulfilled_document_id?: mongoose.Schema.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
}
export declare const DocumentRequest: mongoose.Model<IDocumentRequest, {}, {}, {}, mongoose.Document<unknown, {}, IDocumentRequest, {}, {}> & IDocumentRequest & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=DocumentRequest.d.ts.map