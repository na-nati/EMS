"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkCreateAttendance = exports.getAttendanceStats = exports.getAttendanceByEmployee = exports.deleteAttendance = exports.updateAttendance = exports.getAttendanceById = exports.getAllAttendance = exports.createAttendance = void 0;
const Attendance_1 = require("../models/Attendance");
// Create attendance record
const createAttendance = async (req, res) => {
    try {
        const attendanceData = req.body;
        const attendance = new Attendance_1.Attendance(attendanceData);
        const savedAttendance = await attendance.save();
        const populatedAttendance = await Attendance_1.Attendance.findById(savedAttendance._id)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('checked_by', 'username email');
        res.status(201).json({
            success: true,
            data: populatedAttendance,
            message: 'Attendance record created successfully'
        });
    }
    catch (error) {
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
exports.createAttendance = createAttendance;
// Get all attendance records with pagination and filtering
const getAllAttendance = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const employeeId = req.query.employee_id;
        const status = req.query.status;
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;
        const filter = {};
        if (employeeId)
            filter.employee_id = employeeId;
        if (status)
            filter.status = status;
        if (startDate || endDate) {
            filter.date = {};
            if (startDate)
                filter.date.$gte = new Date(startDate);
            if (endDate)
                filter.date.$lte = new Date(endDate);
        }
        const skip = (page - 1) * limit;
        const attendance = await Attendance_1.Attendance.find(filter)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('checked_by', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ date: -1, createdAt: -1 });
        const total = await Attendance_1.Attendance.countDocuments(filter);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching attendance records',
            error: error.message
        });
    }
};
exports.getAllAttendance = getAllAttendance;
// Get attendance by ID
const getAttendanceById = async (req, res) => {
    try {
        const { id } = req.params;
        const attendance = await Attendance_1.Attendance.findById(id)
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching attendance record',
            error: error.message
        });
    }
};
exports.getAttendanceById = getAttendanceById;
// Update attendance record
const updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const attendance = await Attendance_1.Attendance.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('employee_id', 'first_name last_name employee_id')
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
    }
    catch (error) {
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
exports.updateAttendance = updateAttendance;
// Delete attendance record
const deleteAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const attendance = await Attendance_1.Attendance.findByIdAndDelete(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting attendance record',
            error: error.message
        });
    }
};
exports.deleteAttendance = deleteAttendance;
// Get attendance by employee
const getAttendanceByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;
        const filter = { employee_id: employeeId };
        if (startDate || endDate) {
            filter.date = {};
            if (startDate)
                filter.date.$gte = new Date(startDate);
            if (endDate)
                filter.date.$lte = new Date(endDate);
        }
        const skip = (page - 1) * limit;
        const attendance = await Attendance_1.Attendance.find(filter)
            .populate('employee_id', 'first_name last_name employee_id')
            .populate('checked_by', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ date: -1 });
        const total = await Attendance_1.Attendance.countDocuments(filter);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching employee attendance',
            error: error.message
        });
    }
};
exports.getAttendanceByEmployee = getAttendanceByEmployee;
// Get attendance statistics
const getAttendanceStats = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;
        const filter = { employee_id: employeeId };
        if (startDate || endDate) {
            filter.date = {};
            if (startDate)
                filter.date.$gte = new Date(startDate);
            if (endDate)
                filter.date.$lte = new Date(endDate);
        }
        const stats = await Attendance_1.Attendance.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        const totalDays = await Attendance_1.Attendance.countDocuments(filter);
        const statsMap = {
            Present: 0,
            Absent: 0,
            Leave: 0,
            'Half-Day': 0
        };
        stats.forEach(stat => {
            statsMap[stat._id] = stat.count;
        });
        res.status(200).json({
            success: true,
            data: {
                totalDays,
                ...statsMap,
                attendanceRate: totalDays > 0 ? ((statsMap.Present + statsMap['Half-Day'] * 0.5) / totalDays * 100).toFixed(2) : 0
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching attendance statistics',
            error: error.message
        });
    }
};
exports.getAttendanceStats = getAttendanceStats;
// Bulk create attendance records
const bulkCreateAttendance = async (req, res) => {
    try {
        const { records } = req.body;
        if (!Array.isArray(records) || records.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Records array is required and must not be empty'
            });
        }
        const attendanceRecords = records.map(record => new Attendance_1.Attendance(record));
        const savedRecords = await Attendance_1.Attendance.insertMany(attendanceRecords, {
            ordered: false,
            rawResult: true
        });
        const populatedRecords = await Attendance_1.Attendance.find({
            _id: { $in: savedRecords.insertedIds }
        }).populate('employee_id', 'first_name last_name employee_id')
            .populate('checked_by', 'username email');
        res.status(201).json({
            success: true,
            data: populatedRecords,
            message: `Successfully created ${savedRecords.insertedCount} attendance records`
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating bulk attendance records',
            error: error.message
        });
    }
};
exports.bulkCreateAttendance = bulkCreateAttendance;
