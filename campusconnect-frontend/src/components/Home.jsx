import { Link } from 'react-router-dom';
import { isAuthenticated } from '../datasource/auth-helper';
import campusConnectLogo from '../assets/campusconnect-logo.png';

function Home() {
    const authenticated = isAuthenticated();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center">
                    {!authenticated && (
                        <img
                            src={campusConnectLogo}
                            alt="CampusConnect"
                            className="mx-auto mb-8 h-20 w-auto"
                        />
                    )}

                    <h1 className="mb-4 text-5xl font-bold !text-gray-900">
                        Welcome to CampusConnect
                    </h1>
                    <p className="mx-auto mb-8 max-w-2xl text-xl !text-gray-700">
                        Connect with your campus community, share events, and stay updated with everything happening around you.
                    </p>

                    <div className="flex items-center justify-center gap-4">
                        {!authenticated ? (
                            <>
                                <Link
                                    to="/signin"
                                    className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white no-underline hover:bg-blue-700"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="inline-block rounded-lg bg-green-600 px-8 py-3 text-lg font-semibold text-white no-underline hover:bg-green-700"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <Link
                                to="/dashboard"
                                className="inline-block rounded-lg bg-purple-600 px-8 py-3 text-lg font-semibold text-white no-underline hover:bg-purple-700"
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