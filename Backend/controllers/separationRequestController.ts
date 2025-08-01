import { Request, Response } from 'express';
import { SeparationRequest, ISeparationRequest } from '../models/SeparationRequest';

// Create separation request
export const createSeparationRequest = async (req: Request, res: Response) => {
    try {
        const separationData = req.body;
        const separationRequest = new SeparationRequest(separationData);
        const savedRequest = await separationRequest.save();

        const populatedRequest = await SeparationRequest.findById(savedRequest._id)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email')
            .populate('processed_by', 'username email');

        res.status(201).json({
            success: true,
            data: populatedRequest,
            message: 'Separation request created successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error creating separation request',
            error: error.message
        });
    }
};

// Get all separation requests with pagination and filtering
export const getAllSeparationRequests = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string;
        const startDate = req.query.start_date as string;
        const endDate = req.query.end_date as string;

        const filter: any = {};
        if (status) filter.status = status;
        if (startDate || endDate) {
            filter.created_at = {};
            if (startDate) filter.created_at.$gte = new Date(startDate);
            if (endDate) filter.created_at.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const requests = await SeparationRequest.find(filter)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email')
            .populate('processed_by', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 });

        const total = await SeparationRequest.countDocuments(filter);

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
            message: 'Error fetching separation requests',
            error: error.message
        });
    }
};

// Get separation request by ID
export const getSeparationRequestById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const request = await SeparationRequest.findById(id)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email')
            .populate('processed_by', 'username email');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Separation request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching separation request',
            error: error.message
        });
    }
};

// Update separation request
export const updateSeparationRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const request = await SeparationRequest.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email')
            .populate('processed_by', 'username email');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Separation request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: request,
            message: 'Separation request updated successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error updating separation request',
            error: error.message
        });
    }
};

// Delete separation request
export const deleteSeparationRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const request = await SeparationRequest.findByIdAndDelete(id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Separation request not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Separation request deleted successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error deleting separation request',
            error: error.message
        });
    }
};

// Approve separation request
export const approveSeparationRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { approved_by } = req.body;

        const request = await SeparationRequest.findByIdAndUpdate(
            id,
            {
                status: 'approved',
                approved_by
            },
            { new: true, runValidators: true }
        ).populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email')
            .populate('processed_by', 'username email');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Separation request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: request,
            message: 'Separation request approved successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error approving separation request',
            error: error.message
        });
    }
};

// Process separation request by HR
export const processSeparationRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { processed_by } = req.body;

        const request = await SeparationRequest.findByIdAndUpdate(
            id,
            {
                status: 'hr_processed',
                processed_by
            },
            { new: true, runValidators: true }
        ).populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email')
            .populate('processed_by', 'username email');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Separation request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: request,
            message: 'Separation request processed by HR successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error processing separation request',
            error: error.message
        });
    }
};

// Get separation requests by employee
export const getSeparationRequestsByEmployee = async (req: Request, res: Response) => {
    try {
        const { employeeId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const skip = (page - 1) * limit;

        const requests = await SeparationRequest.find({ employee_id: employeeId })
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email')
            .populate('processed_by', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 });

        const total = await SeparationRequest.countDocuments({ employee_id: employeeId });

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
            message: 'Error fetching employee separation requests',
            error: error.message
        });
    }
};

// Get pending separation requests
export const getPendingSeparationRequests = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const skip = (page - 1) * limit;

        const requests = await SeparationRequest.find({ status: 'pending' })
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email')
            .populate('processed_by', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 });

        const total = await SeparationRequest.countDocuments({ status: 'pending' });

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
            message: 'Error fetching pending separation requests',
            error: error.message
        });
    }
}; 