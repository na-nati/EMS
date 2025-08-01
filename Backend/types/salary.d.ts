export interface ISalary {
    _id?: string;
    user: string;
    basicSalary: number;
    bonus: number;
    deductions: number;
    netSalary: number;
    month: string;
    year: number;
    status: 'paid' | 'pending' | 'processing';
    department: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ISalaryCreate {
    user: string;
    basicSalary: number;
    bonus?: number;
    deductions?: number;
    netSalary?: number;
    month: string;
    year: number;
    status?: 'paid' | 'pending' | 'processing';
    department: string;
}

export interface ISalaryUpdate {
    user?: string;
    basicSalary?: number;
    bonus?: number;
    deductions?: number;
    netSalary?: number;
    month?: string;
    year?: number;
    status?: 'paid' | 'pending' | 'processing';
    department?: string;
}

export interface ISalaryFilters {
    user_id?: string;
    status?: string;
    month?: string;
    year?: string;
    department?: string;
    page?: number;
    limit?: number;
}

export interface ISalaryStatusUpdate {
    status: 'paid' | 'pending' | 'processing';
}

export interface ISalaryStats {
    summary: {
        totalSalary: number;
        totalBasicSalary: number;
        totalBonus: number;
        totalDeductions: number;
        count: number;
    };
    statusBreakdown: Array<{
        _id: string;
        count: number;
    }>;
    departmentBreakdown: Array<{
        _id: string;
        totalSalary: number;
        count: number;
    }>;
}

export interface ISalaryBulkCreate {
    records: ISalaryCreate[];
}

export interface ISalaryResponse {
    success: boolean;
    data: ISalary | ISalary[] | ISalaryStats;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
} 