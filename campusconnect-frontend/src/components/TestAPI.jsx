import { useState } from 'react';
import userApi from '../datasource/api-user';
import postApi from '../datasource/api-post';
import commentApi from '../datasource/api-comment';
import rsvpApi from '../datasource/api-rsvp';
import { isAuthenticated, getToken } from './auth/auth-helper';  // Fixed path

function TestAPI() {
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [testUser, setTestUser] = useState({
        firstName: 'Test',
        lastName: 'User',
        username: `testuser_${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        password: 'Test123456'
    });

    const addResult = (testName, success, data = null, error = null) => {
        setTestResults(prev => [{
            name: testName,
            success,
            data,
            error,
            timestamp: new Date().toLocaleTimeString()
        }, ...prev]);
    };

    const clearResults = () => {
        setTestResults([]);
    };

    // Test 1: Check if backend is reachable
    const testBackendConnection = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://campusconnect-backend-8tq2.onrender.com/api/health-check');
            if (response.ok) {
                const data = await response.json();
                addResult('Backend Connection', true, data);
            } else {
                addResult('Backend Connection', false, null, `HTTP ${response.status}`);
            }
        } catch (error) {
            addResult('Backend Connection', false, null, error.message);
        }
        setLoading(false);
    };

    // Test 2: User Registration
    const testRegister = async () => {
        setLoading(true);
        try {
            const response = await userApi.register(testUser);
            addResult('User Registration', true, response);
            localStorage.setItem('testUserId', response.user?._id);
        } catch (error) {
            addResult('User Registration', false, null, error.message);
        }
        setLoading(false);
    };

    // Test 3: User Login
    const testLogin = async () => {
        setLoading(true);
        try {
            const credentials = {
                email: testUser.email,
                password: testUser.password
            };
            const response = await userApi.signin(credentials);
            addResult('User Login', true, { token: 'Received' });
        } catch (error) {
            addResult('User Login', false, null, error.message);
        }
        setLoading(false);
    };

    // Test 4: Get Current User Profile
    const testGetProfile = async () => {
        setLoading(true);
        try {
            const profile = await userApi.getProfile();
            addResult('Get User Profile', true, profile);
        } catch (error) {
            addResult('Get User Profile', false, null, error.message);
        }
        setLoading(false);
    };

    // Test 5: Create a Post
    const testCreatePost = async () => {
        setLoading(true);
        try {
            const postData = {
                title: 'Test Post',
                content: 'This is a test post created via API test',
                category: 'General',
                status: 'published',
                location: 'Online',
                eventDate: new Date().toISOString()
            };
            const response = await postApi.createPost(postData);
            addResult('Create Post', true, response);
            localStorage.setItem('testPostId', response._id);
        } catch (error) {
            addResult('Create Post', false, null, error.message);
        }
        setLoading(false);
    };

    // Test 6: Get All Posts
    const testGetAllPosts = async () => {
        setLoading(true);
        try {
            const posts = await postApi.getAllPosts();
            addResult('Get All Posts', true, { count: posts.length });
        } catch (error) {
            addResult('Get All Posts', false, null, error.message);
        }
        setLoading(false);
    };

    // Test 7: Create a Comment
    const testCreateComment = async () => {
        setLoading(true);
        try {
            const postId = localStorage.getItem('testPostId');
            if (!postId) {
                addResult('Create Comment', false, null, 'No post ID found. Create a post first.');
                setLoading(false);
                return;
            }
            const commentData = {
                text: 'This is a test comment',
                post: postId
            };
            const response = await commentApi.createComment(commentData);
            addResult('Create Comment', true, response);
        } catch (error) {
            addResult('Create Comment', false, null, error.message);
        }
        setLoading(false);
    };

    // Test 8: Create RSVP
    const testCreateRSVP = async () => {
        setLoading(true);
        try {
            const postId = localStorage.getItem('testPostId');
            if (!postId) {
                addResult('Create RSVP', false, null, 'No post ID found. Create a post first.');
                setLoading(false);
                return;
            }
            const rsvpData = {
                event: postId,
                status: 'attending'
            };
            const response = await rsvpApi.createRSVP(rsvpData);
            addResult('Create RSVP', true, response);
        } catch (error) {
            addResult('Create RSVP', false, null, error.message);
        }
        setLoading(false);
    };

    // Test 9: Check Authentication Status
    const testAuthStatus = () => {
        const authenticated = isAuthenticated();
        const token = getToken();
        addResult('Auth Status', true, { 
            isAuthenticated: authenticated, 
            hasToken: !!token 
        });
    };

    // Test 10: Logout
    const testLogout = async () => {
        setLoading(true);
        try {
            await userApi.signout();
            addResult('Logout', true, { message: 'Logged out successfully' });
        } catch (error) {
            addResult('Logout', false, null, error.message);
        }
        setLoading(false);
    };

    // Run all tests in sequence
    const runAllTests = async () => {
        clearResults();
        setLoading(true);
        
        await testBackendConnection();
        await testRegister();
        await testLogin();
        await testGetProfile();
        await testCreatePost();
        await testGetAllPosts();
        await testCreateComment();
        await testCreateRSVP();
        testAuthStatus();
        await testLogout();
        
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">API Connection Tests</h1>
                
                <div className="flex gap-2 mb-4 flex-wrap">
                    <button
                        onClick={runAllTests}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? 'Running Tests...' : 'Run All Tests'}
                    </button>
                    <button
                        onClick={clearResults}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Clear Results
                    </button>
                </div>

                {/* Test User Info */}
                <div className="bg-gray-100 p-4 rounded mb-4">
                    <h3 className="font-semibold mb-2">Test User Credentials:</h3>
                    <p><strong>Email:</strong> {testUser.email}</p>
                    <p><strong>Password:</strong> {testUser.password}</p>
                    <p className="text-sm text-gray-600 mt-2">These credentials are generated automatically for each test run.</p>
                </div>
            </div>

            {/* Test Results */}
            <div className="space-y-2">
                <h2 className="text-xl font-semibold mb-2">Test Results:</h2>
                {testResults.length === 0 && (
                    <p className="text-gray-500">No tests run yet. Click "Run All Tests" to start.</p>
                )}
                {testResults.map((result, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded border ${
                            result.success 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-red-50 border-red-200'
                        }`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <strong className={result.success ? 'text-green-700' : 'text-red-700'}>
                                    {result.name}
                                </strong>
                                <span className="text-sm text-gray-500 ml-2">
                                    {result.timestamp}
                                </span>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${
                                result.success 
                                    ? 'bg-green-200 text-green-800' 
                                    : 'bg-red-200 text-red-800'
                            }`}>
                                {result.success ? 'PASSED' : 'FAILED'}
                            </span>
                        </div>
                        {result.data && (
                            <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto">
                                {JSON.stringify(result.data, null, 2)}
                            </pre>
                        )}
                        {result.error && (
                            <div className="mt-2 text-red-600 text-sm">
                                Error: {result.error}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TestAPI;