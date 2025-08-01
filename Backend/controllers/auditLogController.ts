import { Request, Response } from 'express';
import { AuditLog, IAuditLog } from '../models/AuditLog';

// Create audit log entry
export const createAuditLog = async (req: Request, res: Response) => {
    try {
        const auditData = req.body;
        const auditLog = new AuditLog(auditData);
        const savedAuditLog = await auditLog.save();

        const populatedAuditLog = await AuditLog.findById(savedAuditLog._id)
            .populate('user_id', 'username email first_name last_name');

        res.status(201).json({
            success: true,
            data: populatedAuditLog,
            message: 'Audit log created successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error creating audit log',
            error: error.message
        });
    }
};

// Get all audit logs with pagination and filtering
export const getAllAuditLogs = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const userId = req.query.user_id as string;
        const action = req.query.action as string;
        const targetTable = req.query.target_table as string;
        const startDate = req.query.start_date as string;
        const endDate = req.query.end_date as string;

        const filter: any = {};
        if (userId) filter.user_id = userId;
        if (action) filter.action = { $regex: action, $options: 'i' };
        if (targetTable) filter.target_table = targetTable;
        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate) filter.timestamp.$gte = new Date(startDate);
            if (endDate) filter.timestamp.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const auditLogs = await AuditLog.find(filter)
            .populate('user_id', 'username email first_name last_name')
            .skip(skip)
            .limit(limit)
            .sort({ timestamp: -1 });

        const total = await AuditLog.countDocuments(filter);

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching audit logs',
            error: error.message
        });
    }
};

// Get audit log by ID
export const getAuditLogById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const auditLog = await AuditLog.findById(id)
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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching audit log',
            error: error.message
        });
    }
};

// Update audit log
export const updateAuditLog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const auditLog = await AuditLog.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('user_id', 'username email first_name last_name');

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error updating audit log',
            error: error.message
        });
    }
};

// Delete audit log
export const deleteAuditLog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const auditLog = await AuditLog.findByIdAndDelete(id);

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error deleting audit log',
            error: error.message
        });
    }
};

// Get audit logs by user
export const getAuditLogsByUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const startDate = req.query.start_date as string;
        const endDate = req.query.end_date as string;

        const filter: any = { user_id: userId };
        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate) filter.timestamp.$gte = new Date(startDate);
            if (endDate) filter.timestamp.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const auditLogs = await AuditLog.find(filter)
            .populate('user_id', 'username email first_name last_name')
            .skip(skip)
            .limit(limit)
            .sort({ timestamp: -1 });

        const total = await AuditLog.countDocuments(filter);

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user audit logs',
            error: error.message
        });
    }
};

// Get audit logs by target table
export const getAuditLogsByTargetTable = async (req: Request, res: Response) => {
    try {
        const { targetTable } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const startDate = req.query.start_date as string;
        const endDate = req.query.end_date as string;

        const filter: any = { target_table: targetTable };
        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate) filter.timestamp.$gte = new Date(startDate);
            if (endDate) filter.timestamp.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const auditLogs = await AuditLog.find(filter)
            .populate('user_id', 'username email first_name last_name')
            .skip(skip)
            .limit(limit)
            .sort({ timestamp: -1 });

        const total = await AuditLog.countDocuments(filter);

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching audit logs by target table',
            error: error.message
        });
    }
};

// Get audit log statistics
export const getAuditLogStats = async (req: Request, res: Response) => {
    try {
        const startDate = req.query.start_date as string;
        const endDate = req.query.end_date as string;

        const filter: any = {};
        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate) filter.timestamp.$gte = new Date(startDate);
            if (endDate) filter.timestamp.$lte = new Date(endDate);
        }

        const userStats = await AuditLog.aggregate([
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

        const actionStats = await AuditLog.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$action',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        const tableStats = await AuditLog.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$target_table',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        const hourlyStats = await AuditLog.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: { $hour: '$timestamp' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const totalLogs = await AuditLog.countDocuments(filter);

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching audit log statistics',
            error: error.message
        });
    }
};

// Clear old audit logs
export const clearOldAuditLogs = async (req: Request, res: Response) => {
    try {
        const { days } = req.params;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

        const result = await AuditLog.deleteMany({
            timestamp: { $lt: cutoffDate }
        });

        res.status(200).json({
            success: true,
            message: `Successfully deleted ${result.deletedCount} audit logs older than ${days} days`
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error clearing old audit logs',
            error: error.message
        });
    }
}; 