const cloudinary = require('cloudinary').v2;

// Debug: Log the actual values (remove in production)
console.log('Loading Cloudinary config with:', {
    cloud_name: 'dcy52rhvi',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'NOT SET'
});

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dcy52rhvi',
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Verify configuration
console.log('Cloudinary Config Status:', {
    cloud_name: cloudinary.config().cloud_name,
    api_key: cloudinary.config().api_key ? 'SET' : 'NOT SET',
    api_secret: cloudinary.config().api_secret ? 'SET' : 'NOT SET'
});

export default cloudinary; 