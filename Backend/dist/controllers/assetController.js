"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssetsByEmployee = exports.unassignAsset = exports.assignAsset = exports.deleteAsset = exports.updateAsset = exports.getAssetById = exports.getAllAssets = exports.createAsset = void 0;
const Asset_1 = require("../models/Asset");
// Create a new asset
const createAsset = async (req, res) => {
    try {
        const assetData = req.body;
        const asset = new Asset_1.Asset(assetData);
        const savedAsset = await asset.save();
        res.status(201).json({
            success: true,
            data: savedAsset,
            message: 'Asset created successfully'
        });
    }
    catch (error) {
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
exports.createAsset = createAsset;
// Get all assets with pagination and filtering
const getAllAssets = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const condition = req.query.condition;
        const assigned = req.query.assigned;
        const filter = {};
        if (condition)
            filter.condition = condition;
        if (assigned === 'true')
            filter.assigned_to = { $exists: true, $ne: null };
        if (assigned === 'false')
            filter.assigned_to = { $exists: false };
        const skip = (page - 1) * limit;
        const assets = await Asset_1.Asset.find(filter)
            .populate('assigned_to', 'first_name last_name employee_id')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await Asset_1.Asset.countDocuments(filter);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching assets',
            error: error.message
        });
    }
};
exports.getAllAssets = getAllAssets;
// Get asset by ID
const getAssetById = async (req, res) => {
    try {
        const { id } = req.params;
        const asset = await Asset_1.Asset.findById(id)
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching asset',
            error: error.message
        });
    }
};
exports.getAssetById = getAssetById;
// Update asset
const updateAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const asset = await Asset_1.Asset.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('assigned_to', 'first_name last_name employee_id');
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
    }
    catch (error) {
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
exports.updateAsset = updateAsset;
// Delete asset
const deleteAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const asset = await Asset_1.Asset.findByIdAndDelete(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting asset',
            error: error.message
        });
    }
};
exports.deleteAsset = deleteAsset;
// Assign asset to employee
const assignAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const { assigned_to } = req.body;
        const asset = await Asset_1.Asset.findByIdAndUpdate(id, {
            assigned_to,
            assigned_at: new Date()
        }, { new: true, runValidators: true }).populate('assigned_to', 'first_name last_name employee_id');
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error assigning asset',
            error: error.message
        });
    }
};
exports.assignAsset = assignAsset;
// Unassign asset from employee
const unassignAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const asset = await Asset_1.Asset.findByIdAndUpdate(id, {
            assigned_to: null,
            assigned_at: null
        }, { new: true, runValidators: true }).populate('assigned_to', 'first_name last_name employee_id');
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error unassigning asset',
            error: error.message
        });
    }
};
exports.unassignAsset = unassignAsset;
// Get assets by employee
const getAssetsByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const assets = await Asset_1.Asset.find({ assigned_to: employeeId })
            .populate('assigned_to', 'first_name last_name employee_id')
            .sort({ assigned_at: -1 });
        res.status(200).json({
            success: true,
            data: assets
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching employee assets',
            error: error.message
        });
    }
};
exports.getAssetsByEmployee = getAssetsByEmployee;
//# sourceMappingURL=assetController.js.map