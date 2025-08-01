import mongoose, { Document, Schema } from 'mongoose';

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

const DocumentRequestSchema = new Schema<IDocumentRequest>({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    requested_doc_type: {
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
    request_details: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
    },
    request_date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Fulfilled', 'Rejected'],
        default: 'Pending',
        required: true,
    },
    processed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    processed_date: {
        type: Date,
    },
    hr_notes: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    fulfilled_document_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Update the updated_at field whenever the document is modified
DocumentRequestSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});

// Create indexes for efficient querying
DocumentRequestSchema.index({ employee_id: 1, status: 1 });
DocumentRequestSchema.index({ status: 1, request_date: -1 });

export const DocumentRequest = mongoose.model<IDocumentRequest>('DocumentRequest', DocumentRequestSchema); 