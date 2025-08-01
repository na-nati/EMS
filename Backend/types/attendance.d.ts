export interface IAttendance {
    _id?: string;
    employee_id: string;
    date: Date;
    status: 'Present' | 'Absent' | 'Leave' | 'Half-Day';
    checked_by?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IAttendanceCreate {
    employee_id: string;
    date: Date;
    status: 'Present' | 'Absent' | 'Leave' | 'Half-Day';
    checked_by?: string;
}

export interface IAttendanceUpdate {
    employee_id?: string;
    date?: Date;
    status?: 'Present' | 'Absent' | 'Leave' | 'Half-Day';
    checked_by?: string;
}

export interface IAttendanceFilters {
    employee_id?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    limit?: number;
}

export interface IAttendanceStats {
    totalDays: number;
    Present: number;
    Absent: number;
    Leave: number;
    'Half-Day': number;
    attendanceRate: string;
}

export interface IAttendanceBulkCreate {
    records: IAttendanceCreate[];
}

export interface IAttendanceResponse {
    success: boolean;
    data: IAttendance | IAttendance[] | IAttendanceStats;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
} 