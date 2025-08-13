import { Request, Response } from 'express';
import { Employee } from '../models/Employee';
import { User } from '../models/User';
import { Department } from '../models/Department';
import { LeaveRequest } from '../models/LeaveRequest';

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
            employment_status,
            phone_number
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
            employment_status,
            phone_number
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
            .populate('user_id', 'username email firstName lastName ')
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

        // Fetch all stats concurrently for better performance
        const [
            statusStats,
            positionStats,
            departmentStats,
            totalEmployees,
            totalDepartments // <<<-- New variable to hold the department count
        ] = await Promise.all([
            Employee.aggregate([
                { $match: filter },
                { $group: { _id: '$employment_status', count: { $sum: 1 } } }
            ]),
            Employee.aggregate([
                { $match: filter },
                { $group: { _id: '$job_profile', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]),
            Employee.aggregate([
                { $match: filter },
                { $group: { _id: '$department_id', count: { $sum: 1 } } }
            ]),
            Employee.countDocuments(filter),
            Department.countDocuments() // <<<-- New promise to resolve, gets total departments
        ]);

        const statsMap = {
            active: 0,
            resigned: 0,
            terminated: 0
        };

        statusStats.forEach(stat => {
            const statusKey = stat._id.toLowerCase();
            if (statsMap.hasOwnProperty(statusKey)) {
                statsMap[statusKey as keyof typeof statsMap] = stat.count;
            }
        });

        res.status(200).json({
            success: true,
            data: {
                totalEmployees,
                totalDepartments, // <<<-- Include totalDepartments in the response
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

// Get employee registration trends for dashboard charts
export const getEmployeeRegistrationTrends = async (req: Request, res: Response) => {
    try {
        const days = parseInt(req.query.days as string) || 30; // Default to 30 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Get daily registration counts
        const registrationTrends = await Employee.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    newRegistrations: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Get cumulative total employees for each day
        const cumulativeTrends = await Employee.aggregate([
            {
                $match: {
                    createdAt: { $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Generate dates array and fill in missing dates
        const dates: string[] = [];
        const newRegistrations: number[] = [];
        const totalEmployees: number[] = [];

        let currentDate = new Date(startDate);
        let cumulativeCount = 0;

        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split('T')[0];
            dates.push(new Date(dateStr).toISOString());

            // Find registration count for this date
            const registrationData = registrationTrends.find(item => item._id === dateStr);
            const dailyCount = registrationData ? registrationData.newRegistrations : 0;
            newRegistrations.push(dailyCount);

            // Calculate cumulative count
            cumulativeCount += dailyCount;
            totalEmployees.push(cumulativeCount);

            currentDate.setDate(currentDate.getDate() + 1);
        }

        res.status(200).json({
            success: true,
            data: {
                dates,
                newRegistrations,
                totalEmployees
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching registration trends',
            error: error.message
        });
    }
};

// Get active and leave employee trends for dashboard charts
export const getActiveLeaveTrends = async (req: Request, res: Response) => {
    try {
        const days = parseInt(req.query.days as string) || 30; // Default to 30 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Get total active employees (those with 'Active' employment status)
        const totalActiveEmployees = await Employee.countDocuments({ employment_status: 'Active' });

        // Get approved leave requests that overlap with each day
        const leaveRequests = await LeaveRequest.find({
            status: 'approved',
            $or: [
                { start_date: { $lte: endDate, $gte: startDate } },
                { end_date: { $gte: startDate, $lte: endDate } },
                { start_date: { $lte: startDate }, end_date: { $gte: endDate } }
            ]
        }).populate('employee_id', 'user_id');

        // Generate dates array and calculate daily active/leave counts
        const dates: string[] = [];
        const activeEmployees: number[] = [];
        const onLeave: number[] = [];

        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split('T')[0];
            dates.push(new Date(dateStr).toISOString());

            // Count employees on leave for this specific date
            const employeesOnLeave = leaveRequests.filter(leave => {
                const leaveStart = new Date(leave.start_date);
                const leaveEnd = new Date(leave.end_date);
                return currentDate >= leaveStart && currentDate <= leaveEnd;
            }).length;

            // Active employees = total active - employees on leave
            const dailyActiveCount = Math.max(0, totalActiveEmployees - employeesOnLeave);

            activeEmployees.push(dailyActiveCount);
            onLeave.push(employeesOnLeave);

            currentDate.setDate(currentDate.getDate() + 1);
        }

        res.status(200).json({
            success: true,
            data: {
                dates,
                activeEmployees,
                onLeave
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching active/leave trends',
            error: error.message
        });
    }
};