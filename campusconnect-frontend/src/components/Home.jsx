import { Link } from 'react-router-dom';
import { isAuthenticated } from '../datasource/auth-helper';

function Home() {
    const authenticated = isAuthenticated();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        Welcome to CampusConnect
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Connect with your campus community, share events, and stay updated with everything happening around you.
                    </p>
                    
                    <div className="space-x-4">
                        {!authenticated ? (
                            <>
                                <Link 
                                    to="/signin" 
                                    className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <Link 
                                to="/dashboard" 
                                className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors"
                            >
                                Go to Dashboard
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;