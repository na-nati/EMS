import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Department } from '../models/Department'; // Import Department model
import mongoose from 'mongoose'; // Import mongoose for ObjectId validation
import cloudinary from '../config/cloudinary';

// Extend Request type to include file from multer
interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

// Register
export const registeruser = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password, role, department, position } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Allow department by name or ObjectId
        let departmentId = undefined;
        if (department) {
            // Try to find by ObjectId first
            if (mongoose.Types.ObjectId.isValid(department)) {
                const departmentExists = await Department.findById(department);
                if (departmentExists) {
                    departmentId = departmentExists._id;
                }
            }
            // If not found by ID, try by name
            if (!departmentId) {
                const departmentByName = await Department.findOne({ name: department });
                if (departmentByName) {
                    departmentId = departmentByName._id;
                } else {
                    return res.status(400).json({ message: 'Invalid department.' });
                }
            }
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
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
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Login
export const loginuser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt with:', email);

        // Populate department
        const user = await User.findOne({ email: email.toLowerCase() }).populate('department');
        if (!user) {
            console.log('No user found.');
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                department: (user.department && typeof user.department === 'object' && 'name' in user.department) ? (user.department as any).name : undefined,
                position: user.position,
                profilePicture: user.profilePicture,
            },
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-password'); // Exclude password
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// Update user profile picture with Cloudinary
export const updateProfilePicture = async (req: MulterRequest, res: Response) => {
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
            cloud_name: cloudinary.config().cloud_name,
            api_key: cloudinary.config().api_key ? 'SET' : 'NOT SET',
            api_secret: cloudinary.config().api_secret ? 'SET' : 'NOT SET'
        });

        // Reconfigure Cloudinary if needed
        if (!cloudinary.config().api_key) {
            console.log('Reconfiguring Cloudinary with direct values...');
            cloudinary.config({
                cloud_name: 'dcy52rhvi',
                api_key: process.env.CLOUDINARY_API_KEY!,
                api_secret: process.env.CLOUDINARY_API_SECRET!,
            });
        }

        // Convert buffer to base64 for Cloudinary v2
        const base64String = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

        // Upload to Cloudinary using v2 API
        const result = await cloudinary.uploader.upload(base64String, {
            folder: 'profile-pictures',
            transformation: [
                { width: 200, height: 200, crop: 'fill' },
                { quality: 'auto' }
            ]
        });

        console.log('Cloudinary upload successful:', result.secure_url);

        console.log('Updating user in database...');

        // Update user with Cloudinary URL
        const user = await User.findByIdAndUpdate(
            userId,
            { profilePicture: result.secure_url },
            { new: true, runValidators: true }
        ).select('-password');

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
    } catch (error: any) {
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

// Get user profile (for authenticated user)
export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId; // From auth middleware

        const user = await User.findById(userId)
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
                ? (user.department as any).name
                : undefined,
            position: user.position,
            profilePicture: user.profilePicture
        };

        res.status(200).json({
            success: true,
            data: userData,
            message: 'Profile retrieved successfully'
        });
    } catch (error: any) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving profile',
            error: error.message
        });
    }
};

// Update user profile (basic info, not picture)
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { firstName, lastName, position } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName, position },
            { new: true, runValidators: true }
        ).select('-password').populate('department', 'name description');

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
    } catch (error: any) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};