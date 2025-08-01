import { Request, Response } from 'express';
import { PerformanceReview, IPerformanceReview } from '../models/PerformanceReview';

// Create performance review
export const createPerformanceReview = async (req: Request, res: Response) => {
    try {
        const reviewData = req.body;
        const performanceReview = new PerformanceReview(reviewData);
        const savedReview = await performanceReview.save();

        const populatedReview = await PerformanceReview.findById(savedReview._id)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('evaluator_id', 'username email');

        res.status(201).json({
            success: true,
            data: populatedReview,
            message: 'Performance review created successfully'
        });
    } catch (error: any) {
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

// Get all performance reviews with pagination and filtering
export const getAllPerformanceReviews = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const employeeId = req.query.employee_id as string;
        const evaluatorId = req.query.evaluator_id as string;
        const minScore = req.query.min_score as string;
        const maxScore = req.query.max_score as string;
        const startDate = req.query.start_date as string;
        const endDate = req.query.end_date as string;

        const filter: any = {};
        if (employeeId) filter.employee_id = employeeId;
        if (evaluatorId) filter.evaluator_id = evaluatorId;
        if (minScore || maxScore) {
            filter.score = {};
            if (minScore) filter.score.$gte = parseInt(minScore);
            if (maxScore) filter.score.$lte = parseInt(maxScore);
        }
        if (startDate || endDate) {
            filter.period_start = {};
            if (startDate) filter.period_start.$gte = new Date(startDate);
            if (endDate) filter.period_start.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const reviews = await PerformanceReview.find(filter)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('evaluator_id', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ period_start: -1, createdAt: -1 });

        const total = await PerformanceReview.countDocuments(filter);

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching performance reviews',
            error: error.message
        });
    }
};

// Get performance review by ID
export const getPerformanceReviewById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const review = await PerformanceReview.findById(id)
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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching performance review',
            error: error.message
        });
    }
};

// Update performance review
export const updatePerformanceReview = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const review = await PerformanceReview.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('employee_id', 'first_name last_name employee_id')
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
    } catch (error: any) {
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

// Delete performance review
export const deletePerformanceReview = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const review = await PerformanceReview.findByIdAndDelete(id);

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error deleting performance review',
            error: error.message
        });
    }
};

// Get performance reviews by employee
export const getPerformanceReviewsByEmployee = async (req: Request, res: Response) => {
    try {
        const { employeeId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const year = req.query.year as string;

        const filter: any = { employee_id: employeeId };
        if (year) {
            filter.period_start = {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
            };
        }

        const skip = (page - 1) * limit;

        const reviews = await PerformanceReview.find(filter)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('evaluator_id', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ period_start: -1 });

        const total = await PerformanceReview.countDocuments(filter);

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching employee performance reviews',
            error: error.message
        });
    }
};

// Get performance reviews by evaluator
export const getPerformanceReviewsByEvaluator = async (req: Request, res: Response) => {
    try {
        const { evaluatorId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const skip = (page - 1) * limit;

        const reviews = await PerformanceReview.find({ evaluator_id: evaluatorId })
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('evaluator_id', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ period_start: -1 });

        const total = await PerformanceReview.countDocuments({ evaluator_id: evaluatorId });

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching evaluator performance reviews',
            error: error.message
        });
    }
};

// Get performance statistics
export const getPerformanceStats = async (req: Request, res: Response) => {
    try {
        const { employeeId } = req.params;
        const year = req.query.year as string;

        const filter: any = { employee_id: employeeId };
        if (year) {
            filter.period_start = {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
            };
        }

        const stats = await PerformanceReview.aggregate([
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

        const scoreDistribution = await PerformanceReview.aggregate([
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

        const monthlyStats = await PerformanceReview.aggregate([
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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching performance statistics',
            error: error.message
        });
    }
}; 