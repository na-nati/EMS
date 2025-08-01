export interface ILeaveRequest {
    _id?: string;
    employee_id: string;
    start_date: Date;
    end_date: Date;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    approved_by?: string;
    created_at?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ILeaveRequestCreate {
    employee_id: string;
    start_date: Date;
    end_date: Date;
    reason: string;
    status?: 'pending' | 'approved' | 'rejected';
    approved_by?: string;
}

export interface ILeaveRequestUpdate {
    employee_id?: string;
    start_date?: Date;
    end_date?: Date;
    reason?: string;
    status?: 'pending' | 'approved' | 'rejected';
    approved_by?: string;
}

export interface ILeaveRequestFilters {
    employee_id?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    limit?: number;
}

export interface ILeaveRequestApprove {
    approved_by: string;
}

export interface ILeaveRequestResponse {
    success: boolean;
    data: ILeaveRequest | ILeaveRequest[];
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
} 