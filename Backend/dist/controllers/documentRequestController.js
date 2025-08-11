"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentRequestStats = exports.getPendingDocumentRequests = exports.getDocumentRequestsByEmployee = exports.fulfillDocumentRequest = exports.updateDocumentRequestStatus = exports.deleteDocumentRequest = exports.updateDocumentRequest = exports.getDocumentRequestById = exports.getAllDocumentRequests = exports.createDocumentRequest = void 0;
const DocumentRequest_1 = require("../models/DocumentRequest");
// Create document request
const createDocumentRequest = async (req, res) => {
    try {
        const requestData = req.body;
        const documentRequest = new DocumentRequest_1.DocumentRequest(requestData);
        const savedRequest = await documentRequest.save();
        const populatedRequest = await DocumentRequest_1.DocumentRequest.findById(savedRequest._id)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('processed_by', 'username email')
            .populate('fulfilled_document_id', 'title file_path');
        res.status(201).json({
            success: true,
            data: populatedRequest,
            message: 'Document request created successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating document request',
            error: error.message
        });
    }
};
exports.createDocumentRequest = createDocumentRequest;
// Get all document requests with pagination and filtering
const getAllDocumentRequests = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const employeeId = req.query.employee_id;
        const status = req.query.status;
        const docType = req.query.doc_type;
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;
        const filter = {};
        if (employeeId)
            filter.employee_id = employeeId;
        if (status)
            filter.status = status;
        if (docType)
            filter.requested_doc_type = docType;
        if (startDate || endDate) {
            filter.request_date = {};
            if (startDate)
                filter.request_date.$gte = new Date(startDate);
            if (endDate)
                filter.request_date.$lte = new Date(endDate);
        }
        const skip = (page - 1) * limit;
        const requests = await DocumentRequest_1.DocumentRequest.find(filter)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('processed_by', 'username email')
            .populate('fulfilled_document_id', 'title file_path')
            .skip(skip)
            .limit(limit)
            .sort({ request_date: -1 });
        const total = await DocumentRequest_1.DocumentRequest.countDocuments(filter);
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
            message: 'Error fetching document requests',
            error: error.message
        });
    }
};
exports.getAllDocumentRequests = getAllDocumentRequests;
// Get document request by ID
const getDocumentRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await DocumentRequest_1.DocumentRequest.findById(id)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('processed_by', 'username email')
            .populate('fulfilled_document_id', 'title file_path');
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Document request not found'
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
            message: 'Error fetching document request',
            error: error.message
        });
    }
};
exports.getDocumentRequestById = getDocumentRequestById;
// Update document request
const updateDocumentRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const request = await DocumentRequest_1.DocumentRequest.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('employee_id', 'first_name last_name employee_id')
            .populate('processed_by', 'username email')
            .populate('fulfilled_document_id', 'title file_path');
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Document request not found'
            });
        }
        res.status(200).json({
            success: true,
            data: request,
            message: 'Document request updated successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating document request',
            error: error.message
        });
    }
};
exports.updateDocumentRequest = updateDocumentRequest;
// Delete document request
const deleteDocumentRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await DocumentRequest_1.DocumentRequest.findByIdAndDelete(id);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Document request not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Document request deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting document request',
            error: error.message
        });
    }
};
exports.deleteDocumentRequest = deleteDocumentRequest;
// Update document request status
const updateDocumentRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, processed_by, hr_notes } = req.body;
        const updateData = { status };
        if (processed_by)
            updateData.processed_by = processed_by;
        if (hr_notes)
            updateData.hr_notes = hr_notes;
        if (status === 'Fulfilled' || status === 'Rejected') {
            updateData.processed_date = new Date();
        }
        const request = await DocumentRequest_1.DocumentRequest.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('employee_id', 'first_name last_name employee_id')
            .populate('processed_by', 'username email')
            .populate('fulfilled_document_id', 'title file_path');
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Document request not found'
            });
        }
        res.status(200).json({
            success: true,
            data: request,
            message: 'Document request status updated successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating document request status',
            error: error.message
        });
    }
};
exports.updateDocumentRequestStatus = updateDocumentRequestStatus;
// Fulfill document request
const fulfillDocumentRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { fulfilled_document_id, processed_by, hr_notes } = req.body;
        const request = await DocumentRequest_1.DocumentRequest.findByIdAndUpdate(id, {
            status: 'Fulfilled',
            fulfilled_document_id,
            processed_by,
            processed_date: new Date(),
            hr_notes
        }, { new: true, runValidators: true }).populate('employee_id', 'first_name last_name employee_id')
            .populate('processed_by', 'username email')
            .populate('fulfilled_document_id', 'title file_path');
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Document request not found'
            });
        }
        res.status(200).json({
            success: true,
            data: request,
            message: 'Document request fulfilled successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fulfilling document request',
            error: error.message
        });
    }
};
exports.fulfillDocumentRequest = fulfillDocumentRequest;
// Get document requests by employee
const getDocumentRequestsByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const filter = { employee_id: employeeId };
        if (status)
            filter.status = status;
        const skip = (page - 1) * limit;
        const requests = await DocumentRequest_1.DocumentRequest.find(filter)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('processed_by', 'username email')
            .populate('fulfilled_document_id', 'title file_path')
            .skip(skip)
            .limit(limit)
            .sort({ request_date: -1 });
        const total = await DocumentRequest_1.DocumentRequest.countDocuments(filter);
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
            message: 'Error fetching employee document requests',
            error: error.message
        });
    }
};
exports.getDocumentRequestsByEmployee = getDocumentRequestsByEmployee;
// Get pending document requests
const getPendingDocumentRequests = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const requests = await DocumentRequest_1.DocumentRequest.find({ status: 'Pending' })
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('processed_by', 'username email')
            .populate('fulfilled_document_id', 'title file_path')
            .skip(skip)
            .limit(limit)
            .sort({ request_date: -1 });
        const total = await DocumentRequest_1.DocumentRequest.countDocuments({ status: 'Pending' });
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
            message: 'Error fetching pending document requests',
            error: error.message
        });
    }
};
exports.getPendingDocumentRequests = getPendingDocumentRequests;
// Get document request statistics
const getDocumentRequestStats = async (req, res) => {
    try {
        const year = req.query.year;
        const filter = {};
        if (year) {
            filter.request_date = {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
            };
        }
        const statusStats = await DocumentRequest_1.DocumentRequest.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        const docTypeStats = await DocumentRequest_1.DocumentRequest.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$requested_doc_type',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
        const monthlyStats = await DocumentRequest_1.DocumentRequest.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: { $month: '$request_date' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        const totalRequests = await DocumentRequest_1.DocumentRequest.countDocuments(filter);
        const statsMap = {
            Pending: 0,
            'In Progress': 0,
            Fulfilled: 0,
            Rejected: 0
        };
        statusStats.forEach(stat => {
            statsMap[stat._id] = stat.count;
        });
        res.status(200).json({
            success: true,
            data: {
                totalRequests,
                statusBreakdown: statsMap,
                docTypeBreakdown: docTypeStats,
                monthlyBreakdown: monthlyStats
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching document request statistics',
            error: error.message
        });
    }
};
exports.getDocumentRequestStats = getDocumentRequestStats;
//# sourceMappingURL=documentRequestController.js.map