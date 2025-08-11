"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecruitmentStats = exports.getActiveRecruitments = exports.getRecruitmentsByRequester = exports.updateRecruitmentStatus = exports.deleteRecruitment = exports.updateRecruitment = exports.getRecruitmentById = exports.getAllRecruitments = exports.createRecruitment = void 0;
const Recruitment_1 = require("../models/Recruitment");
// Create recruitment request
const createRecruitment = async (req, res) => {
    try {
        const recruitmentData = req.body;
        const recruitment = new Recruitment_1.Recruitment(recruitmentData);
        const savedRecruitment = await recruitment.save();
        const populatedRecruitment = await Recruitment_1.Recruitment.findById(savedRecruitment._id)
            .populate('requested_by', 'username email');
        res.status(201).json({
            success: true,
            data: populatedRecruitment,
            message: 'Recruitment request created successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating recruitment request',
            error: error.message
        });
    }
};
exports.createRecruitment = createRecruitment;
// Get all recruitment requests with pagination and filtering
const getAllRecruitments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const requestedBy = req.query.requested_by;
        const jobTitle = req.query.job_title;
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;
        const filter = {};
        if (status)
            filter.status = status;
        if (requestedBy)
            filter.requested_by = requestedBy;
        if (jobTitle)
            filter.job_title = { $regex: jobTitle, $options: 'i' };
        if (startDate || endDate) {
            filter.created_at = {};
            if (startDate)
                filter.created_at.$gte = new Date(startDate);
            if (endDate)
                filter.created_at.$lte = new Date(endDate);
        }
        const skip = (page - 1) * limit;
        const recruitments = await Recruitment_1.Recruitment.find(filter)
            .populate('requested_by', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 });
        const total = await Recruitment_1.Recruitment.countDocuments(filter);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching recruitment requests',
            error: error.message
        });
    }
};
exports.getAllRecruitments = getAllRecruitments;
// Get recruitment by ID
const getRecruitmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const recruitment = await Recruitment_1.Recruitment.findById(id)
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching recruitment request',
            error: error.message
        });
    }
};
exports.getRecruitmentById = getRecruitmentById;
// Update recruitment request
const updateRecruitment = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const recruitment = await Recruitment_1.Recruitment.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('requested_by', 'username email');
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating recruitment request',
            error: error.message
        });
    }
};
exports.updateRecruitment = updateRecruitment;
// Delete recruitment request
const deleteRecruitment = async (req, res) => {
    try {
        const { id } = req.params;
        const recruitment = await Recruitment_1.Recruitment.findByIdAndDelete(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting recruitment request',
            error: error.message
        });
    }
};
exports.deleteRecruitment = deleteRecruitment;
// Update recruitment status
const updateRecruitmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const recruitment = await Recruitment_1.Recruitment.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).populate('requested_by', 'username email');
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating recruitment status',
            error: error.message
        });
    }
};
exports.updateRecruitmentStatus = updateRecruitmentStatus;
// Get recruitment requests by requester
const getRecruitmentsByRequester = async (req, res) => {
    try {
        const { requesterId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const filter = { requested_by: requesterId };
        if (status)
            filter.status = status;
        const skip = (page - 1) * limit;
        const recruitments = await Recruitment_1.Recruitment.find(filter)
            .populate('requested_by', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 });
        const total = await Recruitment_1.Recruitment.countDocuments(filter);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching requester recruitment requests',
            error: error.message
        });
    }
};
exports.getRecruitmentsByRequester = getRecruitmentsByRequester;
// Get active recruitment requests
const getActiveRecruitments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const filter = { status: { $in: ['Posted', 'In Progress'] } };
        const skip = (page - 1) * limit;
        const recruitments = await Recruitment_1.Recruitment.find(filter)
            .populate('requested_by', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 });
        const total = await Recruitment_1.Recruitment.countDocuments(filter);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching active recruitment requests',
            error: error.message
        });
    }
};
exports.getActiveRecruitments = getActiveRecruitments;
// Get recruitment statistics
const getRecruitmentStats = async (req, res) => {
    try {
        const year = req.query.year;
        const filter = {};
        if (year) {
            filter.created_at = {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
            };
        }
        const statusStats = await Recruitment_1.Recruitment.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalOpenings: { $sum: '$openings' }
                }
            }
        ]);
        const monthlyStats = await Recruitment_1.Recruitment.aggregate([
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
        const jobTitleStats = await Recruitment_1.Recruitment.aggregate([
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
        const totalRecruitments = await Recruitment_1.Recruitment.countDocuments(filter);
        const totalOpenings = await Recruitment_1.Recruitment.aggregate([
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
            statsMap[stat._id] = {
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching recruitment statistics',
            error: error.message
        });
    }
};
exports.getRecruitmentStats = getRecruitmentStats;
//# sourceMappingURL=recruitmentController.js.map