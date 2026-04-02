import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import userApi from '../../datasource/api-user';

function SignIn() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const from = location.state?.from?.pathname || '/dashboard';

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            setError('Please enter both email and password');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            console.log('Attempting login with:', { email: formData.email });
            const response = await userApi.signin({
                username: formData.email,
                password: formData.password
            });
            
            console.log('Login response received:', response);
            
            // Check if we got a token
            if (response && response.token) {
                console.log('Token received, redirecting to dashboard...');
                // Force navigation to dashboard
                navigate('/dashboard', { replace: true });
            } else {
                console.error('No token in response:', response);
                setError('Login failed: No token received');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Invalid email or password');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="text-gray-600 mt-2">Sign in to your account</p>
                </div>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <LogIn className="w-5 h-5" />
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignIn;