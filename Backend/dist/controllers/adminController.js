"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdmin = exports.updateAdmin = exports.getAdminById = exports.getAdmins = exports.createAdmin = void 0;
const Admin_1 = require("../models/Admin");
const createAdmin = async (req, res) => {
    try {
        const { user_id, company_id, role, permissions } = req.body;
        if (!user_id) {
            return res.status(400).json({ message: 'user_id is required.' });
        }
        const admin = new Admin_1.Admin({ user_id, company_id, role, permissions });
        await admin.save();
        res.status(201).json(admin);
    }
    catch (err) {
        console.error('Error in createAdmin:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.createAdmin = createAdmin;
const getAdmins = async (_req, res) => {
    try {
        const admins = await Admin_1.Admin.find().populate('user_id').populate('company_id');
        res.json(admins);
    }
    catch (err) {
        console.error('Error in getAdmins:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.getAdmins = getAdmins;
const getAdminById = async (req, res) => {
    try {
        const admin = await Admin_1.Admin.findById(req.params.id).populate('user_id').populate('company_id');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found.' });
        }
        res.json(admin);
    }
    catch (err) {
        console.error('Error in getAdminById:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.getAdminById = getAdminById;
const updateAdmin = async (req, res) => {
    try {
        const { user_id, company_id, role, permissions } = req.body;
        const admin = await Admin_1.Admin.findByIdAndUpdate(req.params.id, { user_id, company_id, role, permissions }, { new: true, runValidators: true });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found.' });
        }
        res.json(admin);
    }
    catch (err) {
        console.error('Error in updateAdmin:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.updateAdmin = updateAdmin;
const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin_1.Admin.findByIdAndDelete(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found.' });
        }
        res.json({ message: 'Admin deleted successfully.' });
    }
    catch (err) {
        console.error('Error in deleteAdmin:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.deleteAdmin = deleteAdmin;
//# sourceMappingURL=adminController.js.map