"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getManagers = exports.checkIfUserIsManager = exports.getManagersByDepartment = exports.deleteManager = exports.updateManager = exports.getManagerById = exports.getAllManagers = exports.createManager = void 0;
const Manager_1 = require("../models/Manager");
const User_1 = require("../models/User");
// Create manager
const createManager = async (req, res) => {
    try {
        const managerData = req.body;
        const manager = new Manager_1.Manager({
            ...managerData,
            email: req.body.email,
            phone_number: req.body.phone_number
        });
        const savedManager = await manager.save();
        const populatedManager = await Manager_1.Manager.findById(savedManager._id)
            .populate('user_id')
            .populate('department_id', 'name description');
        res.status(201).json({
            success: true,
            data: populatedManager,
            message: 'Manager created successfully'
        });
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'User is already a manager'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error creating manager',
            error: error.message
        });
    }
};
exports.createManager = createManager;
// Get all managers with pagination and filtering
const getAllManagers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const departmentId = req.query.department_id;
        const filter = {};
        if (departmentId)
            filter.department_id = departmentId;
        const skip = (page - 1) * limit;
        const managers = await Manager_1.Manager.find(filter)
            .populate('user_id')
            .populate('department_id', 'name description')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await Manager_1.Manager.countDocuments(filter);
        res.status(200).json({
            success: true,
            data: managers,
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
            message: 'Error fetching managers',
            error: error.message
        });
    }
};
exports.getAllManagers = getAllManagers;
// Get manager by ID
const getManagerById = async (req, res) => {
    try {
        const { id } = req.params;
        const manager = await Manager_1.Manager.findById(id)
            .populate('user_id')
            .populate('department_id', 'name description');
        if (!manager) {
            return res.status(404).json({
                success: false,
                message: 'Manager not found'
            });
        }
        res.status(200).json({
            success: true,
            data: manager
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching manager',
            error: error.message
        });
    }
};
exports.getManagerById = getManagerById;
// Update manager
const updateManager = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const manager = await Manager_1.Manager.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('user_id')
            .populate('department_id', 'name description');
        if (!manager) {
            return res.status(404).json({
                success: false,
                message: 'Manager not found'
            });
        }
        res.status(200).json({
            success: true,
            data: manager,
            message: 'Manager updated successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating manager',
            error: error.message
        });
    }
};
exports.updateManager = updateManager;
// Delete manager
const deleteManager = async (req, res) => {
    try {
        const { id } = req.params;
        const manager = await Manager_1.Manager.findByIdAndDelete(id);
        if (!manager) {
            return res.status(404).json({
                success: false,
                message: 'Manager not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Manager deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting manager',
            error: error.message
        });
    }
};
exports.deleteManager = deleteManager;
// Get managers by department
const getManagersByDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const managers = await Manager_1.Manager.find({ department_id: departmentId })
            .populate('user_id')
            .populate('department_id', 'name description')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await Manager_1.Manager.countDocuments({ department_id: departmentId });
        res.status(200).json({
            success: true,
            data: managers,
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
            message: 'Error fetching managers by department',
            error: error.message
        });
    }
};
exports.getManagersByDepartment = getManagersByDepartment;
// Check if user is a manager
const checkIfUserIsManager = async (req, res) => {
    try {
        const { userId } = req.params;
        const manager = await Manager_1.Manager.findOne({ user_id: userId })
            .populate('user_id')
            .populate('department_id', 'name description');
        res.status(200).json({
            success: true,
            data: {
                isManager: !!manager,
                managerInfo: manager
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error checking manager status',
            error: error.message
        });
    }
};
exports.checkIfUserIsManager = checkIfUserIsManager;
// Get all managers
const getManagers = async (req, res) => {
    try {
        const managers = await User_1.User.find({ role: 'manager' })
            .select('_id firstName lastName email position department')
            .populate('department', 'name');
        console.log('Raw manager data:', managers); // ✅ Debug log here
        res.status(200).json({
            success: true,
            data: managers,
            message: 'Managers fetched successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching managers',
            error: error.message
        });
    }
};
exports.getManagers = getManagers;
//# sourceMappingURL=managerController.js.map