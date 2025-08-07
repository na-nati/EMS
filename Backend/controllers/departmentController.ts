import { Request, Response } from 'express';
import { Department } from '../models/Department';
import { Employee } from '../models/Employee';
import { Manager } from '../models/Manager';
import { User } from '../models/User';

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
        console.error('Error in createDepartment:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};

/**
 * Get all Departments with their active employee counts and manager names.
 * This function uses a Mongoose aggregation pipeline for optimal performance,
 * executing only a single query to the database.
 */
export const getDepartments = async (req: Request, res: Response) => {
    try {
        const departments = await Department.aggregate([
            // Stage 1: Join with the 'employees' collection to find all active employees for each department.
            {
                $lookup: {
                    from: 'employees', // The actual collection name in MongoDB for employees
                    let: { dept_id: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$department_id', '$$dept_id'] },
                                        { $eq: ['$employment_status', 'Active'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'active_employees' // Temporary field with the matched employee documents
                }
            },
            // Stage 2: Join with the 'managers' collection to find the manager.
            {
                $lookup: {
                    from: 'managers', // The actual collection name for managers
                    localField: '_id',
                    foreignField: 'department_id',
                    as: 'manager_info'
                }
            },
            // Stage 3: Deconstruct the manager_info array. Turns the array (of 0 or 1) into an object.
            {
                $unwind: {
                    path: '$manager_info',
                    preserveNullAndEmptyArrays: true // IMPORTANT: Keep departments even if they have no manager
                }
            },
            // Stage 4: Join with the 'users' collection to get the manager's name from their user_id.
            {
                $lookup: {
                    from: 'users', // The actual collection name for users
                    localField: 'manager_info.user_id',
                    foreignField: '_id',
                    as: 'manager_user_details'
                }
            },
            // Stage 5: Deconstruct the manager_user_details array.
            {
                $unwind: {
                    path: '$manager_user_details',
                    preserveNullAndEmptyArrays: true // IMPORTANT: Keep departments even if the manager's user is not found
                }
            },
            // Stage 6: Project the final shape of our data.
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    
                    // Create the employeeCount field by getting the size of the array from Stage 1.
                    employeeCount: { $size: '$active_employees' },
                    
                    // Create the manager field by combining first and last names.
                    manager: {
                        $cond: {
                           if: '$manager_user_details', // Check if a manager user was found
                           then: { $concat: ['$manager_user_details.firstName', ' ', '$manager_user_details.lastName'] },
                           else: null // Use null if no manager is assigned or found
                        }
                    }
                }
            }
        ]);

        res.json(departments);

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
        console.error('Error in getDepartmentById:', err);
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
        console.error('Error in updateDepartment:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Delete Department
export const deleteDepartment = async (req: Request, res: Response) => {
    try {
        // You might want to add logic here to handle what happens to employees
        // in a department that is being deleted. For example, reassign them or deactivate them.
        const department = await Department.findByIdAndDelete(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found.' });
        }
        res.json({ message: 'Department deleted successfully.' });
    } catch (err) {
        console.error('Error in deleteDepartment:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};
