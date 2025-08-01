import { Request, Response } from 'express';
import { Salary } from '../models/Salary';

// Create Salary
export const createSalary = async (req: Request, res: Response) => {
    try {
        const {
            user,
            basicSalary,
            bonus,
            deductions,
            month,
            year,
            status,
            department
        } = req.body;

        const salary = new Salary({
            user,
            basicSalary,
            bonus,
            deductions,
            month,
            year,
            status,
            department
            // netSalary will be auto-calculated by pre('save') middleware
        });

        await salary.save();

        res.status(201).json({
            success: true,
            data: salary,
            message: 'Salary record created successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error creating salary record',
            error: error.message
        });
    }
};


// Get All Salaries
export const getAllSalaries = async (req: Request, res: Response) => {
    try {
        const salaries = await Salary.find().sort({ effective_date: -1 });

        res.status(200).json({
            success: true,
            data: salaries
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching salary records',
            error: error.message
        });
    }
};

// Get Salary by ID
export const getSalaryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const salary = await Salary.findById(id);

        if (!salary) {
            return res.status(404).json({ success: false, message: 'Salary not found' });
        }

        res.status(200).json({
            success: true,
            data: salary
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching salary',
            error: error.message
        });
    }
};

// Update Salary
export const updateSalary = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updated = await Salary.findByIdAndUpdate(id, req.body, {
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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error updating salary',
            error: error.message
        });
    }
};

// Delete Salary
export const deleteSalary = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Salary.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Salary not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Salary deleted successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error deleting salary',
            error: error.message
        });
    }
};
