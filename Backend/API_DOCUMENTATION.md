# Employee Management System API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints require authentication unless specified otherwise. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### 1. Users Management
**Base Path:** `/users`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users` | Create a new user |
| GET | `/users` | Get all users (with pagination) |
| GET | `/users/:id` | Get user by ID |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |
| POST | `/users/login` | User login |
| POST | `/users/register` | User registration |

### 2. Departments Management
**Base Path:** `/departments`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/departments` | Create a new department |
| GET | `/departments` | Get all departments |
| GET | `/departments/:id` | Get department by ID |
| PUT | `/departments/:id` | Update department |
| DELETE | `/departments/:id` | Delete department |

### 3. Employees Management
**Base Path:** `/employees`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/employees` | Create a new employee |
| GET | `/employees` | Get all employees (with pagination) |
| GET | `/employees/:id` | Get employee by ID |
| PUT | `/employees/:id` | Update employee |
| DELETE | `/employees/:id` | Delete employee |
| GET | `/employees/department/:departmentId` | Get employees by department |

### 4. Assets Management
**Base Path:** `/assets`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/assets` | Create a new asset |
| GET | `/assets` | Get all assets (with pagination & filtering) |
| GET | `/assets/:id` | Get asset by ID |
| PUT | `/assets/:id` | Update asset |
| DELETE | `/assets/:id` | Delete asset |
| PATCH | `/assets/:id/assign` | Assign asset to employee |
| PATCH | `/assets/:id/unassign` | Unassign asset from employee |
| GET | `/assets/employee/:employeeId` | Get assets by employee |

### 5. Attendance Management
**Base Path:** `/attendance`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/attendance` | Create attendance record |
| GET | `/attendance` | Get all attendance records (with pagination & filtering) |
| GET | `/attendance/:id` | Get attendance by ID |
| PUT | `/attendance/:id` | Update attendance record |
| DELETE | `/attendance/:id` | Delete attendance record |
| POST | `/attendance/bulk` | Bulk create attendance records |
| GET | `/attendance/employee/:employeeId` | Get attendance by employee |
| GET | `/attendance/employee/:employeeId/stats` | Get attendance statistics for employee |

### 6. Leave Requests Management
**Base Path:** `/leave-requests`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/leave-requests` | Create leave request |
| GET | `/leave-requests` | Get all leave requests (with pagination & filtering) |
| GET | `/leave-requests/:id` | Get leave request by ID |
| PUT | `/leave-requests/:id` | Update leave request |
| DELETE | `/leave-requests/:id` | Delete leave request |
| PATCH | `/leave-requests/:id/approve` | Approve leave request |
| PATCH | `/leave-requests/:id/reject` | Reject leave request |
| GET | `/leave-requests/employee/:employeeId` | Get leave requests by employee |
| GET | `/leave-requests/pending/all` | Get pending leave requests |

### 7. Payroll Management
**Base Path:** `/payrolls`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payrolls` | Create payroll record |
| GET | `/payrolls` | Get all payroll records (with pagination & filtering) |
| GET | `/payrolls/:id` | Get payroll by ID |
| PUT | `/payrolls/:id` | Update payroll record |
| DELETE | `/payrolls/:id` | Delete payroll record |
| POST | `/payrolls/bulk` | Bulk create payroll records |
| GET | `/payrolls/employee/:employeeId` | Get payroll by employee |
| GET | `/payrolls/month/:month/year/:year` | Get payroll by month/year |
| PATCH | `/payrolls/:id/status` | Update payroll status |
| GET | `/payrolls/stats/:year` | Get payroll statistics |

### 8. Training Management
**Base Path:** `/trainings`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/trainings` | Create training course |
| GET | `/trainings` | Get all training courses (with pagination & filtering) |
| GET | `/trainings/:id` | Get training by ID |
| PUT | `/trainings/:id` | Update training course |
| DELETE | `/trainings/:id` | Delete training course |
| PATCH | `/trainings/:id/status` | Update training status |
| GET | `/trainings/upcoming/all` | Get upcoming trainings |
| GET | `/trainings/completed/all` | Get completed trainings |
| GET | `/trainings/stats/all` | Get training statistics |

### 9. Performance Reviews Management
**Base Path:** `/performance-reviews`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/performance-reviews` | Create performance review |
| GET | `/performance-reviews` | Get all performance reviews (with pagination & filtering) |
| GET | `/performance-reviews/:id` | Get performance review by ID |
| PUT | `/performance-reviews/:id` | Update performance review |
| DELETE | `/performance-reviews/:id` | Delete performance review |
| GET | `/performance-reviews/employee/:employeeId` | Get performance reviews by employee |
| GET | `/performance-reviews/evaluator/:evaluatorId` | Get performance reviews by evaluator |
| GET | `/performance-reviews/employee/:employeeId/stats` | Get performance statistics for employee |

### 10. Recruitment Management
**Base Path:** `/recruitments`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/recruitments` | Create recruitment request |
| GET | `/recruitments` | Get all recruitment requests (with pagination & filtering) |
| GET | `/recruitments/:id` | Get recruitment by ID |
| PUT | `/recruitments/:id` | Update recruitment request |
| DELETE | `/recruitments/:id` | Delete recruitment request |
| PATCH | `/recruitments/:id/status` | Update recruitment status |
| GET | `/recruitments/requester/:requesterId` | Get recruitments by requester |
| GET | `/recruitments/active/all` | Get active recruitment requests |
| GET | `/recruitments/stats/all` | Get recruitment statistics |

