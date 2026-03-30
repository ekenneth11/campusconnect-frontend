import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../api/auth-helper';
import userApi from '../api/api-user';
import postApi from '../api/api-post';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

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
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <button 
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl mb-4">Profile</h2>
                    {user && (
                        <div>
                            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Role:</strong> {user.role}</p>
                        </div>
                    )}
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
                    <h2 className="text-xl mb-4">Recent Posts</h2>
                    {posts.length > 0 ? (
                        <div className="space-y-4">
                            {posts.slice(0, 5).map((post) => (
                                <div key={post._id} className="border-b pb-3">
                                    <h3 className="font-semibold">{post.title}</h3>
                                    <p className="text-sm text-gray-600">{post.content}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Category: {post.category} | Status: {post.status}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No posts available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;