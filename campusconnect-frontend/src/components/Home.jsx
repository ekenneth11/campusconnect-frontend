import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="p-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to CampusConnect</h1>
            <p className="mb-4">Connect with your campus community</p>
            <div className="space-x-4">
                <Link to="/signin" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Login
                </Link>
                <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Register
                </Link>
            </div>
        </div>
    );
}

export default Home;