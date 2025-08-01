"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPendingLeaveRequests = exports.getLeaveRequestsByEmployee = exports.rejectLeaveRequest = exports.approveLeaveRequest = exports.deleteLeaveRequest = exports.updateLeaveRequest = exports.getLeaveRequestById = exports.getAllLeaveRequests = exports.createLeaveRequest = void 0;
const LeaveRequest_1 = require("../models/LeaveRequest");
// Create leave request
const createLeaveRequest = async (req, res) => {
    try {
        const leaveData = req.body;
        const leaveRequest = new LeaveRequest_1.LeaveRequest(leaveData);
        const savedLeaveRequest = await leaveRequest.save();
        const populatedLeaveRequest = await LeaveRequest_1.LeaveRequest.findById(savedLeaveRequest._id)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email');
        res.status(201).json({
            success: true,
            data: populatedLeaveRequest,
            message: 'Leave request created successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating leave request',
            error: error.message
        });
    }
};
exports.createLeaveRequest = createLeaveRequest;
// Get all leave requests with pagination and filtering
const getAllLeaveRequests = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const employeeId = req.query.employee_id;
        const status = req.query.status;
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;
        const filter = {};
        if (employeeId)
            filter.employee_id = employeeId;
        if (status)
            filter.status = status;
        if (startDate || endDate) {
            filter.start_date = {};
            if (startDate)
                filter.start_date.$gte = new Date(startDate);
            if (endDate)
                filter.start_date.$lte = new Date(endDate);
        }
        const skip = (page - 1) * limit;
        const leaveRequests = await LeaveRequest_1.LeaveRequest.find(filter)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 });
        const total = await LeaveRequest_1.LeaveRequest.countDocuments(filter);
        res.status(200).json({
            success: true,
            data: leaveRequests,
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
            message: 'Error fetching leave requests',
            error: error.message
        });
    }
};
exports.getAllLeaveRequests = getAllLeaveRequests;
// Get leave request by ID
const getLeaveRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const leaveRequest = await LeaveRequest_1.LeaveRequest.findById(id)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email');
        if (!leaveRequest) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }
        res.status(200).json({
            success: true,
            data: leaveRequest
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching leave request',
            error: error.message
        });
    }
};
exports.getLeaveRequestById = getLeaveRequestById;
// Update leave request
const updateLeaveRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const leaveRequest = await LeaveRequest_1.LeaveRequest.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email');
        if (!leaveRequest) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }
        res.status(200).json({
            success: true,
            data: leaveRequest,
            message: 'Leave request updated successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating leave request',
            error: error.message
        });
    }
};
exports.updateLeaveRequest = updateLeaveRequest;
// Delete leave request
const deleteLeaveRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const leaveRequest = await LeaveRequest_1.LeaveRequest.findByIdAndDelete(id);
        if (!leaveRequest) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Leave request deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting leave request',
            error: error.message
        });
    }
};
exports.deleteLeaveRequest = deleteLeaveRequest;
// Approve leave request
const approveLeaveRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { approved_by } = req.body;
        const leaveRequest = await LeaveRequest_1.LeaveRequest.findByIdAndUpdate(id, {
            status: 'approved',
            approved_by
        }, { new: true, runValidators: true }).populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email');
        if (!leaveRequest) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }
        res.status(200).json({
            success: true,
            data: leaveRequest,
            message: 'Leave request approved successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error approving leave request',
            error: error.message
        });
    }
};
exports.approveLeaveRequest = approveLeaveRequest;
// Reject leave request
const rejectLeaveRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { approved_by } = req.body;
        const leaveRequest = await LeaveRequest_1.LeaveRequest.findByIdAndUpdate(id, {
            status: 'rejected',
            approved_by
        }, { new: true, runValidators: true }).populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email');
        if (!leaveRequest) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }
        res.status(200).json({
            success: true,
            data: leaveRequest,
            message: 'Leave request rejected successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error rejecting leave request',
            error: error.message
        });
    }
};
exports.rejectLeaveRequest = rejectLeaveRequest;
// Get leave requests by employee
const getLeaveRequestsByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const filter = { employee_id: employeeId };
        if (status)
            filter.status = status;
        const skip = (page - 1) * limit;
        const leaveRequests = await LeaveRequest_1.LeaveRequest.find(filter)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 });
        const total = await LeaveRequest_1.LeaveRequest.countDocuments(filter);
        res.status(200).json({
            success: true,
            data: leaveRequests,
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
            message: 'Error fetching employee leave requests',
            error: error.message
        });
    }
};
exports.getLeaveRequestsByEmployee = getLeaveRequestsByEmployee;
// Get pending leave requests
const getPendingLeaveRequests = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const leaveRequests = await LeaveRequest_1.LeaveRequest.find({ status: 'pending' })
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 });
        const total = await LeaveRequest_1.LeaveRequest.countDocuments({ status: 'pending' });
        res.status(200).json({
            success: true,
            data: leaveRequests,
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
            message: 'Error fetching pending leave requests',
            error: error.message
        });
    }
};
exports.getPendingLeaveRequests = getPendingLeaveRequests;