### 11. Separation Requests Management
**Base Path:** `/separation-requests`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/separation-requests` | Create separation request |
| GET | `/separation-requests` | Get all separation requests (with pagination & filtering) |
| GET | `/separation-requests/:id` | Get separation request by ID |
| PUT | `/separation-requests/:id` | Update separation request |
| DELETE | `/separation-requests/:id` | Delete separation request |
| PATCH | `/separation-requests/:id/approve` | Approve separation request |
| PATCH | `/separation-requests/:id/process` | Process separation request by HR |
| GET | `/separation-requests/employee/:employeeId` | Get separation requests by employee |
| GET | `/separation-requests/pending/all` | Get pending separation requests |

### 12. Training Requests Management
**Base Path:** `/training-requests`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/training-requests` | Create training request |
| GET | `/training-requests` | Get all training requests (with pagination & filtering) |
| GET | `/training-requests/:id` | Get training request by ID |
| PUT | `/training-requests/:id` | Update training request |
| DELETE | `/training-requests/:id` | Delete training request |
| PATCH | `/training-requests/:id/approve` | Approve training request |
| PATCH | `/training-requests/:id/reject` | Reject training request |
| PATCH | `/training-requests/:id/progress` | Update training progress |
| GET | `/training-requests/employee/:employeeId` | Get training requests by employee |
| GET | `/training-requests/pending/all` | Get pending training requests |

### 13. Document Requests Management
**Base Path:** `/document-requests`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/document-requests` | Create document request |
| GET | `/document-requests` | Get all document requests (with pagination & filtering) |
| GET | `/document-requests/:id` | Get document request by ID |
| PUT | `/document-requests/:id` | Update document request |
| DELETE | `/document-requests/:id` | Delete document request |
| PATCH | `/document-requests/:id/status` | Update document request status |
| PATCH | `/document-requests/:id/fulfill` | Fulfill document request |
| GET | `/document-requests/employee/:employeeId` | Get document requests by employee |
| GET | `/document-requests/pending/all` | Get pending document requests |
| GET | `/document-requests/stats/all` | Get document request statistics |

### 14. Salary Management
**Base Path:** `/salaries`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/salaries` | Create salary record |
| GET | `/salaries` | Get all salary records (with pagination & filtering) |
| GET | `/salaries/:id` | Get salary by ID |
| PUT | `/salaries/:id` | Update salary record |
| DELETE | `/salaries/:id` | Delete salary record |
| POST | `/salaries/bulk` | Bulk create salary records |
| GET | `/salaries/user/:userId` | Get salary by user |
| GET | `/salaries/month/:month/year/:year` | Get salary by month/year |
| PATCH | `/salaries/:id/status` | Update salary status |
| GET | `/salaries/stats/:year` | Get salary statistics |

### 15. Managers Management
**Base Path:** `/managers`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/managers` | Create manager |
| GET | `/managers` | Get all managers (with pagination & filtering) |
| GET | `/managers/:id` | Get manager by ID |
| PUT | `/managers/:id` | Update manager |
| DELETE | `/managers/:id` | Delete manager |
| GET | `/managers/user/:userId` | Get manager by user ID |
| GET | `/managers/department/:departmentId` | Get managers by department |
| GET | `/managers/check/:userId` | Check if user is a manager |

### 16. Audit Logs Management
**Base Path:** `/audit-logs`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/audit-logs` | Create audit log entry |
| GET | `/audit-logs` | Get all audit logs (with pagination & filtering) |
| GET | `/audit-logs/:id` | Get audit log by ID |
| PUT | `/audit-logs/:id` | Update audit log |
| DELETE | `/audit-logs/:id` | Delete audit log |
| GET | `/audit-logs/user/:userId` | Get audit logs by user |
| GET | `/audit-logs/table/:targetTable` | Get audit logs by target table |
| GET | `/audit-logs/stats/all` | Get audit log statistics |
| DELETE | `/audit-logs/clear/:days` | Clear old audit logs |

### 17. Documents Management
**Base Path:** `/documents`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/documents` | Upload document |
| GET | `/documents` | Get all documents (with pagination & filtering) |
| GET | `/documents/:id` | Get document by ID |
| PUT | `/documents/:id` | Update document |
| DELETE | `/documents/:id` | Delete document |
| GET | `/documents/download/:id` | Download document |
| GET | `/documents/employee/:employeeId` | Get documents by employee |
| GET | `/documents/category/:category` | Get documents by category |

## Query Parameters

### Pagination
- `page`: Page number (default: 1)
- `limit`: Number of items per page (default: 10)

### Filtering
- `status`: Filter by status
- `employee_id` / `user_id`: Filter by employee/user
- `department_id`: Filter by department
- `start_date`: Filter from date
- `end_date`: Filter to date
- `month`: Filter by month
- `year`: Filter by year

### Examples
```
GET /api/employees?page=1&limit=20&department_id=123&status=active
GET /api/attendance?start_date=2024-01-01&end_date=2024-01-31&employee_id=456
GET /api/payrolls?month=January&year=2024&status=paid
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

## Authentication & Authorization
- JWT tokens are required for most endpoints
- Role-based access control is implemented
- Super Admin has access to all endpoints
- HR has access to most management endpoints
- Managers have access to their department's data
- Employees have limited access to their own data

## Rate Limiting
- API requests are rate-limited to prevent abuse
- Default limit: 100 requests per minute per IP
- Rate limit headers are included in responses

## Error Handling
- All endpoints include proper error handling
- Validation errors are returned with detailed messages
- Database errors are logged and handled gracefully
- 404 errors for non-existent resources
- 400 errors for invalid input data 