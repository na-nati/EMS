const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';
let authToken = '';

async function testAPI() {
    console.log('🚀 Testing Employee Management System API...\n');

    try {
        // Test 1: Register a new user
        console.log('1. Testing User Registration...');
        const registerResponse = await axios.post(`${API_BASE}/users/register`, {
            firstName: 'Test',
            lastName: 'User',
            email: 'test.user@company.com',
            role: 'employee'
        });
        console.log('✅ User registered successfully:', registerResponse.data.message);

        // Test 2: Login
        console.log('\n2. Testing User Login...');
        const loginResponse = await axios.post(`${API_BASE}/users/login`, {
            email: 'test.user@company.com',
            password: 'testuser'
        });
        authToken = loginResponse.data.token;
        console.log('✅ User logged in successfully');

        // Test 3: Create a department
        console.log('\n3. Testing Department Creation...');
        const deptResponse = await axios.post(`${API_BASE}/departments`, {
            name: 'Test Department',
            description: 'Test Description for API Testing'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Department created successfully:', deptResponse.data.name);

        // Test 4: Get all departments
        console.log('\n4. Testing Department Retrieval...');
        const deptsResponse = await axios.get(`${API_BASE}/departments`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Departments retrieved successfully. Count:', deptsResponse.data.length);

        // Test 5: Test protected route without token
        console.log('\n5. Testing Authentication Protection...');
        try {
            await axios.get(`${API_BASE}/employees`);
            console.log('❌ Authentication bypassed - this should not happen');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Authentication protection working correctly');
            } else {
                console.log('❌ Unexpected error:', error.response?.status);
            }
        }

        console.log('\n🎉 All basic API tests completed successfully!');
        console.log('\n📚 For comprehensive testing, see: API_TESTING.md');
        console.log('📖 For complete API documentation, see: API_DOCUMENTATION.md');
        console.log('📋 For API summary, see: COMPLETE_API_SUMMARY.md');

    } catch (error) {
        console.error('\n❌ API Test Failed:', error.response?.data || error.message);
        console.log('\n💡 Make sure:');
        console.log('   - MongoDB is running');
        console.log('   - Server is started (npm run dev)');
        console.log('   - Environment variables are set');
    }
}

// Run the test
testAPI();
