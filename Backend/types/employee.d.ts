import { ObjectId } from 'mongoose';

export interface IEmployee {
    _id?: string;
    user_id: string;
    employee_code: string;
    job_profile: string;
    salary_id?: string;
    manager_id?: string;
    joining_date: Date;
    employment_status: 'active' | 'inactive' | 'terminated' | 'on_leave';
    department_id?: string;
    position?: string;
    salary?: number;
    contact_number?: string;
    emergency_contact?: {
        name: string;
        relationship: string;
        phone: string;
    };
    address?: {
        street: string;
        city: string;
        state: string;
        zip_code: string;
        country: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IEmployeeCreate {
    user_id: string;
    employee_code: string;
    job_profile: string;
    salary_id?: string;
    manager_id?: string;
    joining_date: Date;
    employment_status?: 'active' | 'inactive' | 'terminated' | 'on_leave';
    department_id?: string;
    position?: string;
    salary?: number;
    contact_number?: string;
    emergency_contact?: {
        name: string;
        relationship: string;
        phone: string;
    };
    address?: {
        street: string;
        city: string;
        state: string;
        zip_code: string;
        country: string;
    };
}

export interface IEmployeeUpdate {
    user_id?: string;
    employee_code?: string;
    job_profile?: string;
    salary_id?: string;
    manager_id?: string;
    joining_date?: Date;
    employment_status?: 'active' | 'inactive' | 'terminated' | 'on_leave';
    department_id?: string;
    position?: string;
    salary?: number;
    contact_number?: string;
    emergency_contact?: {
        name: string;
        relationship: string;
        phone: string;
    };
    address?: {
        street: string;
        city: string;
        state: string;
        zip_code: string;
        country: string;
    };
}

export interface IEmployeeFilters {
    department_id?: string;
    employment_status?: string;
    position?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface IEmployeeStats {
    totalEmployees: number;
    statusBreakdown: {
        active: number;
        inactive: number;
        terminated: number;
        on_leave: number;
    };
    positionBreakdown: Array<{
        _id: string;
        count: number;
    }>;
    departmentBreakdown: Array<{
        _id: string;
        count: number;
    }>;
}

export interface IEmployeeResponse {
    success: boolean;
    data: IEmployee | IEmployee[] | IEmployeeStats;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
} 