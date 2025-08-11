"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentRequest = exports.updateDocumentRequest = exports.createDocumentRequest = exports.getAllDocumentRequests = exports.deleteDocument = exports.updateDocument = exports.createDocument = exports.getDocument = exports.getAllDocuments = void 0;
const Document_1 = require("../models/Document");
const DocumentRequest_1 = require("../models/DocumentRequest");
const Employee_1 = require("../models/Employee");
const User_1 = require("../models/User");
// Get all documents with filtering
const getAllDocuments = async (req, res) => {
    try {
        const { search, status, employee_id, department } = req.query;
        const user = req.user; // From auth middleware
        let query = {};
        // Role-based filtering
        if (user.role === 'employee') {
            // Employees can only see their own documents
            const employee = await Employee_1.Employee.findOne({ user_id: user.userId });
            if (!employee) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            query.employee_id = employee._id;
        }
        else if (user.role === 'manager') {
            // Managers can see documents from their department
            const userWithDept = await User_1.User.findById(user.userId).populate('department');
            if (userWithDept?.department) {
                const employeesInDept = await Employee_1.Employee.find({
                    department: userWithDept.department._id
                }).select('_id');
                query.employee_id = { $in: employeesInDept.map(emp => emp._id) };
            }
        }
        // HR and Super Admin can see all documents
        // Search filter
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { doc_type: { $regex: search, $options: 'i' } }
            ];
        }
        // Status filter
        if (status && status !== 'All') {
            query.status = status;
        }
        // Employee filter
        if (employee_id) {
            query.employee_id = employee_id;
        }
        const documents = await Document_1.EmployeeDocument.find(query)
            .populate('employee_id', 'employee_code')
            .populate('uploaded_by', 'firstName lastName')
            .sort({ createdAt: -1 });
        // Map to plain objects and type as IDocument[]
        const result = documents.map(doc => ({
            employee_id: doc.employee_id,
            doc_type: doc.doc_type,
            file_url: doc.file_url,
            uploaded_by: doc.uploaded_by,
            uploaded_at: doc.uploaded_at,
            status: doc.status,
        }));
        res.json(result);
    }
    catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllDocuments = getAllDocuments;
// Get single document
const getDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const document = await Document_1.EmployeeDocument.findById(id)
            .populate('employee_id', 'employee_code')
            .populate('uploaded_by', 'firstName lastName');
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        // Check permissions
        if (user.role === 'employee') {
            const employee = await Employee_1.Employee.findOne({ user_id: user.userId });
            if (!employee ||
                document.employee_id.toString() !== employee._id.toString()) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }
        res.json(document);
    }
    catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getDocument = getDocument;
