import { Request, Response } from 'express';
import { Training, ITraining } from '../models/Training';

// Create training course
export const createTraining = async (req: Request, res: Response) => {
    try {
        const trainingData = req.body;
        const training = new Training(trainingData);
        const savedTraining = await training.save();

        res.status(201).json({
            success: true,
            data: savedTraining,
            message: 'Training course created successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error creating training course',
            error: error.message
        });
    }
};

// Get all training courses with pagination and filtering
export const getAllTrainings = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string;
        const startDate = req.query.start_date as string;
        const endDate = req.query.end_date as string;
        const courseName = req.query.course_name as string;

        const filter: any = {};
        if (status) filter.status = status;
        if (courseName) filter.course_name = { $regex: courseName, $options: 'i' };
        if (startDate || endDate) {
            filter.start_date = {};
            if (startDate) filter.start_date.$gte = new Date(startDate);
            if (endDate) filter.start_date.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const trainings = await Training.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ start_date: -1, createdAt: -1 });

        const total = await Training.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: trainings,
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
            message: 'Error fetching training courses',
            error: error.message
        });
    }
};

// Get training by ID
export const getTrainingById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const training = await Training.findById(id);

        if (!training) {
            return res.status(404).json({
                success: false,
                message: 'Training course not found'
            });
        }

        res.status(200).json({
            success: true,
            data: training
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching training course',
            error: error.message
        });
    }
};

// Update training course
export const updateTraining = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const training = await Training.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!training) {
            return res.status(404).json({
                success: false,
                message: 'Training course not found'
            });
        }

        res.status(200).json({
            success: true,
            data: training,
            message: 'Training course updated successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error updating training course',
            error: error.message
        });
    }
};

// Delete training course
export const deleteTraining = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const training = await Training.findByIdAndDelete(id);

        if (!training) {
            return res.status(404).json({
                success: false,
                message: 'Training course not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Training course deleted successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error deleting training course',
            error: error.message
        });
    }
};

// Update training status
export const updateTrainingStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const training = await Training.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!training) {
            return res.status(404).json({
                success: false,
                message: 'Training course not found'
            });
        }

        res.status(200).json({
            success: true,
            data: training,
            message: 'Training status updated successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error updating training status',
            error: error.message
        });
    }
};

// Get upcoming trainings
export const getUpcomingTrainings = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const days = parseInt(req.query.days as string) || 30;

        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);

        const filter = {
            start_date: { $gte: new Date(), $lte: futureDate },
            status: { $in: ['Planned', 'In Progress'] }
        };

        const skip = (page - 1) * limit;

        const trainings = await Training.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ start_date: 1 });

        const total = await Training.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: trainings,
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
            message: 'Error fetching upcoming trainings',
            error: error.message
        });
    }
};

// Get completed trainings
export const getCompletedTrainings = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const startDate = req.query.start_date as string;
        const endDate = req.query.end_date as string;

        const filter: any = { status: 'Completed' };
        if (startDate || endDate) {
            filter.end_date = {};
            if (startDate) filter.end_date.$gte = new Date(startDate);
            if (endDate) filter.end_date.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const trainings = await Training.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ end_date: -1 });

        const total = await Training.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: trainings,
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
            message: 'Error fetching completed trainings',
            error: error.message
        });
    }
};

// Get training statistics
export const getTrainingStats = async (req: Request, res: Response) => {
    try {
        const year = req.query.year as string;
        const filter: any = {};
        if (year) {
            filter.start_date = {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
            };
        }

        const stats = await Training.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const monthlyStats = await Training.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: { $month: '$start_date' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const totalTrainings = await Training.countDocuments(filter);

        const statsMap = {
            Planned: 0,
            'In Progress': 0,
            Completed: 0,
            Cancelled: 0
        };

        stats.forEach(stat => {
            statsMap[stat._id as keyof typeof statsMap] = stat.count;
        });

        res.status(200).json({
            success: true,
            data: {
                totalTrainings,
                ...statsMap,
                monthlyBreakdown: monthlyStats
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching training statistics',
            error: error.message
        });
    }
}; 