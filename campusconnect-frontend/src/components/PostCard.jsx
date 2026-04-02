
import { useNavigate } from 'react-router-dom';

function PostCard({ post }) {
    const navigate = useNavigate();

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
        navigate(`/posts/${post._id}`, { state: { post } });
    };

    return (
        <article
            className="cursor-pointer rounded-xl border border-gray-300 bg-white px-6 py-5 shadow-sm transition hover:shadow-md"
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
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-base font-semibold text-white">
                    {(displayName?.[0] || 'P').toUpperCase()}
                </div>
                <div>
                    <p className="mb-0 text-2xl font-semibold text-gray-700">{displayName}</p>
                    <p className="mb-0 text-xl text-gray-400">{displayRole}</p>
                </div>
            </div>

            <div className="mt-3 pl-14">
                <h3 className="mb-1 text-5xl font-bold text-gray-800">{post?.title || 'Text Heading'}</h3>
                <p className="mb-0 text-4xl text-gray-700">{post?.content || 'Description'}</p>
            </div>

            <div className="mt-12 flex gap-12 pl-14 text-2xl text-gray-700">
                <span>{rsvpCount} RSVP</span>
                <span>{commentCount} Comments</span>
            </div>
        </article>
    );
}

export default PostCard;