import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated } from '../datasource/auth-helper';
import postApi from '../datasource/api-post';
import activityLogApi from '../datasource/api-activityLog';
import postModel from '../datasource/postModel';
import PostForm from './PostForm';

function Profile() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = getCurrentUser();
    const currentUserId = currentUser?._id || currentUser?.id || currentUser?.userId;

    const [loading, setLoading] = useState(true);
    const [showPostModal, setShowPostModal] = useState(false);
    const [currentPost, setCurrentPost] = useState(new postModel());
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [myPosts, setMyPosts] = useState([]);
    const [myActivities, setMyActivities] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [openMenuPostId, setOpenMenuPostId] = useState(null);
    const menuRef = useRef(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        bio: '',
        profilePicture: '',
    });

    const myPostCount = useMemo(() => myPosts.length, [myPosts]);
    const myActivityCount = useMemo(() => myActivities.length, [myActivities]);

    useEffect(() => {
        const loadProfilePage = async () => {
            if (!isAuthenticated()) {
                navigate('/signin');
                return;
            }

            setLoading(true);
            setError('');

            try {
                const [postResponse, activityResponse] = await Promise.all([
                    postApi.getAllPosts(),
                    activityLogApi.getMyActivities().catch(() => null),
                ]);

                const profile = currentUser || {};
                setFormData({
                    firstName: profile.firstName || '',
                    lastName: profile.lastName || '',
                    username: profile.username || '',
                    email: profile.email || '',
                    bio: profile.bio || '',
                    profilePicture: profile.profilePicture || profile.avatar || profile.photo || profile.image || '',
                });

                const allPosts = Array.isArray(postResponse?.data)
                    ? postResponse.data
                    : Array.isArray(postResponse)
                        ? postResponse
                        : [];

                const ownPosts = allPosts.filter((post) => {
                    const authorId = typeof post?.author === 'string'
                        ? post.author
                        : post?.author?._id || post?.author?.id || post?.authorId;
                    return authorId && currentUserId && String(authorId) === String(currentUserId);
                });

                const enrichedOwnPosts = ownPosts.map((post) => {
                    const commentCount = post?.commentCount ?? (Array.isArray(post?.comments) ? post.comments.length : 0);
                    const rsvpCount = post?.rsvpCount ?? (Array.isArray(post?.rsvps) ? post.rsvps.length : 0);

                    return {
                        ...post,
                        commentCount,
                        rsvpCount: post?.category === 'event' ? rsvpCount : 0,
                    };
                });

                setMyPosts(enrichedOwnPosts);

                const normalizedActivities = Array.isArray(activityResponse)
                    ? activityResponse
                    : activityResponse?.activities || activityResponse?.data || activityResponse?.logs || activityResponse?.activityLogs || [];
                setMyActivities(Array.isArray(normalizedActivities) ? normalizedActivities : []);
            } catch (loadError) {
                console.error('Failed to load profile page:', loadError);
                setError(loadError.message || 'Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };

        loadProfilePage();
    }, [currentUserId, navigate]);

    useEffect(() => {
        if (location.state?.openPostModal) {
            setShowPostModal(true);
            navigate('/profile', { replace: true, state: null });
        }
    }, [location.state, navigate]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!openMenuPostId) {
                return;
            }

            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuPostId(null);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('touchstart', handleOutsideClick);
        };
    }, [openMenuPostId]);

    const handleOpenPost = (post) => {
        if (!post?._id) return;
        navigate(`/posts/${post._id}`, { state: { post, from: '/profile' } });
    };

    const formatActivityDate = (value) => {
        if (!value) return 'N/A';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return 'N/A';
        return date.toLocaleString();
    };

    const toDateInputValue = (value) => {
        if (!value) return '';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        return date.toISOString().slice(0, 10);
    };

    const handlePostChange = (e) => {
        const { name, value } = e.target;
        setCurrentPost((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePostHide = () => {
        setShowPostModal(false);
        setCurrentPost(new postModel());
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
            setMyPosts((prev) => prev.filter((post) => post._id !== postId));
            setSuccess('Post deleted successfully.');
        } catch (deleteError) {
            console.error('Failed to delete post:', deleteError);
            setError(deleteError.message || 'Failed to delete post.');
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const payload = {
                title: currentPost.title,
                content: currentPost.content,
                category: currentPost.category,
                location: currentPost.location || undefined,
                eventDate: currentPost.eventDate || undefined,
                author: currentUserId,
            };

            if (currentPost?._id) {
                await postApi.updatePost(currentPost._id, payload);
                setSuccess('Post updated successfully.');
            } else {
                await postApi.createPost(payload);
                setSuccess('Post created successfully.');
            }

            handlePostHide();
            window.location.reload();
        } catch (submitError) {
            console.error('Failed to save post:', submitError);
            setError(submitError.message || 'Failed to save post.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen rounded-xl bg-black p-6 shadow-sm">
                <p className="text-gray-300">Loading profile...</p>
            </div>
        );
    }

    const fullName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || formData.username || 'User';
    const usernameHandle = formData.username ? `@${formData.username}` : '@user';
    const joinedDate = new Date(currentUser?.iat ? currentUser.iat * 1000 : Date.now()).toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="-mx-4 min-h-screen space-y-6 bg-black px-4 py-4 text-white sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="overflow-hidden rounded-2xl border border-gray-800 bg-black text-white shadow-sm">
                <div className="h-40 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700" />

                <div className="relative px-6 pb-6 pt-20 sm:pt-24">
                    <div className="absolute -top-16 left-6 h-32 w-32 overflow-hidden rounded-full border-4 border-black bg-gray-700 sm:h-36 sm:w-36">
                        {formData.profilePicture ? (
                            <img
                                src={formData.profilePicture}
                                alt="Profile"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-white">
                                {(fullName[0] || 'U').toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold">{fullName}</h1>
                        <p className="mt-1 text-lg text-gray-300">{usernameHandle}</p>
                        <p className="mt-4 text-xl text-gray-100">{formData.bio || 'No bio yet.'}</p>
                        <p className="mt-3 text-gray-400">Joined {joinedDate}</p>
                        <p className="mt-2 text-gray-200">
                            <span className="font-semibold">{myPostCount}</span> Posts
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="rounded-lg border border-red-900 bg-red-950 px-4 py-3 text-red-200">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-lg border border-green-900 bg-green-950 px-4 py-3 text-green-200">
                    {success}
                </div>
            )}

            <div className="rounded-xl border border-gray-800 bg-black p-6 shadow-sm">
                <div className="mb-5 border-b border-gray-800">
                    <nav className="flex items-center">
                        <button
                            type="button"
                            onClick={() => setActiveTab('posts')}
                            className={`relative px-5 py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${activeTab === 'posts' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
                        >
                            Posts
                            {activeTab === 'posts' && <span className="absolute inset-x-0 bottom-0 h-1 rounded-full bg-blue-500" />}
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('activities')}
                            className={`relative px-5 py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${activeTab === 'activities' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
                        >
                            Activities
                            {activeTab === 'activities' && <span className="absolute inset-x-0 bottom-0 h-1 rounded-full bg-blue-500" />}
                        </button>
                    </nav>
                </div>

                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">{activeTab === 'posts' ? 'My Posts' : 'My Activities'}</h2>
                    <span className="rounded-full bg-gray-900 px-3 py-1 text-sm text-gray-200">
                        {activeTab === 'posts' ? myPostCount : myActivityCount} total
                    </span>
                </div>

                {activeTab === 'posts' && (myPosts.length > 0 ? (
                    <div className="space-y-3">
                        {myPosts.map((post) => (
                            <article
                                key={post._id}
                                className="relative cursor-pointer rounded-xl border border-gray-800 bg-black px-5 py-4 transition hover:bg-gray-950"
                                role="button"
                                tabIndex={0}
                                onClick={() => handleOpenPost(post)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleOpenPost(post);
                                    }
                                }}
                            >
                                <div className="absolute right-3 top-3" ref={openMenuPostId === post._id ? menuRef : null}>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenMenuPostId((prev) => (prev === post._id ? null : post._id));
                                        }}
                                        className="rounded-md px-2 py-1 text-lg font-bold leading-none text-gray-400 hover:bg-gray-900"
                                        aria-label="Post actions"
                                    >
                                        ...
                                    </button>

                                    {openMenuPostId === post._id && (
                                        <div className="post-card-menu absolute right-0 z-10 mt-1 min-w-[130px] rounded-md py-1 shadow-md">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuPostId(null);
                                                    handleEditPost(post);
                                                }}
                                                className="post-card-menu-item block w-full px-3 py-2 text-left text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuPostId(null);
                                                    handleDeletePost(post._id);
                                                }}
                                                className="post-card-menu-item post-card-menu-item-danger block w-full px-3 py-2 text-left text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">{post?.category || 'General'}</p>
                                <h3 className="text-lg font-semibold text-white pr-12">{post?.title || 'Untitled post'}</h3>
                                <p className="mt-1 text-sm text-gray-300 whitespace-pre-wrap">{post?.content || ''}</p>
                                <div className="mt-3 flex gap-5 text-sm text-gray-400">
                                    <span>{post?.rsvpCount || 0} RSVP</span>
                                    <span>{post?.commentCount || 0} Comments</span>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">You have not created any posts yet.</p>
                ))}

                {activeTab === 'activities' && (myActivities.length > 0 ? (
                    <div className="space-y-3">
                        {myActivities.map((activity, index) => (
                            <article
                                key={activity?._id || `${activity?.action || 'activity'}-${index}`}
                                className="rounded-xl border border-gray-800 bg-black px-5 py-4"
                            >
                                <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">{activity?.action || 'Activity'}</p>
                                <h3 className="text-base font-semibold text-white">{activity?.target || 'No target details'}</h3>
                                <p className="mt-2 text-sm text-gray-400">{formatActivityDate(activity?.createdAt || activity?.timestamp)}</p>
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">No activities found for this user.</p>
                ))}
            </div>

            <PostForm
                showPostModal={showPostModal}
                handleHide={handlePostHide}
                currentPost={currentPost}
                setCurrentPost={setCurrentPost}
                handleSubmit={handlePostSubmit}
                user={{
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    role: currentUser?.role || 'member',
                }}
                handleChange={handlePostChange}
            />
        </div>
    );
}

export default Profile;
