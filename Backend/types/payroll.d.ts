export interface IPayroll {
    _id?: string;
    employeeName: string;
    employeeId: string;
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

export interface IPayrollCreate {
    employeeName: string;
    employeeId: string;
    basicSalary: number;
    bonus?: number;
    deductions?: number;
    netSalary: number;
    month: string;
    year: number;
    status?: 'paid' | 'pending' | 'processing';
    department: string;
}

export interface IPayrollUpdate {
    employeeName?: string;
    employeeId?: string;
    basicSalary?: number;
    bonus?: number;
    deductions?: number;
    netSalary?: number;
    month?: string;
    year?: number;
    status?: 'paid' | 'pending' | 'processing';
    department?: string;
}

export interface IPayrollFilters {
    employeeId?: string;
    status?: string;
    month?: string;
    year?: string;
    department?: string;
    page?: number;
    limit?: number;
}

export interface IPayrollStatusUpdate {
    status: 'paid' | 'pending' | 'processing';
}

export interface IPayrollStats {
    summary: {
        totalPayroll: number;
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
        totalPayroll: number;
        count: number;
    }>;
}

export interface IPayrollBulkCreate {
    records: IPayrollCreate[];
}

export interface IPayrollResponse {
    success: boolean;
    data: IPayroll | IPayroll[] | IPayrollStats;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
} 