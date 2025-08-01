"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
// Debug: Log the actual values (remove in production)
console.log('Loading Cloudinary config with:', {
    cloud_name: 'dcy52rhvi',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'NOT SET'
});
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: 'dcy52rhvi',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Verify configuration
console.log('Cloudinary Config Status:', {
    cloud_name: cloudinary_1.v2.config().cloud_name,
    api_key: cloudinary_1.v2.config().api_key ? 'SET' : 'NOT SET',
    api_secret: cloudinary_1.v2.config().api_secret ? 'SET' : 'NOT SET'
});
exports.default = cloudinary_1.v2;
