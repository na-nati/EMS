const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

// Test function to check if endpoints are working
async function testChartEndpoints() {
    try {
        console.log('Testing chart endpoints...\n');

        // Test registration trends endpoint
        console.log('1. Testing /employees/registration-trends...');
        try {
            const registrationResponse = await axios.get(`${API_BASE_URL}/employees/registration-trends?days=7`);
            console.log('✅ Registration trends endpoint working');
            console.log('Response structure:', Object.keys(registrationResponse.data));
            console.log('Sample data:', registrationResponse.data.data?.dates?.slice(0, 3));
        } catch (error) {
            console.log('❌ Registration trends endpoint failed:', error.response?.status, error.response?.data?.message || error.message);
        }

        // Test active/leave trends endpoint
        console.log('\n2. Testing /employees/active-leave-trends...');
        try {
            const activeLeaveResponse = await axios.get(`${API_BASE_URL}/employees/active-leave-trends?days=7`);
            console.log('✅ Active/leave trends endpoint working');
            console.log('Response structure:', Object.keys(activeLeaveResponse.data));
            console.log('Sample data:', activeLeaveResponse.data.data?.dates?.slice(0, 3));
        } catch (error) {
            console.log('❌ Active/leave trends endpoint failed:', error.response?.status, error.response?.data?.message || error.message);
        }

        // Test departments endpoint
        console.log('\n3. Testing /departments...');
        try {
            const departmentsResponse = await axios.get(`${API_BASE_URL}/departments`);
            console.log('✅ Departments endpoint working');
            console.log('Response structure:', Array.isArray(departmentsResponse.data) ? 'Array' : Object.keys(departmentsResponse.data));
            console.log('Sample data:', Array.isArray(departmentsResponse.data) ? departmentsResponse.data.slice(0, 2) : departmentsResponse.data.data?.slice(0, 2));
        } catch (error) {
            console.log('❌ Departments endpoint failed:', error.response?.status, error.response?.data?.message || error.message);
        }

    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

// Run the test
testChartEndpoints();
