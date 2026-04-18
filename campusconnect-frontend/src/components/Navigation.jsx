import { NavLink, useNavigate } from 'react-router-dom';
import { isAdmin, isAuthenticated } from '../datasource/auth-helper';
import userApi from '../datasource/api-user';

function Navigation() {
    const navigate = useNavigate();
    const authenticated = isAuthenticated();
    const admin = isAdmin();

    const handleLogout = async () => {
        await userApi.signout();
        navigate('/signin');
    };

    const getLinkClass = ({ isActive }) => `block rounded-xl px-4 py-3 text-lg font-medium transition-colors ${
        isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-900 hover:text-white'
    }`;

    return (
        <nav className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-800 bg-black p-5 text-white">
            <div className="mb-8 px-2 text-3xl font-semibold">CC</div>

            <div className="space-y-2">
                {!authenticated && (
                    <NavLink to="/" className={getLinkClass}>
                        Home
                    </NavLink>
                )}

                {authenticated && (
                    <NavLink to="/dashboard" className={getLinkClass}>
                        Home
                    </NavLink>
                )}

                {authenticated && admin && (
                    <NavLink to="/activities" className={getLinkClass}>
                        Activities
                    </NavLink>
                )}

                {authenticated && (
                    <NavLink to="/test-api" className={getLinkClass}>
                        Test API
                    </NavLink>
                )}

                {!authenticated && (
                    <NavLink to="/signin" className={getLinkClass}>
                        Login
                    </NavLink>
                )}

                {!authenticated && (
                    <NavLink to="/register" className={getLinkClass}>
                        Register
                    </NavLink>
                )}
            </div>

            {authenticated && (
                <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-auto rounded-full bg-gray-200 px-5 py-3 text-lg font-semibold text-gray-900 hover:bg-white"
                >
                    Logout
                </button>
            )}
        </nav>
    );
}

export default Navigation;