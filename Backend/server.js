const express = require("express");
const app = express();
const dotenv = require("dotenv").config(); // Loads environment variables
const connectdb = require("./config/dbConnection");
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

// Connect to MongoDB
connectdb();

// Middleware to parse JSON
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routes
app.use('/api/users', userRoutes);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
