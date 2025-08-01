"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkCreatePayroll = exports.getPayrollStats = exports.updatePayrollStatus = exports.getPayrollByMonthYear = exports.getPayrollByEmployee = exports.deletePayroll = exports.updatePayroll = exports.getPayrollById = exports.getAllPayrolls = exports.createPayroll = void 0;
const Payroll_1 = require("../models/Payroll");
// Create payroll record
const createPayroll = async (req, res) => {
    try {
        const payrollData = req.body;
        const payroll = new Payroll_1.Payroll(payrollData);
        const savedPayroll = await payroll.save();
        res.status(201).json({
            success: true,
            data: savedPayroll,
            message: 'Payroll record created successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating payroll record',
            error: error.message
        });
    }
};
exports.createPayroll = createPayroll;
// Get all payroll records with pagination and filtering
const getAllPayrolls = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const employeeId = req.query.employee_id;
        const status = req.query.status;
        const month = req.query.month;
        const year = req.query.year;
        const department = req.query.department;
        const filter = {};
        if (employeeId)
            filter.employeeId = employeeId;
        if (status)
            filter.status = status;
        if (month)
            filter.month = month;
        if (year)
            filter.year = parseInt(year);
        if (department)
            filter.department = department;
        const skip = (page - 1) * limit;
        const payrolls = await Payroll_1.Payroll.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ year: -1, month: -1, createdAt: -1 });
        const total = await Payroll_1.Payroll.countDocuments(filter);
        res.status(200).json({
            success: true,
            data: payrolls,
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
            message: 'Error fetching payroll records',
            error: error.message
        });
    }
};
exports.getAllPayrolls = getAllPayrolls;
// Get payroll by ID
const getPayrollById = async (req, res) => {
    try {
        const { id } = req.params;
        const payroll = await Payroll_1.Payroll.findById(id);
        if (!payroll) {
            return res.status(404).json({
                success: false,
                message: 'Payroll record not found'
            });
        }
        res.status(200).json({
            success: true,
            data: payroll
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching payroll record',
            error: error.message
        });
    }
};
exports.getPayrollById = getPayrollById;
// Update payroll record
const updatePayroll = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const payroll = await Payroll_1.Payroll.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!payroll) {
            return res.status(404).json({
                success: false,
                message: 'Payroll record not found'
            });
        }
        res.status(200).json({
            success: true,
            data: payroll,
            message: 'Payroll record updated successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating payroll record',
            error: error.message
        });
    }
};
exports.updatePayroll = updatePayroll;
// Delete payroll record
const deletePayroll = async (req, res) => {
    try {
        const { id } = req.params;
        const payroll = await Payroll_1.Payroll.findByIdAndDelete(id);
        if (!payroll) {
            return res.status(404).json({
                success: false,
                message: 'Payroll record not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Payroll record deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting payroll record',
            error: error.message
        });
    }
};
exports.deletePayroll = deletePayroll;
// Get payroll by employee
const getPayrollByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const year = req.query.year;
        const filter = { employeeId };
        if (year)
            filter.year = parseInt(year);
        const skip = (page - 1) * limit;
        const payrolls = await Payroll_1.Payroll.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ year: -1, month: -1 });
        const total = await Payroll_1.Payroll.countDocuments(filter);
        res.status(200).json({
            success: true,
            data: payrolls,
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
            message: 'Error fetching employee payroll',
            error: error.message
        });
    }
};
exports.getPayrollByEmployee = getPayrollByEmployee;
// Get payroll by month and year
const getPayrollByMonthYear = async (req, res) => {
    try {
        const { month, year } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const department = req.query.department;
        const filter = { month, year: parseInt(year) };
        if (department)
            filter.department = department;
        const skip = (page - 1) * limit;
        const payrolls = await Payroll_1.Payroll.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ employeeName: 1 });
        const total = await Payroll_1.Payroll.countDocuments(filter);
        res.status(200).json({
            success: true,
            data: payrolls,
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
            message: 'Error fetching payroll by month/year',
            error: error.message
        });
    }
};
exports.getPayrollByMonthYear = getPayrollByMonthYear;
// Update payroll status
const updatePayrollStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const payroll = await Payroll_1.Payroll.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
        if (!payroll) {
            return res.status(404).json({
                success: false,
                message: 'Payroll record not found'
            });
        }
        res.status(200).json({
            success: true,
            data: payroll,
            message: 'Payroll status updated successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating payroll status',
            error: error.message
        });
    }
};
exports.updatePayrollStatus = updatePayrollStatus;
// Get payroll statistics
const getPayrollStats = async (req, res) => {
    try {
        const { year } = req.params;
        const month = req.query.month;
        const filter = { year: parseInt(year) };
        if (month)
            filter.month = month;
        const stats = await Payroll_1.Payroll.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalPayroll: { $sum: '$netSalary' },
                    totalBasicSalary: { $sum: '$basicSalary' },
                    totalBonus: { $sum: '$bonus' },
                    totalDeductions: { $sum: '$deductions' },
                    count: { $sum: 1 }
                }
            }
        ]);
        const statusStats = await Payroll_1.Payroll.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        const departmentStats = await Payroll_1.Payroll.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$department',
                    totalPayroll: { $sum: '$netSalary' },
                    count: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json({
            success: true,
            data: {
                summary: stats[0] || {
                    totalPayroll: 0,
                    totalBasicSalary: 0,
                    totalBonus: 0,
                    totalDeductions: 0,
                    count: 0
                },
                statusBreakdown: statusStats,
                departmentBreakdown: departmentStats
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching payroll statistics',
            error: error.message
        });
    }
};
exports.getPayrollStats = getPayrollStats;
// Bulk create payroll records
const bulkCreatePayroll = async (req, res) => {
    try {
        const { records } = req.body;
        if (!Array.isArray(records) || records.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Records array is required and must not be empty'
            });
        }
        const payrollRecords = records.map(record => new Payroll_1.Payroll(record));
        const savedRecords = await Payroll_1.Payroll.insertMany(payrollRecords, {
            ordered: false,
            rawResult: true
        });
        res.status(201).json({
            success: true,
            message: `Successfully created ${savedRecords.insertedCount} payroll records`
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating bulk payroll records',
            error: error.message
        });
    }
};
exports.bulkCreatePayroll = bulkCreatePayroll;
