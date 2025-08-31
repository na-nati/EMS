import { Request, Response } from 'express';
import { Module } from '../models/Module';

export const createModule = async (req: Request, res: Response) => {
    try {
        const { name, key, description, enabled, company_id } = req.body;
        if (!name || !key) {
            return res.status(400).json({ message: 'name and key are required.' });
        }
        const existing = await Module.findOne({ key });
        if (existing) {
            return res.status(400).json({ message: 'Module key already exists.' });
        }
        const moduleDoc = new Module({ name, key, description, enabled, company_id });
        await moduleDoc.save();
        res.status(201).json(moduleDoc);
    } catch (err) {
        console.error('Error in createModule:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const getModules = async (_req: Request, res: Response) => {
    try {
        const modules = await Module.find();
        res.json(modules);
    } catch (err) {
        console.error('Error in getModules:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const getModuleById = async (req: Request, res: Response) => {
    try {
        const moduleDoc = await Module.findById(req.params.id);
        if (!moduleDoc) {
            return res.status(404).json({ message: 'Module not found.' });
        }
        res.json(moduleDoc);
    } catch (err) {
        console.error('Error in getModuleById:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const updateModule = async (req: Request, res: Response) => {
    try {
        const { name, key, description, enabled, company_id } = req.body;
        const moduleDoc = await Module.findByIdAndUpdate(
            req.params.id,
            { name, key, description, enabled, company_id },
            { new: true, runValidators: true }
        );
        if (!moduleDoc) {
            return res.status(404).json({ message: 'Module not found.' });
        }
        res.json(moduleDoc);
    } catch (err) {
        console.error('Error in updateModule:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const deleteModule = async (req: Request, res: Response) => {
    try {
        const moduleDoc = await Module.findByIdAndDelete(req.params.id);
        if (!moduleDoc) {
            return res.status(404).json({ message: 'Module not found.' });
        }
        res.json({ message: 'Module deleted successfully.' });
    } catch (err) {
        console.error('Error in deleteModule:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};

