"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.updateProfilePicture = exports.getAllUsers = exports.logout = exports.refreshToken = exports.loginuser = exports.registeruser = void 0;
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
// Register
const registeruser = async (req, res) => {
    try {
        const { firstName, lastName, role, email } = req.body;
        if (!firstName || !lastName || !role || !email) {
            return res.status(400).json({ message: 'First name, last name, email and role are required.' });
        }
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use.' });
        }
        const generatedPassword = `${firstName}${lastName}`.toLowerCase();
        const hashedPassword = await bcryptjs_1.default.hash(generatedPassword, 10);
        const user = new User_1.User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
        });
        await user.save();
        res.status(201).json({ message: 'User registered successfully.', generatedPassword });
    }
    catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};
exports.registeruser = registeruser;
// Login
const createAccessToken = (payload, expiresIn = '15m') => {
    const secret = process.env.JWT_SECRET;
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
};
const createRefreshToken = (payload, expiresIn = '7d') => {
    const secret = (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
};
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
        const accessToken = createAccessToken({ userId: user._id, role: user.role });
        const refreshToken = createRefreshToken({ userId: user._id, role: user.role, tokenVersion: user.tokenVersion ?? 0 });
        // Set refresh token in httpOnly cookie
        res.cookie('jid', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/api/users/refresh-token',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({
            token: accessToken,
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
const refreshToken = async (req, res) => {
    try {
        const token = req.cookies?.jid;
        if (!token) {
            return res.status(401).json({ message: 'No refresh token' });
        }
        const secret = (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
        let payload = null;
        try {
            payload = jsonwebtoken_1.default.verify(token, secret);
        }
        catch (e) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        const user = await User_1.User.findById(payload.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        if ((user.tokenVersion ?? 0) !== (payload.tokenVersion ?? 0)) {
            return res.status(401).json({ message: 'Refresh token revoked' });
        }
        const newAccessToken = createAccessToken({ userId: user._id, role: user.role });
        const newRefreshToken = createRefreshToken({ userId: user._id, role: user.role, tokenVersion: user.tokenVersion ?? 0 });
        res.cookie('jid', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/api/users/refresh-token',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({ token: newAccessToken });
    }
    catch (err) {
        console.error('Refresh token error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res) => {
    try {
        res.clearCookie('jid', { path: '/api/users/refresh-token' });
        return res.json({ success: true });
    }
    catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.logout = logout;
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
        const file = req.file;
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
        if (error && typeof error === 'object') {
            console.error('Profile picture upload error:', error);
        }
        const message = (error instanceof Error) ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            message: 'Error uploading profile picture',
            error: message
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
        const message = (error instanceof Error) ? error.message : 'Unknown error';
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving profile',
            error: message
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
        const message = (error instanceof Error) ? error.message : 'Unknown error';
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: message
        });
    }
};
exports.updateProfile = updateProfile;
//# sourceMappingURL=userController.js.map