
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PostCard({ post, actionItems = [], detailsState = {} }) {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    const displayName = post?.author?.firstName
        ? `${post.author.firstName} ${post.author.lastName || ''}`.trim()
        : post?.authorName || 'Post1';

    const displayRole = post?.author?.role || post?.authorRole || 'Leader';
    const rsvpCount = post?.rsvpCount ?? post?.rsvps?.length ?? 0;
    const commentCount = post?.commentCount ?? post?.comments?.length ?? 0;

    const handleOpenDetails = () => {
        if (!post?._id) {
            return;
        }
        navigate(`/posts/${post._id}`, { state: { post, ...detailsState } });
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!showMenu) {
                return;
            }

            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('touchstart', handleOutsideClick);
        };
    }, [showMenu]);

    return (
        <article
            className="post-card relative cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-4 shadow-sm transition hover:shadow-md"
            onClick={handleOpenDetails}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenDetails();
                }
            }}
        >
            {actionItems.length > 0 && (
                <div className="absolute right-3 top-3">
                    <div ref={menuRef} className="relative">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu((prev) => !prev);
                            }}
                            className="rounded-md px-2 py-1 text-lg font-bold leading-none text-gray-600 hover:bg-gray-100"
                            aria-label="Post actions"
                        >
                            ...
                        </button>
                        {showMenu && (
                            <div className="post-card-menu absolute right-0 z-10 mt-1 min-w-[130px] rounded-md py-1 shadow-md">
                                {actionItems.map((item) => (
                                    <button
                                        key={item.label}
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowMenu(false);
                                            item.onClick?.();
                                        }}
                                        className={`post-card-menu-item block w-full px-3 py-2 text-left text-sm ${item.danger ? 'post-card-menu-item-danger' : ''}`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    {(displayName?.[0] || 'P').toUpperCase()}
                </div>
                <div>
                    <p className="post-card-author mb-0 text-lg font-semibold">{displayName}</p>
                    <p className="post-card-role mb-0 text-sm">{displayRole}</p>
                </div>
            </div>

            <div className="mt-3 pl-12">
                <p className="post-card-category mb-1 text-xs uppercase tracking-wide">{post?.category || 'General'}</p>
                <h3 className="post-card-title mb-1 text-2xl font-bold">{post?.title || 'Text Heading'}</h3>
                <p className="post-card-content mb-0 text-lg leading-relaxed">{post?.content || 'Description'}</p>
            </div>

            <div className="post-card-meta mt-4 flex gap-6 pl-12 text-base">
                <span>{rsvpCount} RSVP</span>
                <span>{commentCount} Comments</span>
            </div>
        </article>
    );
}

export default PostCard;