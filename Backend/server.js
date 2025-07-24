const express = require("express");
const app = express();
const dotenv = require("dotenv").config(); // Loads environment variables
const connectdb = require("./config/dbconnection");
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Employee Management System API',
            version: '1.0.0',
            description: 'API documentation for Employee MS',
        },
        servers: [
            { url: 'http://localhost:5001' },
            { url:'https://ems-backend-qwcv.onrender.com'}
        ],
    },
    apis: ['./routes/*.js', './models/*.js'], // Path to your route/model files for annotation scanning
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Connect to MongoDB
connectdb();

// Middleware to parse JSON
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
