import { Request, Response } from 'express';
import { DocumentRequest, IDocumentRequest } from '../models/DocumentRequest';

// Create document request
export const createDocumentRequest = async (req: Request, res: Response) => {
    try {
        const requestData = req.body;
        const documentRequest = new DocumentRequest(requestData);
        const savedRequest = await documentRequest.save();

        const populatedRequest = await DocumentRequest.findById(savedRequest._id)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('processed_by', 'username email')
            .populate('fulfilled_document_id', 'title file_path');

        res.status(201).json({
            success: true,
            data: populatedRequest,
            message: 'Document request created successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error creating document request',
            error: error.message
        });
    }
};

// Get all document requests with pagination and filtering
export const getAllDocumentRequests = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const employeeId = req.query.employee_id as string;
        const status = req.query.status as string;
        const docType = req.query.doc_type as string;
        const startDate = req.query.start_date as string;
        const endDate = req.query.end_date as string;

        const filter: any = {};
        if (employeeId) filter.employee_id = employeeId;
        if (status) filter.status = status;
        if (docType) filter.requested_doc_type = docType;
        if (startDate || endDate) {
            filter.request_date = {};
            if (startDate) filter.request_date.$gte = new Date(startDate);
            if (endDate) filter.request_date.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const requests = await DocumentRequest.find(filter)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('processed_by', 'username email')
            .populate('fulfilled_document_id', 'title file_path')
            .skip(skip)
            .limit(limit)
            .sort({ request_date: -1 });

        const total = await DocumentRequest.countDocuments(filter);

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
            message: 'Error fetching document requests',
            error: error.message
        });
    }
};

// Get document request by ID
export const getDocumentRequestById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const request = await DocumentRequest.findById(id)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('processed_by', 'username email')
            .populate('fulfilled_document_id', 'title file_path');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Document request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching document request',
            error: error.message
        });
    }
};

// Update document request
export const updateDocumentRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const request = await DocumentRequest.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('employee_id', 'first_name last_name employee_id')
            .populate('processed_by', 'username email')
            .populate('fulfilled_document_id', 'title file_path');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Document request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: request,
            message: 'Document request updated successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error updating document request',
            error: error.message
        });
    }
};

// Delete document request
export const deleteDocumentRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const request = await DocumentRequest.findByIdAndDelete(id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Document request not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Document request deleted successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error deleting document request',
            error: error.message
        });
    }
};

// Update document request status
export const updateDocumentRequestStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, processed_by, hr_notes } = req.body;

        const updateData: any = { status };
        if (processed_by) updateData.processed_by = processed_by;
        if (hr_notes) updateData.hr_notes = hr_notes;
        if (status === 'Fulfilled' || status === 'Rejected') {
            updateData.processed_date = new Date();
        }

        const request = await DocumentRequest.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('employee_id', 'first_name last_name employee_id')
            .populate('processed_by', 'username email')
            .populate('fulfilled_document_id', 'title file_path');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Document request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: request,
            message: 'Document request status updated successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error updating document request status',
            error: error.message
        });
    }
};

// Fulfill document request
export const fulfillDocumentRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { fulfilled_document_id, processed_by, hr_notes } = req.body;

        const request = await DocumentRequest.findByIdAndUpdate(
            id,
            {
                status: 'Fulfilled',
                fulfilled_document_id,
                processed_by,
                processed_date: new Date(),
                hr_notes
            },
            { new: true, runValidators: true }
        ).populate('employee_id', 'first_name last_name employee_id')
            .populate('processed_by', 'username email')
            .populate('fulfilled_document_id', 'title file_path');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Document request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: request,
            message: 'Document request fulfilled successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fulfilling document request',
            error: error.message
        });
    }
};

// Get document requests by employee
export const getDocumentRequestsByEmployee = async (req: Request, res: Response) => {
    try {
        const { employeeId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string;

        const filter: any = { employee_id: employeeId };
        if (status) filter.status = status;

        const skip = (page - 1) * limit;

        const requests = await DocumentRequest.find(filter)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('processed_by', 'username email')
            .populate('fulfilled_document_id', 'title file_path')
            .skip(skip)
            .limit(limit)
            .sort({ request_date: -1 });

        const total = await DocumentRequest.countDocuments(filter);

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
            message: 'Error fetching employee document requests',
            error: error.message
        });
    }
};

// Get pending document requests
export const getPendingDocumentRequests = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const skip = (page - 1) * limit;

        const requests = await DocumentRequest.find({ status: 'Pending' })
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('processed_by', 'username email')
            .populate('fulfilled_document_id', 'title file_path')
            .skip(skip)
            .limit(limit)
            .sort({ request_date: -1 });

        const total = await DocumentRequest.countDocuments({ status: 'Pending' });

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
            message: 'Error fetching pending document requests',
            error: error.message
        });
    }
};

// Get document request statistics
export const getDocumentRequestStats = async (req: Request, res: Response) => {
    try {
        const year = req.query.year as string;
        const filter: any = {};
        if (year) {
            filter.request_date = {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
            };
        }

        const statusStats = await DocumentRequest.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const docTypeStats = await DocumentRequest.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$requested_doc_type',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        const monthlyStats = await DocumentRequest.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: { $month: '$request_date' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const totalRequests = await DocumentRequest.countDocuments(filter);

        const statsMap = {
            Pending: 0,
            'In Progress': 0,
            Fulfilled: 0,
            Rejected: 0
        };

        statusStats.forEach(stat => {
            statsMap[stat._id as keyof typeof statsMap] = stat.count;
        });

        res.status(200).json({
            success: true,
            data: {
                totalRequests,
                statusBreakdown: statsMap,
                docTypeBreakdown: docTypeStats,
                monthlyBreakdown: monthlyStats
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching document request statistics',
            error: error.message
        });
    }
}; 