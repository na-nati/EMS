"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrainingStats = exports.getCompletedTrainings = exports.getUpcomingTrainings = exports.updateTrainingStatus = exports.deleteTraining = exports.updateTraining = exports.getTrainingById = exports.getAllTrainings = exports.createTraining = void 0;
const Training_1 = require("../models/Training");
// Create training course
const createTraining = async (req, res) => {
    try {
        const trainingData = req.body;
        const training = new Training_1.Training(trainingData);
        const savedTraining = await training.save();
        res.status(201).json({
            success: true,
            data: savedTraining,
            message: 'Training course created successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating training course',
            error: error.message
        });
    }
};
exports.createTraining = createTraining;
// Get all training courses with pagination and filtering
const getAllTrainings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;
        const courseName = req.query.course_name;
        const filter = {};
        if (status)
            filter.status = status;
        if (courseName)
            filter.course_name = { $regex: courseName, $options: 'i' };
        if (startDate || endDate) {
            filter.start_date = {};
            if (startDate)
                filter.start_date.$gte = new Date(startDate);
            if (endDate)
                filter.start_date.$lte = new Date(endDate);
        }
        const skip = (page - 1) * limit;
        const trainings = await Training_1.Training.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ start_date: -1, createdAt: -1 });
        const total = await Training_1.Training.countDocuments(filter);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching training courses',
            error: error.message
        });
    }
};
exports.getAllTrainings = getAllTrainings;
// Get training by ID
const getTrainingById = async (req, res) => {
    try {
        const { id } = req.params;
        const training = await Training_1.Training.findById(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching training course',
            error: error.message
        });
    }
};
exports.getTrainingById = getTrainingById;
// Update training course
const updateTraining = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const training = await Training_1.Training.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating training course',
            error: error.message
        });
    }
};
exports.updateTraining = updateTraining;
// Delete training course
const deleteTraining = async (req, res) => {
    try {
        const { id } = req.params;
        const training = await Training_1.Training.findByIdAndDelete(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting training course',
            error: error.message
        });
    }
};
exports.deleteTraining = deleteTraining;
// Update training status
const updateTrainingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const training = await Training_1.Training.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating training status',
            error: error.message
        });
    }
};
exports.updateTrainingStatus = updateTrainingStatus;
// Get upcoming trainings
const getUpcomingTrainings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const days = parseInt(req.query.days) || 30;
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);
        const filter = {
            start_date: { $gte: new Date(), $lte: futureDate },
            status: { $in: ['Planned', 'In Progress'] }
        };
        const skip = (page - 1) * limit;
        const trainings = await Training_1.Training.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ start_date: 1 });
        const total = await Training_1.Training.countDocuments(filter);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching upcoming trainings',
            error: error.message
        });
    }
};
exports.getUpcomingTrainings = getUpcomingTrainings;
// Get completed trainings
const getCompletedTrainings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;
        const filter = { status: 'Completed' };
        if (startDate || endDate) {
            filter.end_date = {};
            if (startDate)
                filter.end_date.$gte = new Date(startDate);
            if (endDate)
                filter.end_date.$lte = new Date(endDate);
        }
        const skip = (page - 1) * limit;
        const trainings = await Training_1.Training.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ end_date: -1 });
        const total = await Training_1.Training.countDocuments(filter);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching completed trainings',
            error: error.message
        });
    }
};
exports.getCompletedTrainings = getCompletedTrainings;
// Get training statistics
const getTrainingStats = async (req, res) => {
    try {
        const year = req.query.year;
        const filter = {};
        if (year) {
            filter.start_date = {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
            };
        }
        const stats = await Training_1.Training.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        const monthlyStats = await Training_1.Training.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: { $month: '$start_date' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        const totalTrainings = await Training_1.Training.countDocuments(filter);
        const statsMap = {
            Planned: 0,
            'In Progress': 0,
            Completed: 0,
            Cancelled: 0
        };
        stats.forEach(stat => {
            statsMap[stat._id] = stat.count;
        });
        res.status(200).json({
            success: true,
            data: {
                totalTrainings,
                ...statsMap,
                monthlyBreakdown: monthlyStats
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching training statistics',
            error: error.message
        });
    }
};
exports.getTrainingStats = getTrainingStats;
