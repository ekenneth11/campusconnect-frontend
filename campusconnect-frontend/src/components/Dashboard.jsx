import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../datasource/auth-helper';
import userApi from '../datasource/api-user';
import postApi from '../datasource/api-post';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!isAuthenticated()) {
                    navigate('/signin');
                    return;
                }
                
                const userData = await userApi.getProfile();
                setUser(userData);
                
                const postsData = await postApi.getAllPosts();
                setPosts(postsData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [navigate]);

    const handleLogout = async () => {
        await userApi.signout();
        navigate('/signin');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center text-gray-600">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <button 
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Logout
                    </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Profile Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Profile Information</h2>
                        {user && (
                            <div className="space-y-3">
                                <p className="text-gray-700"><strong className="text-gray-800">Name:</strong> {user.firstName} {user.lastName}</p>
                                <p className="text-gray-700"><strong className="text-gray-800">Username:</strong> {user.username}</p>
                                <p className="text-gray-700"><strong className="text-gray-800">Email:</strong> {user.email}</p>
                                <p className="text-gray-700"><strong className="text-gray-800">Role:</strong> <span className="capitalize">{user.role}</span></p>
                            </div>
                        )}
                    </div>
                    
                    {/* Posts Section */}
                    <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Posts</h2>
                        {posts.length > 0 ? (
                            <div className="space-y-4">
                                {posts.slice(0, 5).map((post) => (
                                    <div key={post._id} className="border-b border-gray-200 pb-4 last:border-0">
                                        <h3 className="font-semibold text-gray-800 mb-1">{post.title}</h3>
                                        <p className="text-gray-600 mb-2">{post.content}</p>
                                        <div className="flex gap-3 text-sm text-gray-500">
                                            <span>Category: {post.category}</span>
                                            <span>Status: {post.status}</span>
                                            {post.location && <span>Location: {post.location}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No posts available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;