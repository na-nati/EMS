import { Request, Response } from 'express';
import { Employee } from '../models/Employee';
import { User } from '../models/User';

// Create a new employee
export const createEmployee = async (req: Request, res: Response) => {
    try {
        const {
            user_id,
            employee_code,
            job_profile,
            salary_id,
            manager_id,
            department_id,
            joining_date,
            employment_status
        } = req.body;

        // Check if user exists
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check for unique employee_code
        const existing = await Employee.findOne({ employee_code });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Employee code already exists'
            });
        }

        const employee = new Employee({
            user_id,
            employee_code,
            job_profile,
            salary_id,
            manager_id,
            department_id,
            joining_date,
            employment_status
        });

        const savedEmployee = await employee.save();

        const populatedEmployee = await Employee.findById(savedEmployee._id)
            .populate('user_id', 'firstName lastName email role')
            .populate('manager_id', 'firstName lastName email role')
            .populate('department_id', 'name')
            .populate('salary_id');

        res.status(201).json({
            success: true,
            data: populatedEmployee,
            message: 'Employee created successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error creating employee',
            error: error.message
        });
    }
};

// Get all employees with pagination and filtering
export const getAllEmployees = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const employment_status = req.query.employment_status as string;
        const search = req.query.search as string;

        const filter: any = {};
        if (employment_status) filter.employment_status = employment_status;
        if (search) {
            filter.$or = [
                { employee_code: { $regex: search, $options: 'i' } },
                { job_profile: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;

        const employees = await Employee.find(filter)
            .populate('user_id', 'firstName lastName email role')
            .populate('manager_id', 'firstName lastName email role')
            .populate('salary_id')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Employee.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: employees,
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
            message: 'Error fetching employees',
            error: error.message
        });
    }
};

// Get employee by ID
export const getEmployeeById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id)
            .populate('user_id', 'firstName lastName email role')
            .populate('manager_id', 'firstName lastName email role')
            .populate('salary_id');

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            success: true,
            data: employee
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching employee',
            error: error.message
        });
    }
};

// Update employee
export const updateEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // If employee_code is being updated, check for uniqueness
        if (updateData.employee_code) {
            const existing = await Employee.findOne({
                employee_code: updateData.employee_code,
                _id: { $ne: id }
            });
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: 'Employee code already exists'
                });
            }
        }

        const employee = await Employee.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )
            .populate('user_id', 'firstName lastName email role')
            .populate('manager_id', 'firstName lastName email role')
            .populate('salary_id');

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            success: true,
            data: employee,
            message: 'Employee updated successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error updating employee',
            error: error.message
        });
    }
};

// Delete employee
export const deleteEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByIdAndDelete(id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Employee deleted successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error deleting employee',
            error: error.message
        });
    }
};

// Get employees by department
export const getEmployeesByDepartment = async (req: Request, res: Response) => {
    try {
        const { departmentId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const employment_status = req.query.employment_status as string;

        const filter: any = { department_id: departmentId };
        if (employment_status) filter.employment_status = employment_status;

        const skip = (page - 1) * limit;

        const employees = await Employee.find(filter)
            .populate('user_id', 'username email first_name last_name')
            .populate('manager_id', 'username email first_name last_name')
            .populate('department_id', 'name description')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Employee.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: employees,
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
            message: 'Error fetching department employees',
            error: error.message
        });
    }
};

// Get employee statistics
export const getEmployeeStats = async (req: Request, res: Response) => {
    try {
        const department_id = req.query.department_id as string;
        const filter: any = {};
        if (department_id) filter.department_id = department_id;

        const statusStats = await Employee.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$employment_status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const positionStats = await Employee.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$position',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        const departmentStats = await Employee.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$department_id',
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalEmployees = await Employee.countDocuments(filter);

        const statsMap = {
            active: 0,
            inactive: 0,
            terminated: 0,
            on_leave: 0
        };

        statusStats.forEach(stat => {
            statsMap[stat._id as keyof typeof statsMap] = stat.count;
        });

        res.status(200).json({
            success: true,
            data: {
                totalEmployees,
                statusBreakdown: statsMap,
                positionBreakdown: positionStats,
                departmentBreakdown: departmentStats
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching employee statistics',
            error: error.message
        });
    }
}; 