import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import connectdb from "./config/dbconnection";
import userRoutes from "./routes/userRoutes";

dotenv.config(); // Loads environment variables

const app: Application = express();

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
            { url: 'https://ems-backend-qwcv.onrender.com' }
        ],
    },
    apis: ['./routes/*.ts', './models/*.ts'], // Path to your route/model files for annotation scanning
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
const port = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
