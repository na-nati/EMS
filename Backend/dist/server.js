"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const YAML = require('yamljs');
const dbconnection_1 = __importDefault(require("./config/dbconnection"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const departmentRoutes_1 = __importDefault(require("./routes/departmentRoutes"));
const documentRoutes_1 = __importDefault(require("./routes/documentRoutes"));
const employeeRoutes_1 = __importDefault(require("./routes/employeeRoutes"));
const assetRoutes_1 = __importDefault(require("./routes/assetRoutes"));
const attendanceRoutes_1 = __importDefault(require("./routes/attendanceRoutes"));
const leaveRequestRoutes_1 = __importDefault(require("./routes/leaveRequestRoutes"));
const payrollRoutes_1 = __importDefault(require("./routes/payrollRoutes"));
const trainingRoutes_1 = __importDefault(require("./routes/trainingRoutes"));
const performanceReviewRoutes_1 = __importDefault(require("./routes/performanceReviewRoutes"));
const recruitmentRoutes_1 = __importDefault(require("./routes/recruitmentRoutes"));
const separationRequestRoutes_1 = __importDefault(require("./routes/separationRequestRoutes"));
const trainingRequestRoutes_1 = __importDefault(require("./routes/trainingRequestRoutes"));
const documentRequestRoutes_1 = __importDefault(require("./routes/documentRequestRoutes"));
const salaryRoutes_1 = __importDefault(require("./routes/salaryRoutes"));
const managerRoutes_1 = __importDefault(require("./routes/managerRoutes"));
const auditLogRoutes_1 = __importDefault(require("./routes/auditLogRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config(); // Loads environment variables
const app = (0, express_1.default)();
// Load Swagger YAML file
const swaggerDocument = YAML.load('./swagger.yaml');
(0, dbconnection_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api/users', userRoutes_1.default);
app.use('/api/departments', departmentRoutes_1.default);
app.use('/api/documents', documentRoutes_1.default);
app.use('/api/employees', employeeRoutes_1.default);
app.use('/api/assets', assetRoutes_1.default);
app.use('/api/attendance', attendanceRoutes_1.default);
app.use('/api/leave-requests', leaveRequestRoutes_1.default);
app.use('/api/payrolls', payrollRoutes_1.default);
app.use('/api/trainings', trainingRoutes_1.default);
app.use('/api/performance-reviews', performanceReviewRoutes_1.default);
app.use('/api/recruitments', recruitmentRoutes_1.default);
app.use('/api/separation-requests', separationRequestRoutes_1.default);
app.use('/api/training-requests', trainingRequestRoutes_1.default);
app.use('/api/document-requests', documentRequestRoutes_1.default);
app.use('/api/salaries', salaryRoutes_1.default);
app.use('/api/managers', managerRoutes_1.default);
app.use('/api/audit-logs', auditLogRoutes_1.default);
app.use(errorHandler_1.errorHandler);
// Serve Swagger UI with YAML
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
const port = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=server.js.map