// Create new document
const createDocument = async (req, res) => {
    try {
        const { name, doc_type, employee_id, file_url } = req.body;
        const user = req.user;
        // Check permissions
        if (!['hr', 'super_admin'].includes(user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        if (!name || !doc_type || !employee_id || !file_url) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Validate employee exists
        const employee = await Employee_1.Employee.findById(employee_id);
        if (!employee) {
            return res.status(400).json({ message: 'Employee not found' });
        }
        const document = new Document_1.EmployeeDocument({
            name,
            doc_type,
            employee_id,
            file_url,
            uploaded_by: user.userId,
            uploaded_at: new Date()
        });
        await document.save();
        const populatedDocument = await Document_1.EmployeeDocument.findById(document._id)
            .populate('employee_id', 'employee_code')
            .populate('uploaded_by', 'firstName lastName');
        res.status(201).json(populatedDocument);
    }
    catch (error) {
        console.error('Error creating document:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createDocument = createDocument;
// Update document
const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, doc_type, employee_id, file_url, status } = req.body;
        const user = req.user;
        // Check permissions
        if (!['hr', 'super_admin'].includes(user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const document = await Document_1.EmployeeDocument.findById(id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        // Update fields
        if (name)
            document.doc_type = name;
        if (doc_type)
            document.doc_type = doc_type;
        if (employee_id) {
            const employee = await Employee_1.Employee.findById(employee_id);
            if (!employee) {
                return res.status(400).json({ message: 'Employee not found' });
            }
            document.employee_id = employee_id;
        }
        if (file_url)
            document.file_url = file_url;
        if (status)
            document.status = status;
        await document.save();
        const updatedDocument = await Document_1.EmployeeDocument.findById(id)
            .populate('employee_id', 'employee_code')
            .populate('uploaded_by', 'firstName lastName');
        res.json(updatedDocument);
    }
    catch (error) {
        console.error('Error updating document:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateDocument = updateDocument;
// Delete document
const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        // Check permissions
        if (!['hr', 'super_admin'].includes(user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const document = await Document_1.EmployeeDocument.findByIdAndDelete(id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.json({ message: 'Document deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteDocument = deleteDocument;
// Get all document requests
const getAllDocumentRequests = async (req, res) => {
    try {
        const { search, status } = req.query;
        const user = req.user;
        let query = {};
        // Role-based filtering
        if (user.role === 'employee') {
            // Employees can only see their own requests
            const employee = await Employee_1.Employee.findOne({ user_id: user.userId });
            if (!employee) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            query.employee_id = employee._id;
        }
        else if (user.role === 'manager') {
            // Managers can see requests from their department
            const userWithDept = await User_1.User.findById(user.userId).populate('department');
            if (userWithDept?.department) {
                const employeesInDept = await Employee_1.Employee.find({
                    department: userWithDept.department._id
                }).select('_id');
                query.employee_id = { $in: employeesInDept.map(emp => emp._id) };
            }
        }
        // HR and Super Admin can see all requests
        // Search filter
        if (search) {
            query.$or = [
                { requested_doc_type: { $regex: search, $options: 'i' } },
                { request_details: { $regex: search, $options: 'i' } }
            ];
        }
        // Status filter
        if (status && status !== 'All') {
            query.status = status;
        }
        const requests = await DocumentRequest_1.DocumentRequest.find(query)
            .populate('employee_id', 'employee_code')
            .populate('processed_by', 'firstName lastName')
            .populate('fulfilled_document_id', 'name file_url')
            .sort({ createdAt: -1 });
        res.json(requests);
    }
    catch (error) {
        console.error('Error fetching document requests:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllDocumentRequests = getAllDocumentRequests;
// Create document request
const createDocumentRequest = async (req, res) => {
    try {
        const { requested_doc_type, request_details } = req.body;
        const user = req.user;
        // Only employees can create requests
        if (user.role !== 'employee') {
            return res.status(403).json({ message: 'Only employees can create document requests' });
        }
        if (!requested_doc_type) {
            return res.status(400).json({ message: 'Document type is required' });
        }
        // Find employee record
        const employee = await Employee_1.Employee.findOne({ user_id: user.userId });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        const request = new DocumentRequest_1.DocumentRequest({
            employee_id: employee._id,
            requested_doc_type,
            request_details: request_details || '',
            request_date: new Date(),
            status: 'Pending'
        });
        await request.save();
        const populatedRequest = await DocumentRequest_1.DocumentRequest.findById(request._id)
            .populate('employee_id', 'employee_code')
            .populate('processed_by', 'firstName lastName')
            .populate('fulfilled_document_id', 'name file_url');
        res.status(201).json(populatedRequest);
    }
    catch (error) {
        console.error('Error creating document request:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createDocumentRequest = createDocumentRequest;
// Update document request status
const updateDocumentRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, hr_notes, fulfilled_document_id } = req.body;
        const user = req.user;
        // Check permissions
        if (!['hr', 'super_admin'].includes(user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const request = await DocumentRequest_1.DocumentRequest.findById(id);
        if (!request) {
            return res.status(404).json({ message: 'Document request not found' });
        }
        // Update fields
        if (status)
            request.status = status;
        if (hr_notes !== undefined)
            request.hr_notes = hr_notes;
        if (fulfilled_document_id)
            request.fulfilled_document_id = fulfilled_document_id;
        // Set processed_by and processed_date when status changes
        if (status && status !== 'Pending') {
            request.processed_by = user.userId;
            request.processed_date = new Date();
        }
        await request.save();
        const updatedRequest = await DocumentRequest_1.DocumentRequest.findById(id)
            .populate('employee_id', 'employee_code')
            .populate('processed_by', 'firstName lastName')
            .populate('fulfilled_document_id', 'name file_url');
        res.json(updatedRequest);
    }
    catch (error) {
        console.error('Error updating document request:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateDocumentRequest = updateDocumentRequest;
// Get single document request
const getDocumentRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const request = await DocumentRequest_1.DocumentRequest.findById(id)
            .populate('employee_id', 'employee_code')
            .populate('processed_by', 'firstName lastName')
            .populate('fulfilled_document_id', 'name file_url');
        if (!request) {
            return res.status(404).json({ message: 'Document request not found' });
        }
        // Check permissions
        if (user.role === 'employee') {
            const employee = await Employee_1.Employee.findOne({ user_id: user.userId });
            if (!employee || request.employee_id.toString() !== employee._id.toString()) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }
        res.json(request);
    }
    catch (error) {
        console.error('Error fetching document request:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getDocumentRequest = getDocumentRequest;
//# sourceMappingURL=documentController.js.map