import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import postApi from '../datasource/api-post';
import commentApi from '../datasource/api-comment';
import rsvpApi from '../datasource/api-rsvp';
import { getCurrentUser } from '../datasource/auth-helper';

function PostDetails() {
    const navigate = useNavigate();
    const { postId } = useParams();
    const location = useLocation();

    const [post, setPost] = useState(location.state?.post || null);
    const [loading, setLoading] = useState(!location.state?.post);
    const [error, setError] = useState('');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commentSubmitting, setCommentSubmitting] = useState(false);
    const [rsvps, setRsvps] = useState([]);
    const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
    const [actionError, setActionError] = useState('');
    const [openCommentMenuId, setOpenCommentMenuId] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState('');

    const currentUser = getCurrentUser();
    const currentUserId = currentUser?._id || currentUser?.id || currentUser?.userId;

    const getEntityId = (value) => {
        if (!value) return null;
        if (typeof value === 'string') return value;
        return value._id || value.id || null;
    };

    const normalizeList = (response) => {
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.comments)) return response.comments;
        if (Array.isArray(response?.rsvps)) return response.rsvps;
        return [];
    };

    useEffect(() => {
        const fetchPost = async () => {
            if (!postId) {
                setError('Missing post id.');
                setLoading(false);
                return;
            }

            try {
                const postData = await postApi.getPostById(postId);
                setPost(postData.data || postData);
            } catch (fetchError) {
                console.error('Failed to load post details:', fetchError);
                setError(fetchError.message || 'Failed to load post details.');
            } finally {
                setLoading(false);
            }
        };

        if (!post) {
            fetchPost();
        }
    }, [postId, post]);

    useEffect(() => {
        const fetchCommentsAndRsvps = async () => {
            if (!postId) {
                return;
            }

            try {
                const commentsResponse = await commentApi.getCommentsByPost(postId);
                setComments(normalizeList(commentsResponse));
            } catch (fetchError) {
                console.error('Failed to load comments:', fetchError);
            }

            try {
                const rsvpsResponse = await rsvpApi.getRSVPsByEvent(postId);
                setRsvps(normalizeList(rsvpsResponse));
            } catch (fetchError) {
                console.error('Failed to load RSVPs:', fetchError);
                setRsvps([]);
            }
        };

        fetchCommentsAndRsvps();
    }, [postId]);

    const userRsvp = rsvps.find((rsvp) => getEntityId(rsvp?.user) === currentUserId);
    const currentUserRole = currentUser?.role;

    const goingCount = rsvps.filter((rsvp) => rsvp?.status === 'going').length;
    const interestedCount = rsvps.filter((rsvp) => rsvp?.status === 'interested').length;
    const notGoingCount = rsvps.filter((rsvp) => rsvp?.status === 'not going').length;

    const handleAddComment = async (e) => {
        e.preventDefault();
        const trimmed = newComment.trim();
        if (!trimmed || !currentUserId || !postId) {
            return;
        }

        setCommentSubmitting(true);
        try {
            const created = await commentApi.createComment(postId, {
                text: trimmed,
            });

            const createdComment = created?.data || created;
            if (createdComment && createdComment._id) {
                setComments((prev) => [createdComment, ...prev]);
            } else {
                const commentsResponse = await commentApi.getCommentsByPost(postId);
                setComments(normalizeList(commentsResponse));
            }
            setNewComment('');
        } catch (submitError) {
            console.error('Failed to create comment:', submitError);
            setActionError(submitError.message || 'Failed to add comment.');
        } finally {
            setCommentSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        setOpenCommentMenuId(null);
        try {
            await commentApi.deleteComment(postId, commentId);
            setComments((prev) => prev.filter((comment) => comment._id !== commentId));
        } catch (deleteError) {
            console.error('Failed to delete comment:', deleteError);
            setActionError(deleteError.message || 'Failed to delete comment.');
        }
    };

    const handleStartEditComment = (comment) => {
        setOpenCommentMenuId(null);
        setEditingCommentId(comment._id);
        setEditingCommentText(comment.text || '');
        setActionError('');
    };

    const handleCancelEditComment = () => {
        setEditingCommentId(null);
        setEditingCommentText('');
    };

    const handleSaveEditComment = async (commentId) => {
        const trimmed = editingCommentText.trim();
        if (!trimmed) {
            setActionError('Comment cannot be empty.');
            return;
        }

        try {
            const updated = await commentApi.updateComment(postId, commentId, { text: trimmed });
            const updatedComment = updated?.comment || updated?.data || updated;

            setComments((prev) =>
                prev.map((comment) =>
                    comment._id === commentId
                        ? {
                            ...comment,
                            ...(updatedComment?._id ? updatedComment : {}),
                            text: updatedComment?.text || trimmed,
                        }
                        : comment
                )
            );

            setEditingCommentId(null);
            setEditingCommentText('');
        } catch (editError) {
            console.error('Failed to update comment:', editError);
            setActionError(editError.message || 'Failed to update comment.');
        }
    };

    const handleRsvp = async (status) => {
        if (!currentUserId || !postId) {
            return;
        }
        setRsvpSubmitting(true);
        try {
            if (userRsvp?._id) {
                await rsvpApi.updateRSVPStatus(postId, status);
            } else {
                await rsvpApi.createRSVP(postId, {
                    status
                });
            }

            const rsvpsResponse = await rsvpApi.getRSVPsByEvent(postId);
            setRsvps(normalizeList(rsvpsResponse));
        } catch (rsvpError) {
            console.error('Failed to submit RSVP:', rsvpError);
            setActionError(rsvpError.message || 'Failed to submit RSVP.');
        } finally {
            setRsvpSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 px-4 py-8">
                <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-md">
                    <p className="text-gray-600">Loading post details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 px-4 py-8">
                <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-md">
                    <p className="text-red-600">{error}</p>
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const authorName = post?.author?.firstName
        ? `${post.author.firstName} ${post.author.lastName || ''}`.trim()
        : post?.authorName || 'Unknown user';

    const authorRole = post?.author?.role || post?.authorRole || 'Member';
    const rsvpCount = rsvps.length || post?.rsvpCount || post?.rsvps?.length || 0;
    const commentCount = comments.length || post?.commentCount || post?.comments?.length || 0;
    const postAuthorId = getEntityId(post?.author) || post?.authorId;
    const isPostOwnerById = Boolean(postAuthorId && currentUserId && postAuthorId === currentUserId);
    const isPostOwnerByUsername = Boolean(
        post?.author?.username && currentUser?.username && post.author.username === currentUser.username
    );
    const isPostOwnerByEmail = Boolean(
        post?.author?.email && currentUser?.email && post.author.email === currentUser.email
    );
    const isPostOwner = isPostOwnerById || isPostOwnerByUsername || isPostOwnerByEmail;

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8">
            <div className="mx-auto max-w-4xl space-y-4">
                <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
                >
                    Back
                </button>

                <article className="rounded-xl border border-gray-300 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-base font-semibold text-white">
                            {(authorName?.[0] || 'U').toUpperCase()}
                        </div>
                        <div>
                            <p className="mb-0 text-xl font-semibold text-gray-700">{authorName}</p>
                            <p className="mb-0 text-base text-gray-400">{authorRole}</p>
                        </div>
                    </div>

                    <div className="mt-4 space-y-3">
                        <h1 className="text-3xl font-bold text-gray-800">{post?.title || 'Untitled post'}</h1>
                        <p className="text-lg text-gray-700">{post?.content || 'No description provided.'}</p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-3 text-sm text-gray-600 sm:grid-cols-2">
                        <p><strong>Category:</strong> {post?.category || 'N/A'}</p>
                        <p><strong>Status:</strong> {post?.status || 'N/A'}</p>
                        <p><strong>Location:</strong> {post?.location || 'N/A'}</p>
                        <p><strong>Event Date:</strong> {post?.eventDate ? new Date(post.eventDate).toLocaleDateString() : 'N/A'}</p>
                    </div>

                    <div className="mt-8 flex gap-8 text-base font-semibold text-gray-700">
                        <span>{rsvpCount} RSVP</span>
                        <span>{commentCount} Comments</span>
                    </div>

                    {post?.category === 'event' && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => handleRsvp('going')}
                                disabled={rsvpSubmitting}
                                className={`rounded-lg px-3 py-2 text-sm font-semibold ${userRsvp?.status === 'going' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                            >
                                {goingCount} Going
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRsvp('interested')}
                                disabled={rsvpSubmitting}
                                className={`rounded-lg px-3 py-2 text-sm font-semibold ${userRsvp?.status === 'interested' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                            >
                                {interestedCount} Interested
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRsvp('not going')}
                                disabled={rsvpSubmitting}
                                className={`rounded-lg px-3 py-2 text-sm font-semibold ${userRsvp?.status === 'not going' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                            >
                                {notGoingCount} Not Going
                            </button>
                        </div>
                    )}
                    {actionError && (
                        <p className="mt-3 text-sm text-red-600">{actionError}</p>
                    )}
                </article>

                <section className="rounded-xl border border-gray-300 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-800">Comments</h2>

                    <form onSubmit={handleAddComment} className="mb-5 flex gap-3">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add comment..."
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 outline-none focus:border-blue-500"
                        />
                        <button
                            type="submit"
                            disabled={commentSubmitting || !newComment.trim()}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                            Add
                        </button>
                    </form>

                    {comments.length === 0 ? (
                        <p className="text-gray-500">No comments yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {comments.map((comment) => {
                                const commentAuthorId = getEntityId(comment?.author);
                                const isCommentOwner = commentAuthorId === currentUserId;
                                const canEdit = isCommentOwner;
                                const canDelete = isCommentOwner || isPostOwner || currentUserRole === 'admin';
                                const canShowMenu = canEdit || canDelete;
                                const commentAuthorName = comment?.author?.firstName
                                    ? `${comment.author.firstName} ${comment.author.lastName || ''}`.trim()
                                    : comment?.authorName || 'User';

                                return (
                                    <div key={comment._id} className="rounded-lg border border-gray-200 p-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="mb-1 text-sm font-semibold text-gray-700">{commentAuthorName}</p>
                                                {editingCommentId === comment._id ? (
                                                    <div className="space-y-2">
                                                        <textarea
                                                            value={editingCommentText}
                                                            onChange={(e) => setEditingCommentText(e.target.value)}
                                                            rows={3}
                                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500"
                                                        />
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleSaveEditComment(comment._id)}
                                                                className="rounded-md bg-blue-600 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={handleCancelEditComment}
                                                                className="rounded-md bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-300"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="mb-0 text-gray-700">{comment.text}</p>
                                                )}
                                            </div>
                                            {canShowMenu && (
                                                <div className="relative">
                                                    <button
                                                        type="button"
                                                        onClick={() => setOpenCommentMenuId((prev) => (prev === comment._id ? null : comment._id))}
                                                        className="rounded-md px-2 py-1 text-lg font-bold leading-none text-gray-600 hover:bg-gray-100"
                                                        aria-label="Comment actions"
                                                    >
                                                        ...
                                                    </button>
                                                    {openCommentMenuId === comment._id && (
                                                        <div className="absolute right-0 z-10 mt-1 min-w-[120px] rounded-md border border-gray-200 bg-white py-1 shadow-md">
                                                            {canEdit && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleStartEditComment(comment)}
                                                                    className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                                                >
                                                                    Edit
                                                                </button>
                                                            )}
                                                            {canDelete && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteComment(comment._id)}
                                                                    className="block w-full px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50"
                                                                >
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default PostDetails;
