import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, isAdmin, isAuthenticated } from '../datasource/auth-helper';
import userApi from '../datasource/api-user';
import campusConnectLogo from '../assets/campusconnect-logo.png';

function Navigation() {
    const navigate = useNavigate();
    const location = useLocation();
    const authenticated = isAuthenticated();
        const postTargetPath = location.pathname === '/profile' ? '/profile' : '/dashboard';

    const admin = isAdmin();
    const currentUser = getCurrentUser();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileMenuRef = useRef(null);

    const displayName = currentUser?.firstName
        ? `${currentUser.firstName} ${currentUser?.lastName || ''}`.trim()
        : currentUser?.username || 'User';
    const displayHandle = currentUser?.username ? `@${currentUser.username}` : '@user';
    const initials = (displayName?.[0] || 'U').toUpperCase();

    const handleLogout = async () => {
        setShowProfileMenu(false);
        await userApi.signout();
        navigate('/signin');
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!showProfileMenu) {
                return;
            }

            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('touchstart', handleOutsideClick);
        };
    }, [showProfileMenu]);

    const getLinkClass = ({ isActive }) => `app-nav-link block rounded-xl px-4 py-3 text-lg font-medium no-underline hover:no-underline transition-colors ${
        isActive ? 'app-nav-link-active' : ''
    }`;

    return (
        <nav className="app-sidebar sticky top-6 flex h-[calc(100vh-3rem)] flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-8 px-2">
                <img
                    src={campusConnectLogo}
                    alt="CampusConnect"
                    className="h-10 w-auto"
                />
            </div>

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
                    <NavLink to="/profile" className={getLinkClass}>
                        Profile
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
                    onClick={() => navigate(postTargetPath, { state: { openPostModal: true } })}
                    className="mt-4 w-full rounded-[50px] bg-blue-600 px-5 py-3 text-lg font-semibold text-white hover:bg-blue-700"
                >
                    Post
                </button>
            )}

            {authenticated && (
                <div ref={profileMenuRef} className="relative mt-auto">
                    <button
                        type="button"
                        onClick={() => setShowProfileMenu((prev) => !prev)}
                        className="flex w-full items-center justify-between rounded-xl bg-gray-50 px-3 py-2 hover:bg-gray-100"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                                {initials}
                            </div>
                            <div className="text-left leading-tight">
                                <p className="m-0 text-sm font-semibold text-gray-900">{displayName}</p>
                                <p className="m-0 text-sm text-gray-500">{displayHandle}</p>
                            </div>
                        </div>
                        <span className="text-xl text-gray-500">...</span>
                    </button>

                    {showProfileMenu && (
                        <div className="absolute bottom-14 left-0 right-0 z-20 rounded-xl border border-gray-200 p-2 shadow-lg">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navigation;