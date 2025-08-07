"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployeeStats = exports.getEmployeesByDepartment = exports.deleteEmployee = exports.updateEmployee = exports.getEmployeeById = exports.getAllEmployees = exports.createEmployee = void 0;
const Employee_1 = require("../models/Employee");
const User_1 = require("../models/User");
const Department_1 = require("../models/Department");
// Create a new employee
const createEmployee = async (req, res) => {
    try {
        const { user_id, employee_code, job_profile, salary_id, manager_id, department_id, joining_date, employment_status, phone_number } = req.body;
        // Check if user exists
        const user = await User_1.User.findById(user_id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }
        // Check for unique employee_code
        const existing = await Employee_1.Employee.findOne({ employee_code });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Employee code already exists'
            });
        }
        const employee = new Employee_1.Employee({
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
        const populatedEmployee = await Employee_1.Employee.findById(savedEmployee._id)
            .populate('user_id', 'firstName lastName email role')
            .populate('manager_id', 'firstName lastName email role')
            .populate('department_id', 'name')
            .populate('salary_id');
        res.status(201).json({
            success: true,
            data: populatedEmployee,
            message: 'Employee created successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating employee',
            error: error.message
        });
    }
};
exports.createEmployee = createEmployee;
// Get all employees with pagination and filtering
const getAllEmployees = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const employment_status = req.query.employment_status;
        const search = req.query.search;
        const filter = {};
        if (employment_status)
            filter.employment_status = employment_status;
        if (search) {
            filter.$or = [
                { employee_code: { $regex: search, $options: 'i' } },
                { job_profile: { $regex: search, $options: 'i' } }
            ];
        }
        const skip = (page - 1) * limit;
        const employees = await Employee_1.Employee.find(filter)
            .populate('user_id', 'firstName lastName email role')
            .populate('manager_id', 'firstName lastName email role')
            .populate('salary_id')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await Employee_1.Employee.countDocuments(filter);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching employees',
            error: error.message
        });
    }
};
exports.getAllEmployees = getAllEmployees;
// Get employee by ID
const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee_1.Employee.findById(id)
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching employee',
            error: error.message
        });
    }
};
exports.getEmployeeById = getEmployeeById;
// Update employee
const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // If employee_code is being updated, check for uniqueness
        if (updateData.employee_code) {
            const existing = await Employee_1.Employee.findOne({
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
        const employee = await Employee_1.Employee.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating employee',
            error: error.message
        });
    }
};
exports.updateEmployee = updateEmployee;
// Delete employee
const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee_1.Employee.findByIdAndDelete(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting employee',
            error: error.message
        });
    }
};
exports.deleteEmployee = deleteEmployee;
// Get employees by department
const getEmployeesByDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const employment_status = req.query.employment_status;
        const filter = { department_id: departmentId };
        if (employment_status)
            filter.employment_status = employment_status;
        const skip = (page - 1) * limit;
        const employees = await Employee_1.Employee.find(filter)
            .populate('user_id', 'username email firstName lastName ')
            .populate('manager_id', 'username email first_name last_name')
            .populate('department_id', 'name description')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await Employee_1.Employee.countDocuments(filter);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching department employees',
            error: error.message
        });
    }
};
exports.getEmployeesByDepartment = getEmployeesByDepartment;
// Get employee statistics
const getEmployeeStats = async (req, res) => {
    try {
        const department_id = req.query.department_id;
        const filter = {};
        if (department_id)
            filter.department_id = department_id;
        // Fetch all stats concurrently for better performance
        const [statusStats, positionStats, departmentStats, totalEmployees, totalDepartments // <<<-- New variable to hold the department count
        ] = await Promise.all([
            Employee_1.Employee.aggregate([
                { $match: filter },
                { $group: { _id: '$employment_status', count: { $sum: 1 } } }
            ]),
            Employee_1.Employee.aggregate([
                { $match: filter },
                { $group: { _id: '$position', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]),
            Employee_1.Employee.aggregate([
                { $match: filter },
                { $group: { _id: '$department_id', count: { $sum: 1 } } }
            ]),
            Employee_1.Employee.countDocuments(filter),
            Department_1.Department.countDocuments() // <<<-- New promise to resolve, gets total departments
        ]);
        const statsMap = {
            active: 0,
            inactive: 0,
            terminated: 0,
            on_leave: 0
        };
        statusStats.forEach(stat => {
            const statusKey = stat._id.toLowerCase();
            if (statsMap.hasOwnProperty(statusKey)) {
                statsMap[statusKey] = stat.count;
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching employee statistics',
            error: error.message
        });
    }
};
exports.getEmployeeStats = getEmployeeStats;
