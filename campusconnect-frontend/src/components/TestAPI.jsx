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
        
        // Test all possible route patterns
        const routes = [
            '/',
            '/api',
            '/api/health-check',
            '/health-check',
            '/api/users',
            '/users',
            '/api/users/register',
            '/users/register',
            '/api/users/signin',
            '/users/signin',
            '/api/auth/register',
            '/auth/register',
            '/api/auth/signin',
            '/auth/signin',
            '/api/register',
            '/register',
            '/api/login',
            '/login',
            '/api/signup',
            '/signup',
            '/api/posts',
            '/posts',
            '/api/comments',
            '/comments',
            '/api/rsvps',
            '/rsvps'
        ];
        
        for (const route of routes) {
            try {
                const res = await fetch(`${API_URL}${route}`);
                if (res.ok) {
                    const data = await res.json();
                    addResult(`✅ Found: ${route}`, true, data, null);
                } else {
                    addResult(`❌ ${route}`, false, null, `HTTP ${res.status}`);
                }
            } catch (err) {
                addResult(`❌ ${route}`, false, null, err.message);
            }
        }
        
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-4">API Route Discovery</h1>
                <p className="text-gray-600 mb-2">
                    Testing backend at: <code className="bg-gray-100 px-2 py-1 rounded">https://campusconnect-backend-8tq2.onrender.com</code>
                </p>
                <p className="text-gray-500 text-sm mb-4">
                    This will test all possible route patterns to find where your API endpoints are
                </p>
                
                <button
                    onClick={runTests}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mb-6"
                >
                    {loading ? 'Searching Routes...' : 'Find All API Routes'}
                </button>
                
                {results.length === 0 && !loading && (
                    <div className="text-center text-gray-500 py-8">
                        Click the button to discover all working API routes
                    </div>
                )}
                
                {results.map((result, i) => (
                    <div key={i} className={`mb-2 p-2 rounded border text-sm ${result.success ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                        <span className={result.success ? 'text-green-700 font-mono' : 'text-gray-500 font-mono'}>
                            {result.name}
                        </span>
                        {result.success && result.data && (
                            <details className="mt-1">
                                <summary className="text-xs text-gray-500 cursor-pointer">Response</summary>
                                <pre className="text-xs mt-1 bg-white p-2 rounded overflow-auto max-h-32">
                                    {result.data}
                                </pre>
                            </details>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TestAPI;