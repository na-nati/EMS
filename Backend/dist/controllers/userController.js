"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.updateProfilePicture = exports.getAllUsers = exports.loginuser = exports.registeruser = void 0;
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Department_1 = require("../models/Department"); // Import Department model
const mongoose_1 = __importDefault(require("mongoose")); // Import mongoose for ObjectId validation
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
// Register
const registeruser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, department, position } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        // Allow department by name or ObjectId
        let departmentId = undefined;
        if (department) {
            // Try to find by ObjectId first
            if (mongoose_1.default.Types.ObjectId.isValid(department)) {
                const departmentExists = await Department_1.Department.findById(department);
                if (departmentExists) {
                    departmentId = departmentExists._id;
                }
            }
            // If not found by ID, try by name
            if (!departmentId) {
                const departmentByName = await Department_1.Department.findOne({ name: department });
                if (departmentByName) {
                    departmentId = departmentByName._id;
                }
                else {
                    return res.status(400).json({ message: 'Invalid department.' });
                }
            }
        }
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use.' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = new User_1.User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            department: departmentId, // Use the resolved ObjectId
            position,
        });
        await user.save();
        res.status(201).json({ message: 'User registered successfully.' });
    }
    catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.registeruser = registeruser;
// Login
const loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt with:', email);
        // Populate department
        const user = await User_1.User.findOne({ email: email.toLowerCase() }).populate('department');
        if (!user) {
            console.log('No user found.');
            return res.status(400).json({ message: 'Invalid email or password.' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        console.log('Password match:', isMatch);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                department: (user.department && typeof user.department === 'object' && 'name' in user.department) ? user.department.name : undefined,
                position: user.position,
                profilePicture: user.profilePicture,
            },
        });
    }
    catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.loginuser = loginuser;
// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User_1.User.find().select('-password'); // Exclude password
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.getAllUsers = getAllUsers;
// Update user profile picture with Cloudinary
const updateProfilePicture = async (req, res) => {
    try {
        const { userId } = req.params;
        const file = req.file; // Multer will populate this
        console.log('Profile picture upload request:', { userId, file: file ? 'File received' : 'No file' });
        console.log('Environment variables check:', {
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'
        });
        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }
        // Check if Cloudinary is configured
        if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.error('Cloudinary credentials not found in environment variables');
            return res.status(500).json({
                success: false,
                message: 'Cloudinary configuration error - missing credentials'
            });
        }
        console.log('Uploading to Cloudinary...');
        console.log('File details:', {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size
        });
        // Test Cloudinary configuration
        console.log('Testing Cloudinary config before upload:', {
            cloud_name: cloudinary_1.default.config().cloud_name,
            api_key: cloudinary_1.default.config().api_key ? 'SET' : 'NOT SET',
            api_secret: cloudinary_1.default.config().api_secret ? 'SET' : 'NOT SET'
        });
        // Reconfigure Cloudinary if needed
        if (!cloudinary_1.default.config().api_key) {
            console.log('Reconfiguring Cloudinary with direct values...');
            cloudinary_1.default.config({
                cloud_name: 'dcy52rhvi',
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
            });
        }
        // Convert buffer to base64 for Cloudinary v2
        const base64String = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        // Upload to Cloudinary using v2 API
        const result = await cloudinary_1.default.uploader.upload(base64String, {
            folder: 'profile-pictures',
            transformation: [
                { width: 200, height: 200, crop: 'fill' },
                { quality: 'auto' }
            ]
        });
        console.log('Cloudinary upload successful:', result.secure_url);
        console.log('Updating user in database...');
        // Update user with Cloudinary URL
        const user = await User_1.User.findByIdAndUpdate(userId, { profilePicture: result.secure_url }, { new: true, runValidators: true }).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        console.log('Profile picture update successful');
        res.status(200).json({
            success: true,
            data: user,
            message: 'Profile picture updated successfully'
        });
    }
    catch (error) {
        console.error('Profile picture upload error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            http_code: error.http_code,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Error uploading profile picture',
            error: error.message
        });
    }
};
exports.updateProfilePicture = updateProfilePicture;
// Get user profile (for authenticated user)
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // From auth middleware
        const user = await User_1.User.findById(userId)
            .select('-password')
            .populate('department', 'name description');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Transform the user object to match frontend expectations
        const userData = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            department: user.department && typeof user.department === 'object' && 'name' in user.department
                ? user.department.name
                : undefined,
            position: user.position,
            profilePicture: user.profilePicture
        };
        res.status(200).json({
            success: true,
            data: userData,
            message: 'Profile retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving profile',
            error: error.message
        });
    }
};
exports.getProfile = getProfile;
// Update user profile (basic info, not picture)
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { firstName, lastName, position } = req.body;
        const user = await User_1.User.findByIdAndUpdate(userId, { firstName, lastName, position }, { new: true, runValidators: true }).select('-password').populate('department', 'name description');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            data: user,
            message: 'Profile updated successfully'
        });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};
exports.updateProfile = updateProfile;
