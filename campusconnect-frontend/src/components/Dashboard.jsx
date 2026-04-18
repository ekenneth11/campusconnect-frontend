import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../datasource/auth-helper';
import userApi from '../datasource/api-user';
import postApi from '../datasource/api-post';
import commentApi from '../datasource/api-comment';
import rsvpApi from '../datasource/api-rsvp';
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
    const [hiddenPostIds, setHiddenPostIds] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const currentUser = getCurrentUser();
    const currentUserId = currentUser?._id || currentUser?.id || currentUser?.userId;

    const normalizeList = (response, keys = []) => {
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.data)) return response.data;
        for (const key of keys) {
            if (Array.isArray(response?.[key])) return response[key];
        }
        return [];
    };

    const loadPostsWithCounts = async ({ showError = false } = {}) => {
        try {
            const postsData = await postApi.getAllPosts();
            const postList = postsData?.data || [];

            const enrichedPosts = await Promise.all(
                postList.map(async (post) => {
                    if (!post?._id) {
                        return post;
                    }

                    const [commentsResult, rsvpResult] = await Promise.all([
                        commentApi.getCommentsByPost(post._id).catch(() => null),
                        post.category === 'event'
                            ? rsvpApi.getRSVPsByEvent(post._id).catch(() => null)
                            : Promise.resolve(null),
                    ]);

                    const comments = normalizeList(commentsResult, ['comments']);
                    const rsvps = normalizeList(rsvpResult, ['rsvps']);

                    return {
                        ...post,
                        commentCount: comments.length,
                        rsvpCount: post.category === 'event' ? rsvps.length : 0,
                    };
                })
            );

            setPosts(enrichedPosts);
            if (showError) {
                setError('');
            }
        } catch (postsError) {
            console.error('Posts fetch error:', postsError);
            if (showError) {
                setError('Failed to load posts. Please try refreshing the page.');
            }
        }
    };

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

                await loadPostsWithCounts({ showError: true });

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Failed to load dashboard data. Please try refreshing the page.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    useEffect(() => {
        if (!isAuthenticated()) {
            return;
        }

        const refreshCounts = () => {
            loadPostsWithCounts();
        };

        const onVisibilityChange = () => {
            if (!document.hidden) {
                refreshCounts();
            }
        };

        const intervalId = window.setInterval(refreshCounts, 10000);
        window.addEventListener('focus', refreshCounts);
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            window.clearInterval(intervalId);
            window.removeEventListener('focus', refreshCounts);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, []);

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

    const toDateInputValue = (value) => {
        if (!value) return '';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        return date.toISOString().slice(0, 10);
    };

    const handleEditPost = (post) => {
        setCurrentPost({
            ...post,
            eventDate: toDateInputValue(post?.eventDate),
        });
        setShowPostModal(true);
    };

    const handleDeletePost = async (postId) => {
        try {
            await postApi.deletePost(postId);
            setPosts((prev) => prev.filter((post) => post._id !== postId));
        } catch (deleteError) {
            console.error('Error deleting post:', deleteError);
            setError(deleteError.message || 'Failed to delete post.');
        }
    };

    const handleHidePost = (postId) => {
        setHiddenPostIds((prev) => (prev.includes(postId) ? prev : [...prev, postId]));
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

            if (currentPost._id) {
                await postApi.updatePost(currentPost._id, payload);
            } else {
                await postApi.createPost(payload);
            }

            await loadPostsWithCounts({ showError: true });
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

    const visiblePosts = posts.filter((post) => !hiddenPostIds.includes(post._id));
    const categoryOptions = [...new Set(visiblePosts.map((post) => post?.category).filter(Boolean))].sort();
    const filteredPosts = selectedCategory === 'all'
        ? visiblePosts
        : visiblePosts.filter((post) => String(post?.category || '').toLowerCase() === selectedCategory.toLowerCase());

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

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Home</h1>
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
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Recent Posts</h2>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All categories</option>
                                {categoryOptions.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        {filteredPosts.length > 0 ? (
                            <div className="space-y-5">
                                {filteredPosts.map((post) => {
                                    const postAuthorId = post?.author?._id || post?.author?.id || post?.authorId;
                                    const isOwnPost = postAuthorId === currentUserId;
                                    const actionItems = isOwnPost
                                        ? [
                                            { label: 'Edit', onClick: () => handleEditPost(post) },
                                            { label: 'Delete', danger: true, onClick: () => handleDeletePost(post._id) },
                                        ]
                                        : [
                                            { label: 'Hide', onClick: () => handleHidePost(post._id) },
                                        ];

                                    return (
                                        <PostCard key={post._id} post={post} actionItems={actionItems} />
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No posts available for this category.</p>
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