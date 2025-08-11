"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalariesByUser = exports.deleteSalary = exports.updateSalary = exports.getSalaryById = exports.getAllSalaries = exports.createSalary = void 0;
const Salary_1 = require("../models/Salary");
// Create Salary
const createSalary = async (req, res) => {
    try {
        const { user, basicSalary, bonus, deductions, month, year, status, } = req.body;
        const salary = new Salary_1.Salary({
            user,
            basicSalary,
            bonus,
            deductions,
            month,
            year,
            status,
        });
        await salary.save();
        res.status(201).json({
            success: true,
            data: salary,
            message: 'Salary record created successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating salary record',
            error: error.message
        });
    }
};
exports.createSalary = createSalary;
// Get All Salaries
const getAllSalaries = async (req, res) => {
    try {
        const salaries = await Salary_1.Salary.find().sort({ effective_date: -1 });
        res.status(200).json({
            success: true,
            data: salaries
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching salary records',
            error: error.message
        });
    }
};
exports.getAllSalaries = getAllSalaries;
// Get Salary by ID
const getSalaryById = async (req, res) => {
    try {
        const { id } = req.params;
        const salary = await Salary_1.Salary.findById(id);
        if (!salary) {
            return res.status(404).json({ success: false, message: 'Salary not found' });
        }
        res.status(200).json({
            success: true,
            data: salary
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching salary',
            error: error.message
        });
    }
};
exports.getSalaryById = getSalaryById;
// Update Salary
const updateSalary = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Salary_1.Salary.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Salary not found' });
        }
        res.status(200).json({
            success: true,
            data: updated,
            message: 'Salary updated successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating salary',
            error: error.message
        });
    }
};
exports.updateSalary = updateSalary;
// Delete Salary
const deleteSalary = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Salary_1.Salary.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Salary not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Salary deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting salary',
            error: error.message
        });
    }
};
exports.deleteSalary = deleteSalary;
// Get Salaries by User ID
const getSalariesByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const salaries = await Salary_1.Salary.find({ user: userId });
        res.status(200).json({
            success: true,
            data: salaries
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching salary records for user',
            error: error.message
        });
    }
};
exports.getSalariesByUser = getSalariesByUser;
//# sourceMappingURL=salaryController.js.map