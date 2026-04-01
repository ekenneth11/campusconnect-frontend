import { useState } from 'react';

function TestAPI() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const addResult = (name, success, data, error) => {
        setResults(prev => [{
            name,
            success,
            data: data ? JSON.stringify(data, null, 2) : null,
            error,
            time: new Date().toLocaleTimeString()
        }, ...prev]);
    };

    const runTests = async () => {
        setLoading(true);
        setResults([]);
        
        const API_URL = 'https://campusconnect-backend-8tq2.onrender.com';
        
        // Test 1: Root
        try {
            const res = await fetch(`${API_URL}/`);
            const data = await res.json();
            addResult('Root (/)', true, data, null);
        } catch (err) {
            addResult('Root (/)', false, null, err.message);
        }
        
        // Test 2: Register
        const testUser = {
            firstName: 'Test',
            lastName: 'User',
            username: `test_${Date.now()}`,
            email: `test_${Date.now()}@example.com`,
            password: 'Test123456'
        };
        
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testUser)
            });
            const data = await res.json();
            addResult('Register /auth/register', res.ok, data, null);
            
            if (res.ok && data.token) {
                sessionStorage.setItem('token', data.token);
                
                // Test 3: Login
                const loginRes = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: testUser.email, password: testUser.password })
                });
                const loginData = await loginRes.json();
                addResult('Login /auth/login', loginRes.ok, loginData, null);
            }
        } catch (err) {
            addResult('Register /auth/register', false, null, err.message);
        }
        
        // Test 4: Get Posts
        try {
            const res = await fetch(`${API_URL}/api/posts`);
            const data = await res.json();
            addResult('GET /api/posts', res.ok, data, null);
        } catch (err) {
            addResult('GET /api/posts', false, null, err.message);
        }
        
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
                <p className="text-gray-600 mb-4">
                    Testing backend at: <code className="bg-gray-100 px-2 py-1 rounded">https://campusconnect-backend-8tq2.onrender.com</code>
                </p>
                
                <button
                    onClick={runTests}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mb-6"
                >
                    {loading ? 'Running Tests...' : 'Run All Tests'}
                </button>
                
                {results.length === 0 && !loading && (
                    <div className="text-center text-gray-500 py-8">
                        Click "Run All Tests" to test the API connection
                    </div>
                )}
                
                {results.map((result, i) => (
                    <div key={i} className={`mb-3 p-3 rounded border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex justify-between items-start">
                            <strong className={result.success ? 'text-green-700' : 'text-red-700'}>
                                {result.name}
                            </strong>
                            <span className="text-xs text-gray-500">{result.time}</span>
                        </div>
                        {result.success ? (
                            <pre className="text-xs mt-2 bg-white p-2 rounded overflow-auto max-h-40">
                                {result.data}
                            </pre>
                        ) : (
                            <div className="text-red-600 text-sm mt-1">
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