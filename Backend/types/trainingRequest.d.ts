export interface ITrainingRequest {
    _id?: string;
    employee_id: string;
    training_id: string;
    progress: 'Not Started' | 'Ongoing' | 'Completed';
    status: 'Pending' | 'Approved' | 'Rejected';
    requested_at?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ITrainingRequestCreate {
    employee_id: string;
    training_id: string;
    progress?: 'Not Started' | 'Ongoing' | 'Completed';
    status?: 'Pending' | 'Approved' | 'Rejected';
}

export interface ITrainingRequestUpdate {
    employee_id?: string;
    training_id?: string;
    progress?: 'Not Started' | 'Ongoing' | 'Completed';
    status?: 'Pending' | 'Approved' | 'Rejected';
}

export interface ITrainingRequestFilters {
    employee_id?: string;
    training_id?: string;
    status?: string;
    progress?: string;
    page?: number;
    limit?: number;
}

export interface ITrainingRequestProgressUpdate {
    progress: 'Not Started' | 'Ongoing' | 'Completed';
}

export interface ITrainingRequestResponse {
    success: boolean;
    data: ITrainingRequest | ITrainingRequest[];
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
} 