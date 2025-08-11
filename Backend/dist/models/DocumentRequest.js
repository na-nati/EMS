"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentRequest = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const DocumentRequestSchema = new mongoose_1.Schema({
    employee_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
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
exports.DocumentRequest = mongoose_1.default.model('DocumentRequest', DocumentRequestSchema);
//# sourceMappingURL=DocumentRequest.js.map