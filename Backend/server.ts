import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
const YAML = require('yamljs');
import cookieParser from 'cookie-parser';




import connectdb from "./config/dbconnection";
import userRoutes from "./routes/userRoutes";
import departmentRoutes from "./routes/departmentRoutes";
import documentRoutes from "./routes/documentRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import assetRoutes from "./routes/assetRoutes";
import attendanceRoutes from "./routes/attendanceRoutes";
import leaveRequestRoutes from "./routes/leaveRequestRoutes";
import payrollRoutes from "./routes/payrollRoutes";
import trainingRoutes from "./routes/trainingRoutes";
import performanceReviewRoutes from "./routes/performanceReviewRoutes";
import recruitmentRoutes from "./routes/recruitmentRoutes";
import separationRequestRoutes from "./routes/separationRequestRoutes";
import trainingRequestRoutes from "./routes/trainingRequestRoutes";
import documentRequestRoutes from "./routes/documentRequestRoutes";
import salaryRoutes from "./routes/salaryRoutes";
import managerRoutes from "./routes/managerRoutes";
import auditLogRoutes from "./routes/auditLogRoutes";
import companyRoutes from "./routes/companyRoutes";
import adminRoutes from "./routes/adminRoutes";
import moduleRoutes from "./routes/moduleRoutes";
import { errorHandler } from './middleware/errorHandler';

dotenv.config(); // Loads environment variables

const app: Application = express();

// Load Swagger YAML file
const swaggerDocument = YAML.load('./swagger.yaml');

connectdb();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_ORIGIN?.split(',') || true,
    credentials: true,
}));

app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave-requests', leaveRequestRoutes);
app.use('/api/payrolls', payrollRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/performance-reviews', performanceReviewRoutes);
app.use('/api/recruitments', recruitmentRoutes);
app.use('/api/separation-requests', separationRequestRoutes);
app.use('/api/training-requests', trainingRequestRoutes);
app.use('/api/document-requests', documentRequestRoutes);
app.use('/api/salaries', salaryRoutes);
app.use('/api/managers', managerRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/modules', moduleRoutes);
app.use(errorHandler);

// Serve Swagger UI with YAML
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
