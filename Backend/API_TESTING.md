# Employee Management System API Testing Guide

This guide demonstrates how to test all CRUD operations for the Employee Management System API.

## Prerequisites
- Node.js and npm installed
- MongoDB running locally or accessible
- API server running on port 5000

## Setup
1. Install dependencies: `npm install`
2. Set up environment variables in `.env` file
3. Start the server: `npm run dev`

## Base URL
```
http://localhost:5000/api
```

## 1. Authentication Testing

### Register a new user
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    "role": "employee"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@company.com",
    "password": "johndoe"
  }'
```

**Save the returned JWT token for subsequent requests.**

## 2. Department Management Testing

### Create Department
```bash
curl -X POST http://localhost:5000/api/departments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Engineering",
    "description": "Software Development Team"
  }'
```

### Get All Departments
```bash
curl -X GET http://localhost:5000/api/departments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Department by ID
```bash
curl -X GET http://localhost:5000/api/departments/DEPARTMENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Department
```bash
curl -X PUT http://localhost:5000/api/departments/DEPARTMENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Software Engineering",
    "description": "Advanced Software Development Team"
  }'
```

### Delete Department
```bash
curl -X DELETE http://localhost:5000/api/departments/DEPARTMENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 3. Employee Management Testing

### Create Employee
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "user_id": "USER_ID",
    "employee_code": "EMP001",
    "job_profile": "Software Engineer",
    "department_id": "DEPARTMENT_ID",
    "joining_date": "2024-01-15",
    "employment_status": "active",
    "phone_number": "+1234567890"
  }'
```

### Get All Employees
```bash
curl -X GET "http://localhost:5000/api/employees?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Employee by ID
```bash
curl -X GET http://localhost:5000/api/employees/EMPLOYEE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Employee
```bash
curl -X PUT http://localhost:5000/api/employees/EMPLOYEE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "job_profile": "Senior Software Engineer",
    "employment_status": "active"
  }'
```

### Delete Employee
```bash
curl -X DELETE http://localhost:5000/api/employees/EMPLOYEE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 4. Asset Management Testing

### Create Asset
```bash
curl -X POST http://localhost:5000/api/assets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "MacBook Pro",
    "serial_number": "MBP2024001",
    "type": "laptop",
    "condition": "excellent",
    "purchase_date": "2024-01-01",
    "warranty_expiry": "2027-01-01",
    "location": "Office A-101"
  }'
```

### Get All Assets
```bash
curl -X GET "http://localhost:5000/api/assets?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Asset by ID
```bash
curl -X GET http://localhost:5000/api/assets/ASSET_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Asset
```bash
curl -X PUT http://localhost:5000/api/assets/ASSET_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "condition": "good",
    "location": "Office B-205"
  }'
```

### Assign Asset to Employee
```bash
curl -X PATCH http://localhost:5000/api/assets/ASSET_ID/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "assigned_to": "EMPLOYEE_ID"
  }'
```

### Delete Asset
```bash
curl -X DELETE http://localhost:5000/api/assets/ASSET_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 5. Attendance Management Testing

### Create Attendance Record
```bash
curl -X POST http://localhost:5000/api/attendance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "employee_id": "EMPLOYEE_ID",
    "date": "2024-01-15",
    "check_in": "2024-01-15T09:00:00Z",
    "check_out": "2024-01-15T17:00:00Z",
    "status": "present",
    "notes": "Regular work day"
  }'
```

### Get All Attendance Records
```bash
curl -X GET "http://localhost:5000/api/attendance?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Attendance by ID
```bash
curl -X GET http://localhost:5000/api/attendance/ATTENDANCE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Attendance
```bash
curl -X PUT http://localhost:5000/api/attendance/ATTENDANCE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "check_out": "2024-01-15T18:00:00Z",
    "notes": "Overtime work"
  }'
```

### Bulk Create Attendance
```bash
curl -X POST http://localhost:5000/api/attendance/bulk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "records": [
      {
        "employee_id": "EMPLOYEE_ID_1",
        "date": "2024-01-15",
        "check_in": "2024-01-15T09:00:00Z",
        "status": "present"
      },
      {
        "employee_id": "EMPLOYEE_ID_2",
        "date": "2024-01-15",
        "check_in": "2024-01-15T09:00:00Z",
        "status": "present"
      }
    ]
  }'
```

### Delete Attendance
```bash
curl -X DELETE http://localhost:5000/api/attendance/ATTENDANCE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 6. Leave Request Testing

### Create Leave Request
```bash
curl -X POST http://localhost:5000/api/leave-requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "employee_id": "EMPLOYEE_ID",
    "leave_type": "annual",
    "start_date": "2024-02-01",
    "end_date": "2024-02-05",
    "reason": "Family vacation"
  }'
```

