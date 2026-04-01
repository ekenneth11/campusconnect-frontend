import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../datasource/auth-helper';
import userApi from '../datasource/api-user';

function Navigation() {
    const navigate = useNavigate();
    const authenticated = isAuthenticated();

    const handleLogout = async () => {
        await userApi.signout();
        navigate('/signin');
    };

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex space-x-4">
                    <Link to="/" className="hover:text-gray-300">Home</Link>
                    {authenticated && (
                        <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
                    )}
                    <Link to="/test-api" className="hover:text-gray-300">Test API</Link>
                </div>
                <div>
                    {!authenticated ? (
                        <Link to="/signin" className="hover:text-gray-300">Login</Link>
                    ) : (
                        <button onClick={handleLogout} className="hover:text-gray-300">
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navigation;