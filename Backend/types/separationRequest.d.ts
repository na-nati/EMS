export interface ISeparationRequest {
    _id?: string;
    employee_id: string;
    reason: string;
    status: 'pending' | 'approved' | 'hr_processed';
    approved_by?: string;
    processed_by?: string;
    created_at?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ISeparationRequestCreate {
    employee_id: string;
    reason: string;
    status?: 'pending' | 'approved' | 'hr_processed';
    approved_by?: string;
    processed_by?: string;
}

export interface ISeparationRequestUpdate {
    employee_id?: string;
    reason?: string;
    status?: 'pending' | 'approved' | 'hr_processed';
    approved_by?: string;
    processed_by?: string;
}

export interface ISeparationRequestFilters {
    status?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    limit?: number;
}

export interface ISeparationRequestApprove {
    approved_by: string;
}

export interface ISeparationRequestProcess {
    processed_by: string;
}

export interface ISeparationRequestResponse {
    success: boolean;
    data: ISeparationRequest | ISeparationRequest[];
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
} 