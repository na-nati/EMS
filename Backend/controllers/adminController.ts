import { Request, Response } from 'express';
import { Admin } from '../models/Admin';

export const createAdmin = async (req: Request, res: Response) => {
    try {
        const { user_id, company_id, role, permissions } = req.body;
        if (!user_id) {
            return res.status(400).json({ message: 'user_id is required.' });
        }
        const admin = new Admin({ user_id, company_id, role, permissions });
        await admin.save();
        res.status(201).json(admin);
    } catch (err) {
        console.error('Error in createAdmin:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const getAdmins = async (_req: Request, res: Response) => {
    try {
        const admins = await Admin.find().populate('user_id').populate('company_id');
        res.json(admins);
    } catch (err) {
        console.error('Error in getAdmins:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const getAdminById = async (req: Request, res: Response) => {
    try {
        const admin = await Admin.findById(req.params.id).populate('user_id').populate('company_id');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found.' });
        }
        res.json(admin);
    } catch (err) {
        console.error('Error in getAdminById:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const updateAdmin = async (req: Request, res: Response) => {
    try {
        const { user_id, company_id, role, permissions } = req.body;
        const admin = await Admin.findByIdAndUpdate(
            req.params.id,
            { user_id, company_id, role, permissions },
            { new: true, runValidators: true }
        );
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found.' });
        }
        res.json(admin);
    } catch (err) {
        console.error('Error in updateAdmin:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const deleteAdmin = async (req: Request, res: Response) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found.' });
        }
        res.json({ message: 'Admin deleted successfully.' });
    } catch (err) {
        console.error('Error in deleteAdmin:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};

