"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCompany = exports.updateCompany = exports.getCompanyById = exports.getCompanies = exports.createCompany = void 0;
const Company_1 = require("../models/Company");
const createCompany = async (req, res) => {
    try {
        const { name, domain, address, phone, email, description, isActive } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required.' });
        }
        const existing = await Company_1.Company.findOne({ name });
        if (existing) {
            return res.status(400).json({ message: 'Company already exists.' });
        }
        const company = new Company_1.Company({ name, domain, address, phone, email, description, isActive });
        await company.save();
        res.status(201).json(company);
    }
    catch (err) {
        console.error('Error in createCompany:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.createCompany = createCompany;
const getCompanies = async (_req, res) => {
    try {
        const companies = await Company_1.Company.find();
        res.json(companies);
    }
    catch (err) {
        console.error('Error in getCompanies:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.getCompanies = getCompanies;
const getCompanyById = async (req, res) => {
    try {
        const company = await Company_1.Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found.' });
        }
        res.json(company);
    }
    catch (err) {
        console.error('Error in getCompanyById:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.getCompanyById = getCompanyById;
const updateCompany = async (req, res) => {
    try {
        const { name, domain, address, phone, email, description, isActive } = req.body;
        const company = await Company_1.Company.findByIdAndUpdate(req.params.id, { name, domain, address, phone, email, description, isActive }, { new: true, runValidators: true });
        if (!company) {
            return res.status(404).json({ message: 'Company not found.' });
        }
        res.json(company);
    }
    catch (err) {
        console.error('Error in updateCompany:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.updateCompany = updateCompany;
const deleteCompany = async (req, res) => {
    try {
        const company = await Company_1.Company.findByIdAndDelete(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found.' });
        }
        res.json({ message: 'Company deleted successfully.' });
    }
    catch (err) {
        console.error('Error in deleteCompany:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.deleteCompany = deleteCompany;
//# sourceMappingURL=companyController.js.map