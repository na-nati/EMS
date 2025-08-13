# Dashboard Charts Backend Implementation

## 🚀 New API Endpoints

### 1. Employee Registration Trends
- **Endpoint**: `GET /api/employees/registration-trends`
- **Query Parameters**: `days` (optional, default: 30)
- **Description**: Returns daily employee registration data for charts

### 2. Active vs Leave Employee Trends
- **Endpoint**: `GET /api/employees/active-leave-trends`
- **Query Parameters**: `days` (optional, default: 30)
- **Description**: Returns daily active and leave employee counts

### 3. Department Distribution (Existing)
- **Endpoint**: `GET /api/departments`
- **Description**: Returns department data for pie chart

## 🧪 Testing the Endpoints

### Option 1: Using the Test Script
```bash
cd Backend
node test-charts.js
```

### Option 2: Using curl
```bash
# Test registration trends
curl http://localhost:5001/api/employees/registration-trends?days=7

# Test active/leave trends
curl http://localhost:5001/api/employees/active-leave-trends?days=7

# Test departments
curl http://localhost:5001/api/departments
```

### Option 3: Using Postman
1. Import the endpoints into Postman
2. Set base URL: `http://localhost:5001/api`
3. Test each endpoint

## 📊 Expected Response Formats

### Registration Trends Response:
```json
{
  "success": true,
  "data": {
    "dates": ["2024-01-01T00:00:00.000Z", "2024-01-02T00:00:00.000Z"],
    "newRegistrations": [31, 40],
    "totalEmployees": [31, 71]
  }
}
```

### Active/Leave Trends Response:
```json
{
  "success": true,
  "data": {
    "dates": ["2024-01-01T00:00:00.000Z", "2024-01-02T00:00:00.000Z"],
    "activeEmployees": [750, 745],
    "onLeave": [25, 30]
  }
}
```

## 🔧 How Active/Leave Data is Calculated

### Active Employees:
- Counts employees with `employment_status: 'Active'`
- Subtracts employees on approved leave for each day

### Employees on Leave:
- Uses `LeaveRequest` model with `status: 'approved'`
- Checks if current date falls within leave period (`start_date` to `end_date`)

## 🐛 Debugging

### Frontend Debugging:
1. Open browser developer tools (F12)
2. Go to Console tab
3. Navigate to Super Admin Dashboard
4. Look for console logs with 🔍, 📊, 📈, and ❌ emojis

### Backend Debugging:
1. Check server logs for any errors
2. Verify MongoDB connection
3. Check if Employee and LeaveRequest collections have data

## 📝 Data Requirements

### For Charts to Work:
1. **Employee Collection**: Must have employees with `employment_status` field
2. **LeaveRequest Collection**: Must have approved leave requests with `start_date` and `end_date`
3. **Department Collection**: Must have departments with employee counts

### Sample Data Structure:
```javascript
// Employee document
{
  "_id": ObjectId("..."),
  "user_id": ObjectId("..."),
  "employment_status": "Active",
  "createdAt": ISODate("2024-01-01")
}

// LeaveRequest document
{
  "_id": ObjectId("..."),
  "employee_id": ObjectId("..."),
  "status": "approved",
  "start_date": ISODate("2024-01-01"),
  "end_date": ISODate("2024-01-05")
}
```

## 🚨 Troubleshooting

### Common Issues:
1. **No data showing**: Check if collections have data
2. **CORS errors**: Ensure backend CORS is configured
3. **Authentication errors**: Check if user is logged in
4. **404 errors**: Verify endpoint URLs are correct

### Fallback Behavior:
- If API calls fail, charts will show mock data
- Check browser console for error messages
- Verify backend server is running on correct port
