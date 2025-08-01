export interface IPerformanceReview {
    _id?: string;
    employee_id: string;
    evaluator_id: string;
    period_start: Date;
    period_end: Date;
    self_assessment: string;
    score: number;
    feedback: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IPerformanceReviewCreate {
    employee_id: string;
    evaluator_id: string;
    period_start: Date;
    period_end: Date;
    self_assessment: string;
    score: number;
    feedback: string;
}

export interface IPerformanceReviewUpdate {
    employee_id?: string;
    evaluator_id?: string;
    period_start?: Date;
    period_end?: Date;
    self_assessment?: string;
    score?: number;
    feedback?: string;
}

export interface IPerformanceReviewFilters {
    employee_id?: string;
    evaluator_id?: string;
    min_score?: string;
    max_score?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    limit?: number;
}

export interface IPerformanceReviewStats {
    summary: {
        averageScore: number;
        highestScore: number;
        lowestScore: number;
        totalReviews: number;
    };
    scoreDistribution: Array<{
        _id: string;
        count: number;
    }>;
    monthlyBreakdown: Array<{
        _id: number;
        averageScore: number;
        count: number;
    }>;
}

export interface IPerformanceReviewResponse {
    success: boolean;
    data: IPerformanceReview | IPerformanceReview[] | IPerformanceReviewStats;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
} 