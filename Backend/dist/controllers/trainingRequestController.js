"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPendingTrainingRequests = exports.getTrainingRequestsByEmployee = exports.updateTrainingProgress = exports.rejectTrainingRequest = exports.approveTrainingRequest = exports.deleteTrainingRequest = exports.updateTrainingRequest = exports.getTrainingRequestById = exports.getAllTrainingRequests = exports.createTrainingRequest = void 0;
const TrainingRequest_1 = require("../models/TrainingRequest");
// Create training request
const createTrainingRequest = async (req, res) => {
    try {
        const requestData = req.body;
        const trainingRequest = new TrainingRequest_1.TrainingRequest(requestData);
        const savedRequest = await trainingRequest.save();
        const populatedRequest = await TrainingRequest_1.TrainingRequest.findById(savedRequest._id)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('training_id', 'course_name description start_date end_date status');
        res.status(201).json({
            success: true,
            data: populatedRequest,
            message: 'Training request created successfully'
        });
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Training request already exists for this employee and training'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error creating training request',
            error: error.message
        });
    }
};
exports.createTrainingRequest = createTrainingRequest;
// Get all training requests with pagination and filtering
const getAllTrainingRequests = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const employeeId = req.query.employee_id;
        const trainingId = req.query.training_id;
        const status = req.query.status;
        const progress = req.query.progress;
        const filter = {};
        if (employeeId)
            filter.employee_id = employeeId;
        if (trainingId)
            filter.training_id = trainingId;
        if (status)
            filter.status = status;
        if (progress)
            filter.progress = progress;
        const skip = (page - 1) * limit;
        const requests = await TrainingRequest_1.TrainingRequest.find(filter)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('training_id', 'course_name description start_date end_date status')
            .skip(skip)
            .limit(limit)
            .sort({ requested_at: -1 });
        const total = await TrainingRequest_1.TrainingRequest.countDocuments(filter);
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
            message: 'Error fetching training requests',
            error: error.message
        });
    }
};
exports.getAllTrainingRequests = getAllTrainingRequests;
// Get training request by ID
const getTrainingRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await TrainingRequest_1.TrainingRequest.findById(id)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('training_id', 'course_name description start_date end_date status');
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Training request not found'
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
            message: 'Error fetching training request',
            error: error.message
        });
    }
};
exports.getTrainingRequestById = getTrainingRequestById;
// Update training request
const updateTrainingRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const request = await TrainingRequest_1.TrainingRequest.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('employee_id', 'first_name last_name employee_id')
            .populate('training_id', 'course_name description start_date end_date status');
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Training request not found'
            });
        }
        res.status(200).json({
            success: true,
            data: request,
            message: 'Training request updated successfully'
        });
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Training request already exists for this employee and training'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error updating training request',
            error: error.message
        });
    }
};
exports.updateTrainingRequest = updateTrainingRequest;
// Delete training request
const deleteTrainingRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await TrainingRequest_1.TrainingRequest.findByIdAndDelete(id);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Training request not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Training request deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting training request',
            error: error.message
        });
    }
};
exports.deleteTrainingRequest = deleteTrainingRequest;
// Approve training request
const approveTrainingRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await TrainingRequest_1.TrainingRequest.findByIdAndUpdate(id, { status: 'Approved' }, { new: true, runValidators: true }).populate('employee_id', 'first_name last_name employee_id')
            .populate('training_id', 'course_name description start_date end_date status');
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Training request not found'
            });
        }
        res.status(200).json({
            success: true,
            data: request,
            message: 'Training request approved successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error approving training request',
            error: error.message
        });
    }
};
exports.approveTrainingRequest = approveTrainingRequest;
// Reject training request
const rejectTrainingRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await TrainingRequest_1.TrainingRequest.findByIdAndUpdate(id, { status: 'Rejected' }, { new: true, runValidators: true }).populate('employee_id', 'first_name last_name employee_id')
            .populate('training_id', 'course_name description start_date end_date status');
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Training request not found'
            });
        }
        res.status(200).json({
            success: true,
            data: request,
            message: 'Training request rejected successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error rejecting training request',
            error: error.message
        });
    }
};
exports.rejectTrainingRequest = rejectTrainingRequest;
// Update training progress
const updateTrainingProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const { progress } = req.body;
        const request = await TrainingRequest_1.TrainingRequest.findByIdAndUpdate(id, { progress }, { new: true, runValidators: true }).populate('employee_id', 'first_name last_name employee_id')
            .populate('training_id', 'course_name description start_date end_date status');
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Training request not found'
            });
        }
        res.status(200).json({
            success: true,
            data: request,
            message: 'Training progress updated successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating training progress',
            error: error.message
        });
    }
};
exports.updateTrainingProgress = updateTrainingProgress;
// Get training requests by employee
const getTrainingRequestsByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const filter = { employee_id: employeeId };
        if (status)
            filter.status = status;
        const skip = (page - 1) * limit;
        const requests = await TrainingRequest_1.TrainingRequest.find(filter)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('training_id', 'course_name description start_date end_date status')
            .skip(skip)
            .limit(limit)
            .sort({ requested_at: -1 });
        const total = await TrainingRequest_1.TrainingRequest.countDocuments(filter);
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
            message: 'Error fetching employee training requests',
            error: error.message
        });
    }
};
exports.getTrainingRequestsByEmployee = getTrainingRequestsByEmployee;
// Get pending training requests
const getPendingTrainingRequests = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const requests = await TrainingRequest_1.TrainingRequest.find({ status: 'Pending' })
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('training_id', 'course_name description start_date end_date status')
            .skip(skip)
            .limit(limit)
            .sort({ requested_at: -1 });
        const total = await TrainingRequest_1.TrainingRequest.countDocuments({ status: 'Pending' });
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
            message: 'Error fetching pending training requests',
            error: error.message
        });
    }
};
exports.getPendingTrainingRequests = getPendingTrainingRequests;
