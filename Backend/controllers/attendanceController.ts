import { Request, Response } from 'express';
import { Attendance, IAttendance } from '../models/Attendance';

// Create attendance record
export const createAttendance = async (req: Request, res: Response) => {
    try {
        const attendanceData = req.body;
        const attendance = new Attendance(attendanceData);
        const savedAttendance = await attendance.save();

        const populatedAttendance = await Attendance.findById(savedAttendance._id)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('checked_by', 'username email');

        res.status(201).json({
            success: true,
            data: populatedAttendance,
            message: 'Attendance record created successfully'
        });
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Attendance record already exists for this employee on this date'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error creating attendance record',
            error: error.message
        });
    }
};

// Get all attendance records with pagination and filtering
export const getAllAttendance = async (req: Request, res: Response) => {
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
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const attendance = await Attendance.find(filter)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('checked_by', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ date: -1, createdAt: -1 });

        const total = await Attendance.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: attendance,
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
            message: 'Error fetching attendance records',
            error: error.message
        });
    }
};

// Get attendance by ID
export const getAttendanceById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const attendance = await Attendance.findById(id)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('checked_by', 'username email');

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: 'Attendance record not found'
            });
        }

        res.status(200).json({
            success: true,
            data: attendance
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching attendance record',
            error: error.message
        });
    }
};

// Update attendance record
export const updateAttendance = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const attendance = await Attendance.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('employee_id', 'first_name last_name employee_id')
            .populate('checked_by', 'username email');

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: 'Attendance record not found'
            });
        }

        res.status(200).json({
            success: true,
            data: attendance,
            message: 'Attendance record updated successfully'
        });
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Attendance record already exists for this employee on this date'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error updating attendance record',
            error: error.message
        });
    }
};

// Delete attendance record
export const deleteAttendance = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const attendance = await Attendance.findByIdAndDelete(id);

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: 'Attendance record not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Attendance record deleted successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error deleting attendance record',
            error: error.message
        });
    }
};

// Get attendance by employee
export const getAttendanceByEmployee = async (req: Request, res: Response) => {
    try {
        const { employeeId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const startDate = req.query.start_date as string;
        const endDate = req.query.end_date as string;

        const filter: any = { employee_id: employeeId };
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const attendance = await Attendance.find(filter)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('checked_by', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ date: -1 });

        const total = await Attendance.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: attendance,
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
            message: 'Error fetching employee attendance',
            error: error.message
        });
    }
};

// Get attendance statistics
export const getAttendanceStats = async (req: Request, res: Response) => {
    try {
        const { employeeId } = req.params;
        const startDate = req.query.start_date as string;
        const endDate = req.query.end_date as string;

        const filter: any = { employee_id: employeeId };
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const stats = await Attendance.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalDays = await Attendance.countDocuments(filter);

        const statsMap = {
            Present: 0,
            Absent: 0,
            Leave: 0,
            'Half-Day': 0
        };

        stats.forEach(stat => {
            statsMap[stat._id as keyof typeof statsMap] = stat.count;
        });

        res.status(200).json({
            success: true,
            data: {
                totalDays,
                ...statsMap,
                attendanceRate: totalDays > 0 ? ((statsMap.Present + statsMap['Half-Day'] * 0.5) / totalDays * 100).toFixed(2) : 0
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching attendance statistics',
            error: error.message
        });
    }
};

// Bulk create attendance records
export const bulkCreateAttendance = async (req: Request, res: Response) => {
    try {
        const { records } = req.body;

        if (!Array.isArray(records) || records.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Records array is required and must not be empty'
            });
        }

        const attendanceRecords = records.map(record => new Attendance(record));
        const savedRecords = await Attendance.insertMany(attendanceRecords, {
            ordered: false,
            rawResult: true
        });

        const populatedRecords = await Attendance.find({
            _id: { $in: savedRecords.insertedIds }
        }).populate('employee_id', 'first_name last_name employee_id')
            .populate('checked_by', 'username email');

        res.status(201).json({
            success: true,
            data: populatedRecords,
            message: `Successfully created ${savedRecords.insertedCount} attendance records`
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error creating bulk attendance records',
            error: error.message
        });
    }
}; 