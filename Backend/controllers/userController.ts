import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Department } from '../models/Department'; // Import Department model
import mongoose from 'mongoose'; // Import mongoose for ObjectId validation
import cloudinary from '../config/cloudinary';

// Register
export const registeruser = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, role, email } = req.body;

        if (!firstName || !lastName || !role || !email) {
            return res.status(400).json({ message: 'First name, last name, email and role are required.' });
        }


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        const generatedPassword = `${firstName}${lastName}`.toLowerCase();

        const hashedPassword = await bcrypt.hash(generatedPassword, 10);
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully.', generatedPassword });
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
export const updateProfilePicture = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const file = (req as any).file as { originalname: string; mimetype: string; size: number; buffer: Buffer } | undefined;

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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
        const message = (error instanceof Error) ? error.message : 'Unknown error';
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving profile',
            error: message
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
    } catch (error: unknown) {
        const message = (error instanceof Error) ? error.message : 'Unknown error';
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: message
        });
    }
};