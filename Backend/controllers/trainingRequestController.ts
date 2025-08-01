import { Request, Response } from 'express';
import { TrainingRequest, ITrainingRequest } from '../models/TrainingRequest';

// Create training request
export const createTrainingRequest = async (req: Request, res: Response) => {
    try {
        const requestData = req.body;
        const trainingRequest = new TrainingRequest(requestData);
        const savedRequest = await trainingRequest.save();

        const populatedRequest = await TrainingRequest.findById(savedRequest._id)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('training_id', 'course_name description start_date end_date status');

        res.status(201).json({
            success: true,
            data: populatedRequest,
            message: 'Training request created successfully'
        });
    } catch (error: any) {
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

// Get all training requests with pagination and filtering
export const getAllTrainingRequests = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const employeeId = req.query.employee_id as string;
        const trainingId = req.query.training_id as string;
        const status = req.query.status as string;
        const progress = req.query.progress as string;

        const filter: any = {};
        if (employeeId) filter.employee_id = employeeId;
        if (trainingId) filter.training_id = trainingId;
        if (status) filter.status = status;
        if (progress) filter.progress = progress;

        const skip = (page - 1) * limit;

        const requests = await TrainingRequest.find(filter)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('training_id', 'course_name description start_date end_date status')
            .skip(skip)
            .limit(limit)
            .sort({ requested_at: -1 });

        const total = await TrainingRequest.countDocuments(filter);

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching training requests',
            error: error.message
        });
    }
};

// Get training request by ID
export const getTrainingRequestById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const request = await TrainingRequest.findById(id)
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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching training request',
            error: error.message
        });
    }
};

// Update training request
export const updateTrainingRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const request = await TrainingRequest.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('employee_id', 'first_name last_name employee_id')
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
    } catch (error: any) {
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

// Delete training request
export const deleteTrainingRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const request = await TrainingRequest.findByIdAndDelete(id);

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error deleting training request',
            error: error.message
        });
    }
};

// Approve training request
export const approveTrainingRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const request = await TrainingRequest.findByIdAndUpdate(
            id,
            { status: 'Approved' },
            { new: true, runValidators: true }
        ).populate('employee_id', 'first_name last_name employee_id')
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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error approving training request',
            error: error.message
        });
    }
};

// Reject training request
export const rejectTrainingRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const request = await TrainingRequest.findByIdAndUpdate(
            id,
            { status: 'Rejected' },
            { new: true, runValidators: true }
        ).populate('employee_id', 'first_name last_name employee_id')
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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error rejecting training request',
            error: error.message
        });
    }
};

// Update training progress
export const updateTrainingProgress = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { progress } = req.body;

        const request = await TrainingRequest.findByIdAndUpdate(
            id,
            { progress },
            { new: true, runValidators: true }
        ).populate('employee_id', 'first_name last_name employee_id')
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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error updating training progress',
            error: error.message
        });
    }
};

// Get training requests by employee
export const getTrainingRequestsByEmployee = async (req: Request, res: Response) => {
    try {
        const { employeeId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string;

        const filter: any = { employee_id: employeeId };
        if (status) filter.status = status;

        const skip = (page - 1) * limit;

        const requests = await TrainingRequest.find(filter)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('training_id', 'course_name description start_date end_date status')
            .skip(skip)
            .limit(limit)
            .sort({ requested_at: -1 });

        const total = await TrainingRequest.countDocuments(filter);

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching employee training requests',
            error: error.message
        });
    }
};

// Get pending training requests
export const getPendingTrainingRequests = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const skip = (page - 1) * limit;

        const requests = await TrainingRequest.find({ status: 'Pending' })
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('training_id', 'course_name description start_date end_date status')
            .skip(skip)
            .limit(limit)
            .sort({ requested_at: -1 });

        const total = await TrainingRequest.countDocuments({ status: 'Pending' });

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching pending training requests',
            error: error.message
        });
    }
}; 