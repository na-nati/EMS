import { Request, Response } from 'express';
import { Asset, IAsset } from '../models/Asset';

// Create a new asset
export const createAsset = async (req: Request, res: Response) => {
    try {
        const assetData = req.body;
        const asset = new Asset(assetData);
        const savedAsset = await asset.save();

        res.status(201).json({
            success: true,
            data: savedAsset,
            message: 'Asset created successfully'
        });
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Serial number already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error creating asset',
            error: error.message
        });
    }
};

// Get all assets with pagination and filtering
export const getAllAssets = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const condition = req.query.condition as string;
        const assigned = req.query.assigned as string;

        const filter: any = {};
        if (condition) filter.condition = condition;
        if (assigned === 'true') filter.assigned_to = { $exists: true, $ne: null };
        if (assigned === 'false') filter.assigned_to = { $exists: false };

        const skip = (page - 1) * limit;

        const assets = await Asset.find(filter)
            .populate('assigned_to', 'first_name last_name employee_id')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Asset.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: assets,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching assets',
            error: error.message
        });
    }
};

// Get asset by ID
export const getAssetById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const asset = await Asset.findById(id)
            .populate('assigned_to', 'first_name last_name employee_id');

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: 'Asset not found'
            });
        }

        res.status(200).json({
            success: true,
            data: asset
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching asset',
            error: error.message
        });
    }
};

// Update asset
export const updateAsset = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const asset = await Asset.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('assigned_to', 'first_name last_name employee_id');

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: 'Asset not found'
            });
        }

        res.status(200).json({
            success: true,
            data: asset,
            message: 'Asset updated successfully'
        });
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Serial number already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error updating asset',
            error: error.message
        });
    }
};

// Delete asset
export const deleteAsset = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const asset = await Asset.findByIdAndDelete(id);

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: 'Asset not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Asset deleted successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error deleting asset',
            error: error.message
        });
    }
};

// Assign asset to employee
export const assignAsset = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { assigned_to } = req.body;

        const asset = await Asset.findByIdAndUpdate(
            id,
            {
                assigned_to,
                assigned_at: new Date()
            },
            { new: true, runValidators: true }
        ).populate('assigned_to', 'first_name last_name employee_id');

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: 'Asset not found'
            });
        }

        res.status(200).json({
            success: true,
            data: asset,
            message: 'Asset assigned successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error assigning asset',
            error: error.message
        });
    }
};

// Unassign asset from employee
export const unassignAsset = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const asset = await Asset.findByIdAndUpdate(
            id,
            {
                assigned_to: null,
                assigned_at: null
            },
            { new: true, runValidators: true }
        ).populate('assigned_to', 'first_name last_name employee_id');

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: 'Asset not found'
            });
        }

        res.status(200).json({
            success: true,
            data: asset,
            message: 'Asset unassigned successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error unassigning asset',
            error: error.message
        });
    }
};

// Get assets by employee
export const getAssetsByEmployee = async (req: Request, res: Response) => {
    try {
        const { employeeId } = req.params;

        const assets = await Asset.find({ assigned_to: employeeId })
            .populate('assigned_to', 'first_name last_name employee_id')
            .sort({ assigned_at: -1 });

        res.status(200).json({
            success: true,
            data: assets
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching employee assets',
            error: error.message
        });
    }
}; 