import { Request, Response } from 'express';
import { LeaveRequest, ILeaveRequest } from '../models/LeaveRequest';

// Create leave request
export const createLeaveRequest = async (req: Request, res: Response) => {
    try {
        const leaveData = req.body;
        const leaveRequest = new LeaveRequest(leaveData);
        const savedLeaveRequest = await leaveRequest.save();

        const populatedLeaveRequest = await LeaveRequest.findById(savedLeaveRequest._id)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email');

        res.status(201).json({
            success: true,
            data: populatedLeaveRequest,
            message: 'Leave request created successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error creating leave request',
            error: error.message
        });
    }
};

// Get all leave requests with pagination and filtering
export const getAllLeaveRequests = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const employeeId = req.query.employee_id as string;
        const status = req.query.status as string;
        const startDate = req.query.start_date as string;
        const endDate = req.query.end_date as string;

        const filter: any = {};
        if (employeeId) filter.employee_id = employeeId;
        if (status) filter.status = status;
        if (startDate || endDate) {
            filter.start_date = {};
            if (startDate) filter.start_date.$gte = new Date(startDate);
            if (endDate) filter.start_date.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const leaveRequests = await LeaveRequest.find(filter)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 });

        const total = await LeaveRequest.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: leaveRequests,
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
            message: 'Error fetching leave requests',
            error: error.message
        });
    }
};

// Get leave request by ID
export const getLeaveRequestById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const leaveRequest = await LeaveRequest.findById(id)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email');

        if (!leaveRequest) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: leaveRequest
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching leave request',
            error: error.message
        });
    }
};

// Update leave request
export const updateLeaveRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const leaveRequest = await LeaveRequest.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email');

        if (!leaveRequest) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: leaveRequest,
            message: 'Leave request updated successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error updating leave request',
            error: error.message
        });
    }
};

// Delete leave request
export const deleteLeaveRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const leaveRequest = await LeaveRequest.findByIdAndDelete(id);

        if (!leaveRequest) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Leave request deleted successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error deleting leave request',
            error: error.message
        });
    }
};

// Approve leave request
export const approveLeaveRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { approved_by } = req.body;

        const leaveRequest = await LeaveRequest.findByIdAndUpdate(
            id,
            {
                status: 'approved',
                approved_by
            },
            { new: true, runValidators: true }
        ).populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email');

        if (!leaveRequest) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: leaveRequest,
            message: 'Leave request approved successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error approving leave request',
            error: error.message
        });
    }
};

// Reject leave request
export const rejectLeaveRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { approved_by } = req.body;

        const leaveRequest = await LeaveRequest.findByIdAndUpdate(
            id,
            {
                status: 'rejected',
                approved_by
            },
            { new: true, runValidators: true }
        ).populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email');

        if (!leaveRequest) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: leaveRequest,
            message: 'Leave request rejected successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error rejecting leave request',
            error: error.message
        });
    }
};

// Get leave requests by employee
export const getLeaveRequestsByEmployee = async (req: Request, res: Response) => {
    try {
        const { employeeId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string;

        const filter: any = { employee_id: employeeId };
        if (status) filter.status = status;

        const skip = (page - 1) * limit;

        const leaveRequests = await LeaveRequest.find(filter)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 });

        const total = await LeaveRequest.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: leaveRequests,
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
            message: 'Error fetching employee leave requests',
            error: error.message
        });
    }
};

// Get pending leave requests
export const getPendingLeaveRequests = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const skip = (page - 1) * limit;

        const leaveRequests = await LeaveRequest.find({ status: 'pending' })
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('approved_by', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 });

        const total = await LeaveRequest.countDocuments({ status: 'pending' });

        res.status(200).json({
            success: true,
            data: leaveRequests,
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
            message: 'Error fetching pending leave requests',
            error: error.message
        });
    }
}; 