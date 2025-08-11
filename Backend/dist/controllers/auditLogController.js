"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearOldAuditLogs = exports.getAuditLogStats = exports.getAuditLogsByTargetTable = exports.getAuditLogsByUser = exports.deleteAuditLog = exports.updateAuditLog = exports.getAuditLogById = exports.getAllAuditLogs = exports.createAuditLog = void 0;
const AuditLog_1 = require("../models/AuditLog");
// Create audit log entry
const createAuditLog = async (req, res) => {
    try {
        const auditData = req.body;
        const auditLog = new AuditLog_1.AuditLog(auditData);
        const savedAuditLog = await auditLog.save();
        const populatedAuditLog = await AuditLog_1.AuditLog.findById(savedAuditLog._id)
            .populate('user_id', 'username email first_name last_name');
        res.status(201).json({
            success: true,
            data: populatedAuditLog,
            message: 'Audit log created successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating audit log',
            error: error.message
        });
    }
};
exports.createAuditLog = createAuditLog;
// Get all audit logs with pagination and filtering
const getAllAuditLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const userId = req.query.user_id;
        const action = req.query.action;
        const targetTable = req.query.target_table;
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;
        const filter = {};
        if (userId)
            filter.user_id = userId;
        if (action)
            filter.action = { $regex: action, $options: 'i' };
        if (targetTable)
            filter.target_table = targetTable;
        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate)
                filter.timestamp.$gte = new Date(startDate);
            if (endDate)
                filter.timestamp.$lte = new Date(endDate);
        }
        const skip = (page - 1) * limit;
        const auditLogs = await AuditLog_1.AuditLog.find(filter)
            .populate('user_id', 'username email first_name last_name')
            .skip(skip)
            .limit(limit)
            .sort({ timestamp: -1 });
        const total = await AuditLog_1.AuditLog.countDocuments(filter);
        res.status(200).json({
            success: true,
            data: auditLogs,
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
            message: 'Error fetching audit logs',
            error: error.message
        });
    }
};
exports.getAllAuditLogs = getAllAuditLogs;
// Get audit log by ID
const getAuditLogById = async (req, res) => {
    try {
        const { id } = req.params;
        const auditLog = await AuditLog_1.AuditLog.findById(id)
            .populate('user_id', 'username email first_name last_name');
        if (!auditLog) {
            return res.status(404).json({
                success: false,
                message: 'Audit log not found'
            });
        }
        res.status(200).json({
            success: true,
            data: auditLog
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching audit log',
            error: error.message
        });
    }
};
exports.getAuditLogById = getAuditLogById;
// Update audit log
const updateAuditLog = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const auditLog = await AuditLog_1.AuditLog.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('user_id', 'username email first_name last_name');
        if (!auditLog) {
            return res.status(404).json({
                success: false,
                message: 'Audit log not found'
            });
        }
        res.status(200).json({
            success: true,
            data: auditLog,
            message: 'Audit log updated successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating audit log',
            error: error.message
        });
    }
};
exports.updateAuditLog = updateAuditLog;
// Delete audit log
const deleteAuditLog = async (req, res) => {
    try {
        const { id } = req.params;
        const auditLog = await AuditLog_1.AuditLog.findByIdAndDelete(id);
        if (!auditLog) {
            return res.status(404).json({
                success: false,
                message: 'Audit log not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Audit log deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting audit log',
            error: error.message
        });
    }
};
exports.deleteAuditLog = deleteAuditLog;
// Get audit logs by user
const getAuditLogsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;
        const filter = { user_id: userId };
        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate)
                filter.timestamp.$gte = new Date(startDate);
            if (endDate)
                filter.timestamp.$lte = new Date(endDate);
        }
        const skip = (page - 1) * limit;
        const auditLogs = await AuditLog_1.AuditLog.find(filter)
            .populate('user_id', 'username email first_name last_name')
            .skip(skip)
            .limit(limit)
            .sort({ timestamp: -1 });
        const total = await AuditLog_1.AuditLog.countDocuments(filter);
        res.status(200).json({
            success: true,
            data: auditLogs,
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
            message: 'Error fetching user audit logs',
            error: error.message
        });
    }
};
exports.getAuditLogsByUser = getAuditLogsByUser;
// Get audit logs by target table
const getAuditLogsByTargetTable = async (req, res) => {
    try {
        const { targetTable } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;
        const filter = { target_table: targetTable };
        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate)
                filter.timestamp.$gte = new Date(startDate);
            if (endDate)
                filter.timestamp.$lte = new Date(endDate);
        }
        const skip = (page - 1) * limit;
        const auditLogs = await AuditLog_1.AuditLog.find(filter)
            .populate('user_id', 'username email first_name last_name')
            .skip(skip)
            .limit(limit)
            .sort({ timestamp: -1 });
        const total = await AuditLog_1.AuditLog.countDocuments(filter);
        res.status(200).json({
            success: true,
            data: auditLogs,
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
            message: 'Error fetching audit logs by target table',
            error: error.message
        });
    }
};
exports.getAuditLogsByTargetTable = getAuditLogsByTargetTable;
// Get audit log statistics
const getAuditLogStats = async (req, res) => {
    try {
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;
        const filter = {};
        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate)
                filter.timestamp.$gte = new Date(startDate);
            if (endDate)
                filter.timestamp.$lte = new Date(endDate);
        }
        const userStats = await AuditLog_1.AuditLog.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$user_id',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        const actionStats = await AuditLog_1.AuditLog.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$action',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
        const tableStats = await AuditLog_1.AuditLog.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$target_table',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
        const hourlyStats = await AuditLog_1.AuditLog.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: { $hour: '$timestamp' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        const totalLogs = await AuditLog_1.AuditLog.countDocuments(filter);
        res.status(200).json({
            success: true,
            data: {
                totalLogs,
                topUsers: userStats,
                actionBreakdown: actionStats,
                tableBreakdown: tableStats,
                hourlyBreakdown: hourlyStats
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching audit log statistics',
            error: error.message
        });
    }
};
exports.getAuditLogStats = getAuditLogStats;
// Clear old audit logs
const clearOldAuditLogs = async (req, res) => {
    try {
        const { days } = req.params;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
        const result = await AuditLog_1.AuditLog.deleteMany({
            timestamp: { $lt: cutoffDate }
        });
        res.status(200).json({
            success: true,
            message: `Successfully deleted ${result.deletedCount} audit logs older than ${days} days`
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error clearing old audit logs',
            error: error.message
        });
    }
};
exports.clearOldAuditLogs = clearOldAuditLogs;
//# sourceMappingURL=auditLogController.js.map