"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPendingSeparationRequests = exports.getSeparationRequestsByEmployee = exports.processSeparationRequest = exports.approveSeparationRequest = exports.deleteSeparationRequest = exports.updateSeparationRequest = exports.getSeparationRequestById = exports.getAllSeparationRequests = exports.createSeparationRequest = void 0;
const SeparationRequest_1 = require("../models/SeparationRequest");
// Create separation request
const createSeparationRequest = async (req, res) => {
    try {
        const separationData = req.body;
        const separationRequest = new SeparationRequest_1.SeparationRequest(separationData);
        const savedRequest = await separationRequest.save();
        const populatedRequest = await SeparationRequest_1.SeparationRequest.findById(savedRequest._id)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email')
            .populate('processed_by', 'username email');
        res.status(201).json({
            success: true,
            data: populatedRequest,
            message: 'Separation request created successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating separation request',
            error: error.message
        });
    }
};
exports.createSeparationRequest = createSeparationRequest;
// Get all separation requests with pagination and filtering
const getAllSeparationRequests = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;
        const filter = {};
        if (status)
            filter.status = status;
        if (startDate || endDate) {
            filter.created_at = {};
            if (startDate)
                filter.created_at.$gte = new Date(startDate);
            if (endDate)
                filter.created_at.$lte = new Date(endDate);
        }
        const skip = (page - 1) * limit;
        const requests = await SeparationRequest_1.SeparationRequest.find(filter)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email')
            .populate('processed_by', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 });
        const total = await SeparationRequest_1.SeparationRequest.countDocuments(filter);
        res.status(200).json({
            success: true,
            data: requests,
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
            message: 'Error fetching separation requests',
            error: error.message
        });
    }
};
exports.getAllSeparationRequests = getAllSeparationRequests;
// Get separation request by ID
const getSeparationRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await SeparationRequest_1.SeparationRequest.findById(id)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email')
            .populate('processed_by', 'username email');
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Separation request not found'
            });
        }
        res.status(200).json({
            success: true,
            data: request
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching separation request',
            error: error.message
        });
    }
};
exports.getSeparationRequestById = getSeparationRequestById;
// Update separation request
const updateSeparationRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const request = await SeparationRequest_1.SeparationRequest.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email')
            .populate('processed_by', 'username email');
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Separation request not found'
            });
        }
        res.status(200).json({
            success: true,
            data: request,
            message: 'Separation request updated successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating separation request',
            error: error.message
        });
    }
};
exports.updateSeparationRequest = updateSeparationRequest;
// Delete separation request
const deleteSeparationRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await SeparationRequest_1.SeparationRequest.findByIdAndDelete(id);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Separation request not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Separation request deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting separation request',
            error: error.message
        });
    }
};
exports.deleteSeparationRequest = deleteSeparationRequest;
// Approve separation request
const approveSeparationRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { approved_by } = req.body;
        const request = await SeparationRequest_1.SeparationRequest.findByIdAndUpdate(id, {
            status: 'approved',
            approved_by
        }, { new: true, runValidators: true }).populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email')
            .populate('processed_by', 'username email');
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Separation request not found'
            });
        }
        res.status(200).json({
            success: true,
            data: request,
            message: 'Separation request approved successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error approving separation request',
            error: error.message
        });
    }
};
exports.approveSeparationRequest = approveSeparationRequest;
// Process separation request by HR
const processSeparationRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { processed_by } = req.body;
        const request = await SeparationRequest_1.SeparationRequest.findByIdAndUpdate(id, {
            status: 'hr_processed',
            processed_by
        }, { new: true, runValidators: true }).populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email')
            .populate('processed_by', 'username email');
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Separation request not found'
            });
        }
        res.status(200).json({
            success: true,
            data: request,
            message: 'Separation request processed by HR successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing separation request',
            error: error.message
        });
    }
};
exports.processSeparationRequest = processSeparationRequest;
// Get separation requests by employee
const getSeparationRequestsByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const requests = await SeparationRequest_1.SeparationRequest.find({ employee_id: employeeId })
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email')
            .populate('processed_by', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 });
        const total = await SeparationRequest_1.SeparationRequest.countDocuments({ employee_id: employeeId });
        res.status(200).json({
            success: true,
            data: requests,
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
            message: 'Error fetching employee separation requests',
            error: error.message
        });
    }
};
exports.getSeparationRequestsByEmployee = getSeparationRequestsByEmployee;
// Get pending separation requests
const getPendingSeparationRequests = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const requests = await SeparationRequest_1.SeparationRequest.find({ status: 'pending' })
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email')
            .populate('processed_by', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 });
        const total = await SeparationRequest_1.SeparationRequest.countDocuments({ status: 'pending' });
        res.status(200).json({
            success: true,
            data: requests,
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
            message: 'Error fetching pending separation requests',
            error: error.message
        });
    }
};
exports.getPendingSeparationRequests = getPendingSeparationRequests;
//# sourceMappingURL=separationRequestController.js.map