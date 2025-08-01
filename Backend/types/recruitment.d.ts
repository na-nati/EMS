export interface IRecruitment {
    _id?: string;
    requested_by: string;
    job_title: string;
    requirements: string;
    openings: number;
    status: 'Draft' | 'Posted' | 'In Progress' | 'Closed' | 'Cancelled';
    created_at?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IRecruitmentCreate {
    requested_by: string;
    job_title: string;
    requirements: string;
    openings: number;
    status?: 'Draft' | 'Posted' | 'In Progress' | 'Closed' | 'Cancelled';
}

export interface IRecruitmentUpdate {
    requested_by?: string;
    job_title?: string;
    requirements?: string;
    openings?: number;
    status?: 'Draft' | 'Posted' | 'In Progress' | 'Closed' | 'Cancelled';
}

export interface IRecruitmentFilters {
    status?: string;
    requested_by?: string;
    job_title?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    limit?: number;
}

export interface IRecruitmentStatusUpdate {
    status: 'Draft' | 'Posted' | 'In Progress' | 'Closed' | 'Cancelled';
}

export interface IRecruitmentStats {
    totalRecruitments: number;
    totalOpenings: number;
    statusBreakdown: {
        Draft: { count: number; totalOpenings: number };
        Posted: { count: number; totalOpenings: number };
        'In Progress': { count: number; totalOpenings: number };
        Closed: { count: number; totalOpenings: number };
        Cancelled: { count: number; totalOpenings: number };
    };
    monthlyBreakdown: Array<{
        _id: number;
        count: number;
        totalOpenings: number;
    }>;
    topJobTitles: Array<{
        _id: string;
        count: number;
        totalOpenings: number;
    }>;
}

export interface IRecruitmentResponse {
    success: boolean;
    data: IRecruitment | IRecruitment[] | IRecruitmentStats;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
} 