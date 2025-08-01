"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPerformanceStats = exports.getPerformanceReviewsByEvaluator = exports.getPerformanceReviewsByEmployee = exports.deletePerformanceReview = exports.updatePerformanceReview = exports.getPerformanceReviewById = exports.getAllPerformanceReviews = exports.createPerformanceReview = void 0;
const PerformanceReview_1 = require("../models/PerformanceReview");
// Create performance review
const createPerformanceReview = async (req, res) => {
    try {
        const reviewData = req.body;
        const performanceReview = new PerformanceReview_1.PerformanceReview(reviewData);
        const savedReview = await performanceReview.save();
        const populatedReview = await PerformanceReview_1.PerformanceReview.findById(savedReview._id)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('evaluator_id', 'username email');
        res.status(201).json({
            success: true,
            data: populatedReview,
            message: 'Performance review created successfully'
        });
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Performance review already exists for this employee in this period'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error creating performance review',
            error: error.message
        });
    }
};
exports.createPerformanceReview = createPerformanceReview;
// Get all performance reviews with pagination and filtering
const getAllPerformanceReviews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const employeeId = req.query.employee_id;
        const evaluatorId = req.query.evaluator_id;
        const minScore = req.query.min_score;
        const maxScore = req.query.max_score;
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;
        const filter = {};
        if (employeeId)
            filter.employee_id = employeeId;
        if (evaluatorId)
            filter.evaluator_id = evaluatorId;
        if (minScore || maxScore) {
            filter.score = {};
            if (minScore)
                filter.score.$gte = parseInt(minScore);
            if (maxScore)
                filter.score.$lte = parseInt(maxScore);
        }
        if (startDate || endDate) {
            filter.period_start = {};
            if (startDate)
                filter.period_start.$gte = new Date(startDate);
            if (endDate)
                filter.period_start.$lte = new Date(endDate);
        }
        const skip = (page - 1) * limit;
        const reviews = await PerformanceReview_1.PerformanceReview.find(filter)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('evaluator_id', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ period_start: -1, createdAt: -1 });
        const total = await PerformanceReview_1.PerformanceReview.countDocuments(filter);
        res.status(200).json({
            success: true,
            data: reviews,
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
            message: 'Error fetching performance reviews',
            error: error.message
        });
    }
};
exports.getAllPerformanceReviews = getAllPerformanceReviews;
// Get performance review by ID
const getPerformanceReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await PerformanceReview_1.PerformanceReview.findById(id)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('evaluator_id', 'username email');
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Performance review not found'
            });
        }
        res.status(200).json({
            success: true,
            data: review
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching performance review',
            error: error.message
        });
    }
};
exports.getPerformanceReviewById = getPerformanceReviewById;
// Update performance review
const updatePerformanceReview = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const review = await PerformanceReview_1.PerformanceReview.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('employee_id', 'first_name last_name employee_id')
            .populate('evaluator_id', 'username email');
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Performance review not found'
            });
        }
        res.status(200).json({
            success: true,
            data: review,
            message: 'Performance review updated successfully'
        });
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Performance review already exists for this employee in this period'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error updating performance review',
            error: error.message
        });
    }
};
exports.updatePerformanceReview = updatePerformanceReview;
// Delete performance review
const deletePerformanceReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await PerformanceReview_1.PerformanceReview.findByIdAndDelete(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Performance review not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Performance review deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting performance review',
            error: error.message
        });
    }
};
exports.deletePerformanceReview = deletePerformanceReview;
// Get performance reviews by employee
const getPerformanceReviewsByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const year = req.query.year;
        const filter = { employee_id: employeeId };
        if (year) {
            filter.period_start = {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
            };
        }
        const skip = (page - 1) * limit;
        const reviews = await PerformanceReview_1.PerformanceReview.find(filter)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('evaluator_id', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ period_start: -1 });
        const total = await PerformanceReview_1.PerformanceReview.countDocuments(filter);
        res.status(200).json({
            success: true,
            data: reviews,
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
            message: 'Error fetching employee performance reviews',
            error: error.message
        });
    }
};
exports.getPerformanceReviewsByEmployee = getPerformanceReviewsByEmployee;
// Get performance reviews by evaluator
const getPerformanceReviewsByEvaluator = async (req, res) => {
    try {
        const { evaluatorId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const reviews = await PerformanceReview_1.PerformanceReview.find({ evaluator_id: evaluatorId })
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('evaluator_id', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ period_start: -1 });
        const total = await PerformanceReview_1.PerformanceReview.countDocuments({ evaluator_id: evaluatorId });
        res.status(200).json({
            success: true,
            data: reviews,
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
            message: 'Error fetching evaluator performance reviews',
            error: error.message
        });
    }
};
exports.getPerformanceReviewsByEvaluator = getPerformanceReviewsByEvaluator;
// Get performance statistics
const getPerformanceStats = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const year = req.query.year;
        const filter = { employee_id: employeeId };
        if (year) {
            filter.period_start = {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
            };
        }
        const stats = await PerformanceReview_1.PerformanceReview.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    averageScore: { $avg: '$score' },
                    highestScore: { $max: '$score' },
                    lowestScore: { $min: '$score' },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);
        const scoreDistribution = await PerformanceReview_1.PerformanceReview.aggregate([
            { $match: filter },
            {
                $bucket: {
                    groupBy: '$score',
                    boundaries: [0, 60, 70, 80, 90, 100],
                    default: 'Other',
                    output: {
                        count: { $sum: 1 }
                    }
                }
            }
        ]);
        const monthlyStats = await PerformanceReview_1.PerformanceReview.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: { $month: '$period_start' },
                    averageScore: { $avg: '$score' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.status(200).json({
            success: true,
            data: {
                summary: stats[0] || {
                    averageScore: 0,
                    highestScore: 0,
                    lowestScore: 0,
                    totalReviews: 0
                },
                scoreDistribution,
                monthlyBreakdown: monthlyStats
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching performance statistics',
            error: error.message
        });
    }
};
exports.getPerformanceStats = getPerformanceStats;
