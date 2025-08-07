import { Request, Response } from 'express';
import { Manager, IManager } from '../models/Manager';
import { User } from '../models/User';

// Create manager
export const createManager = async (req: Request, res: Response) => {
    try {
        const managerData = req.body;
        const manager = new Manager({
            ...managerData,
            email: req.body.email,
            phone_number: req.body.phone_number
        });
        const savedManager = await manager.save();

        const populatedManager = await Manager.findById(savedManager._id)
            .populate('user_id')
            .populate('department_id', 'name description');

        res.status(201).json({
            success: true,
            data: populatedManager,
            message: 'Manager created successfully'
        });
    } catch (error: any) {
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

// Get all managers with pagination and filtering
export const getAllManagers = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const departmentId = req.query.department_id as string;

        const filter: any = {};
        if (departmentId) filter.department_id = departmentId;

        const skip = (page - 1) * limit;

        const managers = await Manager.find(filter)
            .populate('user_id')
            .populate('department_id', 'name description')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Manager.countDocuments(filter);

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching managers',
            error: error.message
        });
    }
};

// Get manager by ID
export const getManagerById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const manager = await Manager.findById(id)
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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching manager',
            error: error.message
        });
    }
};

// Update manager
export const updateManager = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const manager = await Manager.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('user_id')
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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error updating manager',
            error: error.message
        });
    }
};

// Delete manager
export const deleteManager = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const manager = await Manager.findByIdAndDelete(id);

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error deleting manager',
            error: error.message
        });
    }
};

// Get managers by department
export const getManagersByDepartment = async (req: Request, res: Response) => {
    try {
        const { departmentId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const skip = (page - 1) * limit;

        const managers = await Manager.find({ department_id: departmentId })
            .populate('user_id')
            .populate('department_id', 'name description')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Manager.countDocuments({ department_id: departmentId });

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching managers by department',
            error: error.message
        });
    }
};

// Check if user is a manager
export const checkIfUserIsManager = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const manager = await Manager.findOne({ user_id: userId })
            .populate('user_id')
            .populate('department_id', 'name description');

        res.status(200).json({
            success: true,
            data: {
                isManager: !!manager,
                managerInfo: manager
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error checking manager status',
            error: error.message
        });
    }
}; 

// Get all managers
export const getManagers = async (req: Request, res: Response) => {
  try {
    const managers = await User.find({ role: 'manager' })
      .select('_id firstName lastName email position department')
      .populate('department', 'name');

    console.log('Raw manager data:', managers); // ✅ Debug log here

    res.status(200).json({
      success: true,
      data: managers,
      message: 'Managers fetched successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching managers',
      error: error.message
    });
  }
};
