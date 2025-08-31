import { Request, Response } from 'express';
import { Company } from '../models/Company';

export const createCompany = async (req: Request, res: Response) => {
    try {
        const { name, domain, address, phone, email, description, isActive } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required.' });
        }
        const existing = await Company.findOne({ name });
        if (existing) {
            return res.status(400).json({ message: 'Company already exists.' });
        }
        const company = new Company({ name, domain, address, phone, email, description, isActive });
        await company.save();
        res.status(201).json(company);
    } catch (err) {
        console.error('Error in createCompany:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const getCompanies = async (_req: Request, res: Response) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (err) {
        console.error('Error in getCompanies:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const getCompanyById = async (req: Request, res: Response) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found.' });
        }
        res.json(company);
    } catch (err) {
        console.error('Error in getCompanyById:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const updateCompany = async (req: Request, res: Response) => {
    try {
        const { name, domain, address, phone, email, description, isActive } = req.body;
        const company = await Company.findByIdAndUpdate(
            req.params.id,
            { name, domain, address, phone, email, description, isActive },
            { new: true, runValidators: true }
        );
        if (!company) {
            return res.status(404).json({ message: 'Company not found.' });
        }
        res.json(company);
    } catch (err) {
        console.error('Error in updateCompany:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const deleteCompany = async (req: Request, res: Response) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found.' });
        }
        res.json({ message: 'Company deleted successfully.' });
    } catch (err) {
        console.error('Error in deleteCompany:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};

