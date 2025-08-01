import { Request, Response } from 'express';
import { Payroll, IPayroll } from '../models/Payroll';

// Create payroll record
export const createPayroll = async (req: Request, res: Response) => {
    try {
        const payrollData = req.body;
        const payroll = new Payroll(payrollData);
        const savedPayroll = await payroll.save();

        res.status(201).json({
            success: true,
            data: savedPayroll,
            message: 'Payroll record created successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error creating payroll record',
            error: error.message
        });
    }
};

// Get all payroll records with pagination and filtering
export const getAllPayrolls = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const employeeId = req.query.employee_id as string;
        const status = req.query.status as string;
        const month = req.query.month as string;
        const year = req.query.year as string;
        const department = req.query.department as string;

        const filter: any = {};
        if (employeeId) filter.employeeId = employeeId;
        if (status) filter.status = status;
        if (month) filter.month = month;
        if (year) filter.year = parseInt(year);
        if (department) filter.department = department;

        const skip = (page - 1) * limit;

        const payrolls = await Payroll.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ year: -1, month: -1, createdAt: -1 });

        const total = await Payroll.countDocuments(filter);

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching payroll records',
            error: error.message
        });
    }
};

// Get payroll by ID
export const getPayrollById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payroll = await Payroll.findById(id);

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching payroll record',
            error: error.message
        });
    }
};

// Update payroll record
export const updatePayroll = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const payroll = await Payroll.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error updating payroll record',
            error: error.message
        });
    }
};

// Delete payroll record
export const deletePayroll = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payroll = await Payroll.findByIdAndDelete(id);

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error deleting payroll record',
            error: error.message
        });
    }
};

// Get payroll by employee
export const getPayrollByEmployee = async (req: Request, res: Response) => {
    try {
        const { employeeId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const year = req.query.year as string;

        const filter: any = { employeeId };
        if (year) filter.year = parseInt(year);

        const skip = (page - 1) * limit;

        const payrolls = await Payroll.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ year: -1, month: -1 });

        const total = await Payroll.countDocuments(filter);

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching employee payroll',
            error: error.message
        });
    }
};

// Get payroll by month and year
export const getPayrollByMonthYear = async (req: Request, res: Response) => {
    try {
        const { month, year } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const department = req.query.department as string;

        const filter: any = { month, year: parseInt(year) };
        if (department) filter.department = department;

        const skip = (page - 1) * limit;

        const payrolls = await Payroll.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ employeeName: 1 });

        const total = await Payroll.countDocuments(filter);

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching payroll by month/year',
            error: error.message
        });
    }
};

// Update payroll status
export const updatePayrollStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const payroll = await Payroll.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error updating payroll status',
            error: error.message
        });
    }
};

// Get payroll statistics
export const getPayrollStats = async (req: Request, res: Response) => {
    try {
        const { year } = req.params;
        const month = req.query.month as string;

        const filter: any = { year: parseInt(year) };
        if (month) filter.month = month;

        const stats = await Payroll.aggregate([
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

        const statusStats = await Payroll.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const departmentStats = await Payroll.aggregate([
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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching payroll statistics',
            error: error.message
        });
    }
};

// Bulk create payroll records
export const bulkCreatePayroll = async (req: Request, res: Response) => {
    try {
        const { records } = req.body;

        if (!Array.isArray(records) || records.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Records array is required and must not be empty'
            });
        }

        const payrollRecords = records.map(record => new Payroll(record));
        const savedRecords = await Payroll.insertMany(payrollRecords, {
            ordered: false,
            rawResult: true
        });

        res.status(201).json({
            success: true,
            message: `Successfully created ${savedRecords.insertedCount} payroll records`
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error creating bulk payroll records',
            error: error.message
        });
    }
}; 