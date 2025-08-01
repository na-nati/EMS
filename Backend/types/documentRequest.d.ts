export interface IDocumentRequest {
    _id?: string;
    employee_id: string;
    requested_doc_type: 'Experience Letter' | 'No Objection Certificate' | 'Payslip' | 'Employment Contract' | 'ID Card' | 'Training Certificate' | 'Performance Review' | 'Disciplinary Notice' | 'Promotion Letter' | 'Termination Letter' | 'Other';
    request_details: string;
    request_date: Date;
    status: 'Pending' | 'In Progress' | 'Fulfilled' | 'Rejected';
    processed_by?: string;
    processed_date?: Date;
    hr_notes?: string;
    fulfilled_document_id?: string;
    created_at?: Date;
    updated_at?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IDocumentRequestCreate {
    employee_id: string;
    requested_doc_type: 'Experience Letter' | 'No Objection Certificate' | 'Payslip' | 'Employment Contract' | 'ID Card' | 'Training Certificate' | 'Performance Review' | 'Disciplinary Notice' | 'Promotion Letter' | 'Termination Letter' | 'Other';
    request_details: string;
    request_date?: Date;
    status?: 'Pending' | 'In Progress' | 'Fulfilled' | 'Rejected';
    processed_by?: string;
    processed_date?: Date;
    hr_notes?: string;
    fulfilled_document_id?: string;
}

export interface IDocumentRequestUpdate {
    employee_id?: string;
    requested_doc_type?: 'Experience Letter' | 'No Objection Certificate' | 'Payslip' | 'Employment Contract' | 'ID Card' | 'Training Certificate' | 'Performance Review' | 'Disciplinary Notice' | 'Promotion Letter' | 'Termination Letter' | 'Other';
    request_details?: string;
    request_date?: Date;
    status?: 'Pending' | 'In Progress' | 'Fulfilled' | 'Rejected';
    processed_by?: string;
    processed_date?: Date;
    hr_notes?: string;
    fulfilled_document_id?: string;
}

export interface IDocumentRequestFilters {
    employee_id?: string;
    status?: string;
    doc_type?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    limit?: number;
}

export interface IDocumentRequestStatusUpdate {
    status: 'Pending' | 'In Progress' | 'Fulfilled' | 'Rejected';
    processed_by?: string;
    hr_notes?: string;
}

export interface IDocumentRequestFulfill {
    fulfilled_document_id: string;
    processed_by: string;
    hr_notes?: string;
}

export interface IDocumentRequestStats {
    totalRequests: number;
    statusBreakdown: {
        Pending: number;
        'In Progress': number;
        Fulfilled: number;
        Rejected: number;
    };
    docTypeBreakdown: Array<{
        _id: string;
        count: number;
    }>;
    monthlyBreakdown: Array<{
        _id: number;
        count: number;
    }>;
}

export interface IDocumentRequestResponse {
    success: boolean;
    data: IDocumentRequest | IDocumentRequest[] | IDocumentRequestStats;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
} 