import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../datasource/auth-helper';
import userApi from '../datasource/api-user';
import postApi from '../datasource/api-post';
import postModel from '../datasource/postModel';
import PostForm from './PostForm';
import PostCard from './PostCard';
function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPost, setCurrentPost] = useState(new postModel());
    const [showPostModal, setShowPostModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check if user is authenticated
                if (!isAuthenticated()) {
                    console.log('Not authenticated, redirecting to signin');
                    navigate('/signin');
                    return;
                }

                console.log('Fetching dashboard data...');

                // Get user from token first
                const tokenUser = getCurrentUser();
                console.log('User from token:', tokenUser);

                // Try to get profile from API
                try {
                    const userData = await userApi.getProfile();
                    setUser(userData);
                    console.log('User profile loaded:', userData);
                } catch (profileError) {
                    console.error('Profile fetch error:', profileError);
                    // Fallback to token data
                    if (tokenUser) {
                        setUser({
                            firstName: tokenUser.firstName || 'User',
                            lastName: tokenUser.lastName || '',
                            username: tokenUser.username,
                            email: tokenUser.email,
                            role: tokenUser.role || 'student'
                        });
                    } else {
                        setUser({
                            firstName: 'User',
                            lastName: '',
                            username: 'user',
                            email: '',
                            role: 'student'
                        });
                    }
                }

                // Fetch posts
                try {
                    const postsData = await postApi.getAllPosts();
                    setPosts(postsData.data || []);
                    console.log('Posts loaded:', postsData);
                } catch (postsError) {
                    console.error('Posts fetch error:', postsError);
                    setPosts([]);
                }

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Failed to load dashboard data. Please try refreshing the page.');
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentPost((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleHide = () => {
        setShowPostModal(false);
        setCurrentPost(new postModel());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const payload = {
                title: currentPost.title,
                content: currentPost.content,
                category: currentPost.category,
                location: currentPost.location || undefined,
                eventDate: currentPost.eventDate || undefined,
                author: user?._id
            };

            await postApi.createPost(payload);

            const postsData = await postApi.getAllPosts();
            setPosts(postsData.data || []);
            setShowPostModal(false);
            setCurrentPost(new postModel());
        } catch (submitError) {
            console.error('Error creating post:', submitError);
            setError(submitError.message || 'Failed to create post.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center text-gray-600">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
                        {error}
                        <button
                            onClick={() => window.location.reload()}
                            className="ml-4 text-blue-600 hover:text-blue-800 underline"
                        >
                            Refresh
                        </button>
                    </div>
                )}

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
                                <p className="text-gray-700">
                                    <strong className="text-gray-800">Name:</strong> {user.firstName} {user.lastName}
                                </p>
                                <p className="text-gray-700">
                                    <strong className="text-gray-800">Username:</strong> {user.username}
                                </p>
                                <p className="text-gray-700">
                                    <strong className="text-gray-800">Email:</strong> {user.email}
                                </p>
                                <p className="text-gray-700">
                                    <strong className="text-gray-800">Role:</strong> <span className="capitalize">{user.role}</span>
                                </p>
                                <div className='flex justify-center items-center'>
                                    <button
                                        type='button'
                                        className='btn btn-primary px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                                        onClick={() => setShowPostModal(true)}>
                                        Post
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Posts Section */}
                    <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Posts</h2>
                        {posts.length > 0 ? (
                            <div className="space-y-5">
                                {posts.map((post) => (
                                    <PostCard key={post._id} post={post} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No posts available.</p>
                        )}
                    </div>
                </div>

                <PostForm
                    showPostModal={showPostModal}
                    handleHide={handleHide}
                    currentPost={currentPost}
                    setCurrentPost={setCurrentPost}
                    handleSubmit={handleSubmit}
                    user={user}
                    handleChange={handleChange}
                />
            </div>
        </div>
    );
}

export default Dashboard;