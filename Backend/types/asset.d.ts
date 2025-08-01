export interface IAsset {
    _id?: string;
    name: string;
    serial_number: string;
    assigned_to?: string;
    assigned_at?: Date;
    condition: 'New' | 'Good' | 'Fair' | 'Damaged' | 'Lost' | 'Under Maintenance';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IAssetCreate {
    name: string;
    serial_number: string;
    assigned_to?: string;
    condition?: 'New' | 'Good' | 'Fair' | 'Damaged' | 'Lost' | 'Under Maintenance';
}

export interface IAssetUpdate {
    name?: string;
    serial_number?: string;
    assigned_to?: string;
    condition?: 'New' | 'Good' | 'Fair' | 'Damaged' | 'Lost' | 'Under Maintenance';
}

export interface IAssetAssign {
    assigned_to: string;
}

export interface IAssetFilters {
    condition?: string;
    assigned?: 'true' | 'false';
    page?: number;
    limit?: number;
}

export interface IAssetResponse {
    success: boolean;
    data: IAsset | IAsset[];
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
} 