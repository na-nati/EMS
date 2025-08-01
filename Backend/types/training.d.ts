export interface ITraining {
    _id?: string;
    course_name: string;
    description: string;
    start_date: Date;
    end_date: Date;
    status: 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ITrainingCreate {
    course_name: string;
    description: string;
    start_date: Date;
    end_date: Date;
    status?: 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';
}

export interface ITrainingUpdate {
    course_name?: string;
    description?: string;
    start_date?: Date;
    end_date?: Date;
    status?: 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';
}

export interface ITrainingFilters {
    status?: string;
    start_date?: string;
    end_date?: string;
    course_name?: string;
    page?: number;
    limit?: number;
}

export interface ITrainingStatusUpdate {
    status: 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';
}

export interface ITrainingStats {
    totalTrainings: number;
    Planned: number;
    'In Progress': number;
    Completed: number;
    Cancelled: number;
    monthlyBreakdown: Array<{
        _id: number;
        count: number;
    }>;
}

export interface ITrainingResponse {
    success: boolean;
    data: ITraining | ITraining[] | ITrainingStats;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
} 