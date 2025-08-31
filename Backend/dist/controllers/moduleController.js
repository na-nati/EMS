"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteModule = exports.updateModule = exports.getModuleById = exports.getModules = exports.createModule = void 0;
const Module_1 = require("../models/Module");
const createModule = async (req, res) => {
    try {
        const { name, key, description, enabled, company_id } = req.body;
        if (!name || !key) {
            return res.status(400).json({ message: 'name and key are required.' });
        }
        const existing = await Module_1.Module.findOne({ key });
        if (existing) {
            return res.status(400).json({ message: 'Module key already exists.' });
        }
        const moduleDoc = new Module_1.Module({ name, key, description, enabled, company_id });
        await moduleDoc.save();
        res.status(201).json(moduleDoc);
    }
    catch (err) {
        console.error('Error in createModule:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.createModule = createModule;
const getModules = async (_req, res) => {
    try {
        const modules = await Module_1.Module.find();
        res.json(modules);
    }
    catch (err) {
        console.error('Error in getModules:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.getModules = getModules;
const getModuleById = async (req, res) => {
    try {
        const moduleDoc = await Module_1.Module.findById(req.params.id);
        if (!moduleDoc) {
            return res.status(404).json({ message: 'Module not found.' });
        }
        res.json(moduleDoc);
    }
    catch (err) {
        console.error('Error in getModuleById:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.getModuleById = getModuleById;
const updateModule = async (req, res) => {
    try {
        const { name, key, description, enabled, company_id } = req.body;
        const moduleDoc = await Module_1.Module.findByIdAndUpdate(req.params.id, { name, key, description, enabled, company_id }, { new: true, runValidators: true });
        if (!moduleDoc) {
            return res.status(404).json({ message: 'Module not found.' });
        }
        res.json(moduleDoc);
    }
    catch (err) {
        console.error('Error in updateModule:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.updateModule = updateModule;
const deleteModule = async (req, res) => {
    try {
        const moduleDoc = await Module_1.Module.findByIdAndDelete(req.params.id);
        if (!moduleDoc) {
            return res.status(404).json({ message: 'Module not found.' });
        }
        res.json({ message: 'Module deleted successfully.' });
    }
    catch (err) {
        console.error('Error in deleteModule:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.deleteModule = deleteModule;
//# sourceMappingURL=moduleController.js.map