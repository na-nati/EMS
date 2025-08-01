"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDepartment = exports.updateDepartment = exports.getDepartmentById = exports.getDepartments = exports.createDepartment = void 0;
const Department_1 = require("../models/Department");
const Employee_1 = require("../models/Employee");
// Create Department
const createDepartment = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required.' });
        }
        const existing = await Department_1.Department.findOne({ name });
        if (existing) {
            return res.status(400).json({ message: 'Department already exists.' });
        }
        const department = new Department_1.Department({ name, description });
        await department.save();
        res.status(201).json(department);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.createDepartment = createDepartment;
// Get all Departments with employee counts
const getDepartments = async (req, res) => {
    try {
        const departments = await Department_1.Department.find();
        // Get employee counts for each department
        const departmentsWithCounts = await Promise.all(departments.map(async (dept) => {
            const employeeCount = await Employee_1.Employee.countDocuments({
                department_id: dept._id,
                employment_status: 'Active'
            });
            console.log(`Department ${dept.name}: ${employeeCount} employees`);
            return {
                ...dept.toObject(),
                employeeCount
            };
        }));
        res.json(departmentsWithCounts);
    }
    catch (err) {
        console.error('Error in getDepartments:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.getDepartments = getDepartments;
// Get Department by ID
const getDepartmentById = async (req, res) => {
    try {
        const department = await Department_1.Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found.' });
        }
        res.json(department);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.getDepartmentById = getDepartmentById;
// Update Department
const updateDepartment = async (req, res) => {
    try {
        const { name, description } = req.body;
        const department = await Department_1.Department.findByIdAndUpdate(req.params.id, { name, description }, { new: true, runValidators: true });
        if (!department) {
            return res.status(404).json({ message: 'Department not found.' });
        }
        res.json(department);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.updateDepartment = updateDepartment;
// Delete Department
const deleteDepartment = async (req, res) => {
    try {
        const department = await Department_1.Department.findByIdAndDelete(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found.' });
        }
        res.json({ message: 'Department deleted.' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.deleteDepartment = deleteDepartment;
