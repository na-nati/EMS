import { Request, Response } from 'express';
import { Department } from '../models/Department';
import { Employee } from '../models/Employee';

// Create Department
export const createDepartment = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required.' });
        }
        const existing = await Department.findOne({ name });
        if (existing) {
            return res.status(400).json({ message: 'Department already exists.' });
        }
        const department = new Department({ name, description });
        await department.save();
        res.status(201).json(department);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get all Departments with employee counts
export const getDepartments = async (req: Request, res: Response) => {
    try {
        const departments = await Department.find();

        // Get employee counts for each department
        const departmentsWithCounts = await Promise.all(
            departments.map(async (dept) => {
                const employeeCount = await Employee.countDocuments({
                    department_id: dept._id,
                    employment_status: 'Active'
                });

                console.log(`Department ${dept.name}: ${employeeCount} employees`);

                return {
                    ...dept.toObject(),
                    employeeCount
                };
            })
        );

        res.json(departmentsWithCounts);
    } catch (err) {
        console.error('Error in getDepartments:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get Department by ID
export const getDepartmentById = async (req: Request, res: Response) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found.' });
        }
        res.json(department);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// Update Department
export const updateDepartment = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const department = await Department.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true, runValidators: true }
        );
        if (!department) {
            return res.status(404).json({ message: 'Department not found.' });
        }
        res.json(department);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// Delete Department
export const deleteDepartment = async (req: Request, res: Response) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found.' });
        }
        res.json({ message: 'Department deleted.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
}; 