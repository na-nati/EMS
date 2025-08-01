import mongoose, { Document, Schema } from 'mongoose';

export interface IDocument extends Document {
    employee_id: mongoose.Schema.Types.ObjectId;
    doc_type: string;
    file_url: string;
    uploaded_by: mongoose.Schema.Types.ObjectId;
    uploaded_at: Date;
    status: 'Approved' | 'Pending' | 'Rejected';
}

const DocumentSchema = new Schema<IDocument>({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    doc_type: {
        type: String,
        required: true,
        trim: true,
        enum: [
            'Experience Letter',
            'No Objection Certificate',
            'Payslip',
            'Employment Contract',
            'ID Card',
            'Training Certificate',
            'Performance Review',
            'Disciplinary Notice',
            'Promotion Letter',
            'Termination Letter',
            'Other'
        ],
    },
    file_url: {
        type: String,
        required: true,
        trim: true,
    },
    uploaded_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    uploaded_at: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Approved', 'Pending', 'Rejected'],
        default: 'Pending',
        required: true,
    },
}, {
    timestamps: true,
});

// Create index for efficient querying by employee and document type
DocumentSchema.index({ employee_id: 1, doc_type: 1 });

export const EmployeeDocument = mongoose.model<IDocument>('EmployeeDocument', DocumentSchema); 