### Get All Leave Requests
```bash
curl -X GET "http://localhost:5000/api/leave-requests?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Leave Request by ID
```bash
curl -X GET http://localhost:5000/api/leave-requests/LEAVE_REQUEST_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Leave Request
```bash
curl -X PUT http://localhost:5000/api/leave-requests/LEAVE_REQUEST_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "end_date": "2024-02-07",
    "reason": "Extended family vacation"
  }'
```

### Approve Leave Request
```bash
curl -X PATCH http://localhost:5000/api/leave-requests/LEAVE_REQUEST_ID/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "approved_by": "MANAGER_ID"
  }'
```

### Delete Leave Request
```bash
curl -X DELETE http://localhost:5000/api/leave-requests/LEAVE_REQUEST_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 7. Salary Management Testing

### Create Salary Record
```bash
curl -X POST http://localhost:5000/api/salaries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "user": "USER_ID",
    "basicSalary": 5000,
    "bonus": 500,
    "deductions": 200,
    "month": "January",
    "year": 2024,
    "status": "pending"
  }'
```

### Get All Salaries
```bash
curl -X GET http://localhost:5000/api/salaries \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Salary by ID
```bash
curl -X GET http://localhost:5000/api/salaries/SALARY_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Salary
```bash
curl -X PUT http://localhost:5000/api/salaries/SALARY_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "bonus": 750,
    "status": "paid"
  }'
```

### Delete Salary
```bash
curl -X DELETE http://localhost:5000/api/salaries/SALARY_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 8. Manager Management Testing

### Create Manager
```bash
curl -X POST http://localhost:5000/api/managers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "user_id": "USER_ID",
    "department_id": "DEPARTMENT_ID",
    "email": "manager@company.com",
    "phone_number": "+1234567890"
  }'
```

### Get All Managers
```bash
curl -X GET "http://localhost:5000/api/managers?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Manager by ID
```bash
curl -X GET http://localhost:5000/api/managers/MANAGER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Manager
```bash
curl -X PUT http://localhost:5000/api/managers/MANAGER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "phone_number": "+1987654321"
  }'
```

### Delete Manager
```bash
curl -X DELETE http://localhost:5000/api/managers/MANAGER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 9. Testing with Postman

### Import Collection
1. Download the Postman collection file (if available)
2. Import into Postman
3. Set up environment variables for base URL and JWT token
4. Use the pre-request scripts to automatically set authentication headers

### Environment Variables
```
base_url: http://localhost:5000/api
jwt_token: YOUR_JWT_TOKEN_HERE
```

## 10. Testing with JavaScript/Node.js

### Setup
```bash
npm install axios
```

### Example Test Script
```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';
let authToken = '';

async function testAPI() {
    try {
        // Login
        const loginResponse = await axios.post(`${API_BASE}/users/login`, {
            email: 'john.doe@company.com',
            password: 'johndoe'
        });
        
        authToken = loginResponse.data.token;
        
        // Test creating a department
        const deptResponse = await axios.post(`${API_BASE}/departments`, {
            name: 'Test Department',
            description: 'Test Description'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        console.log('Department created:', deptResponse.data);
        
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testAPI();
```

## 11. Error Handling Testing

### Test Invalid Input
```bash
# Test with missing required fields
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "employee_code": "EMP001"
  }'
```

### Test Unauthorized Access
```bash
# Test without JWT token
curl -X GET http://localhost:5000/api/employees
```

### Test Invalid ID
```bash
# Test with non-existent ID
curl -X GET http://localhost:5000/api/employees/INVALID_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 12. Performance Testing

### Test Pagination
```bash
# Test with different page sizes
curl -X GET "http://localhost:5000/api/employees?page=1&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

curl -X GET "http://localhost:5000/api/employees?page=1&limit=50" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Filtering
```bash
# Test with filters
curl -X GET "http://localhost:5000/api/employees?employment_status=active&department_id=DEPT_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 13. Security Testing

### Test Role-Based Access
```bash
# Test with different user roles
# Create users with different roles and test access to protected endpoints
```

### Test JWT Expiration
```bash
# Wait for JWT to expire and test access
```

## Notes
- Replace `YOUR_JWT_TOKEN` with actual JWT token from login
- Replace placeholder IDs (USER_ID, EMPLOYEE_ID, etc.) with actual IDs from your database
- All timestamps should be in ISO 8601 format
- Test both successful and error scenarios
- Verify response status codes and error messages
- Test pagination, filtering, and sorting functionality
- Test role-based access control
- Test validation rules for all endpoints
