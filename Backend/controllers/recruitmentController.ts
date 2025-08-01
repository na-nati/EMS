import { Request, Response } from 'express';
import { Recruitment, IRecruitment } from '../models/Recruitment';

// Create recruitment request
export const createRecruitment = async (req: Request, res: Response) => {
    try {
        const recruitmentData = req.body;
        const recruitment = new Recruitment(recruitmentData);
        const savedRecruitment = await recruitment.save();

        const populatedRecruitment = await Recruitment.findById(savedRecruitment._id)
            .populate('requested_by', 'username email');

        res.status(201).json({
            success: true,
            data: populatedRecruitment,
            message: 'Recruitment request created successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error creating recruitment request',
            error: error.message
        });
    }
};

// Get all recruitment requests with pagination and filtering
export const getAllRecruitments = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string;
        const requestedBy = req.query.requested_by as string;
        const jobTitle = req.query.job_title as string;
        const startDate = req.query.start_date as string;
        const endDate = req.query.end_date as string;

        const filter: any = {};
        if (status) filter.status = status;
        if (requestedBy) filter.requested_by = requestedBy;
        if (jobTitle) filter.job_title = { $regex: jobTitle, $options: 'i' };
        if (startDate || endDate) {
            filter.created_at = {};
            if (startDate) filter.created_at.$gte = new Date(startDate);
            if (endDate) filter.created_at.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const recruitments = await Recruitment.find(filter)
            .populate('requested_by', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 });

        const total = await Recruitment.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: recruitments,
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
            message: 'Error fetching recruitment requests',
            error: error.message
        });
    }
};

// Get recruitment by ID
export const getRecruitmentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const recruitment = await Recruitment.findById(id)
            .populate('requested_by', 'username email');

        if (!recruitment) {
            return res.status(404).json({
                success: false,
                message: 'Recruitment request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: recruitment
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching recruitment request',
            error: error.message
        });
    }
};

// Update recruitment request
export const updateRecruitment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const recruitment = await Recruitment.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('requested_by', 'username email');

        if (!recruitment) {
            return res.status(404).json({
                success: false,
                message: 'Recruitment request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: recruitment,
            message: 'Recruitment request updated successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error updating recruitment request',
            error: error.message
        });
    }
};

// Delete recruitment request
export const deleteRecruitment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const recruitment = await Recruitment.findByIdAndDelete(id);

        if (!recruitment) {
            return res.status(404).json({
                success: false,
                message: 'Recruitment request not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Recruitment request deleted successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error deleting recruitment request',
            error: error.message
        });
    }
};

// Update recruitment status
export const updateRecruitmentStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const recruitment = await Recruitment.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).populate('requested_by', 'username email');

        if (!recruitment) {
            return res.status(404).json({
                success: false,
                message: 'Recruitment request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: recruitment,
            message: 'Recruitment status updated successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error updating recruitment status',
            error: error.message
        });
    }
};

// Get recruitment requests by requester
export const getRecruitmentsByRequester = async (req: Request, res: Response) => {
    try {
        const { requesterId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string;

        const filter: any = { requested_by: requesterId };
        if (status) filter.status = status;

        const skip = (page - 1) * limit;

        const recruitments = await Recruitment.find(filter)
            .populate('requested_by', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 });

        const total = await Recruitment.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: recruitments,
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
            message: 'Error fetching requester recruitment requests',
            error: error.message
        });
    }
};

// Get active recruitment requests
export const getActiveRecruitments = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const filter = { status: { $in: ['Posted', 'In Progress'] } };

        const skip = (page - 1) * limit;

        const recruitments = await Recruitment.find(filter)
            .populate('requested_by', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 });

        const total = await Recruitment.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: recruitments,
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
            message: 'Error fetching active recruitment requests',
            error: error.message
        });
    }
};

// Get recruitment statistics
export const getRecruitmentStats = async (req: Request, res: Response) => {
    try {
        const year = req.query.year as string;
        const filter: any = {};
        if (year) {
            filter.created_at = {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
            };
        }

        const statusStats = await Recruitment.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalOpenings: { $sum: '$openings' }
                }
            }
        ]);

        const monthlyStats = await Recruitment.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: { $month: '$created_at' },
                    count: { $sum: 1 },
                    totalOpenings: { $sum: '$openings' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const jobTitleStats = await Recruitment.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$job_title',
                    count: { $sum: 1 },
                    totalOpenings: { $sum: '$openings' }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        const totalRecruitments = await Recruitment.countDocuments(filter);
        const totalOpenings = await Recruitment.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$openings' }
                }
            }
        ]);

        const statsMap = {
            Draft: { count: 0, totalOpenings: 0 },
            Posted: { count: 0, totalOpenings: 0 },
            'In Progress': { count: 0, totalOpenings: 0 },
            Closed: { count: 0, totalOpenings: 0 },
            Cancelled: { count: 0, totalOpenings: 0 }
        };

        statusStats.forEach(stat => {
            statsMap[stat._id as keyof typeof statsMap] = {
                count: stat.count,
                totalOpenings: stat.totalOpenings
            };
        });

        res.status(200).json({
            success: true,
            data: {
                totalRecruitments,
                totalOpenings: totalOpenings[0]?.total || 0,
                statusBreakdown: statsMap,
                monthlyBreakdown: monthlyStats,
                topJobTitles: jobTitleStats
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching recruitment statistics',
            error: error.message
        });
    }
}; 