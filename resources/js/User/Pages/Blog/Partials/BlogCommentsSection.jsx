import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';

export default function BlogCommentsSection({ blog }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const comments = blog.comments || [];

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            router.get(route('login'));
            return;
        }

        if (!comment.trim()) return;

        setSubmitting(true);
        router.post(
            route('blog.comment.store', blog.id),
            { comment },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setComment('');
                },
                onFinish: () => setSubmitting(false),
            }
        );
    };

    const formatImagePath = (img, fallback) => {
        if (!img) return fallback;
        if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/')) return img;
        return `/${img}`;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            {/* Comments List */}
            <div className="wsus__blog_comment_area mt_75">
                <h2>Comments ({comments.length})</h2>
                {comments.length === 0 ? (
                    <p className="text-muted mt-3 mb-0" style={{ fontSize: '15px' }}>
                        No comments yet. Be the first to share your thoughts!
                    </p>
                ) : (
                    comments.map((item, idx) => (
                        <div
                            className={`wsus__blog_single_comment ${
                                idx % 2 === 1 ? 'single_comment_reply' : ''
                            }`}
                            key={item.id || idx}
                        >
                            <div className="img">
                                <img
                                    src={formatImagePath(
                                        item.user?.image,
                                        `/frontend/assets/images/testimonial_user_${(idx % 4) + 1}.png`
                                    )}
                                    alt={item.user?.name || 'User'}
                                    className="img-fluid"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/frontend/assets/images/testimonial_user_1.png';
                                    }}
                                />
                            </div>
                            <div className="text">
                                <h4>{item.user?.name || 'Reader'}</h4>
                                <h6>
                                    {formatDate(item.created_at)}
                                </h6>
                                <p>{item.comment}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Comment Input Form */}
            <div className="wsus__blog_comment_input_area mt_75">
                <h2>Post a Comment</h2>
                <p>
                    {user
                        ? `Logged in as ${user.name}. Share your thoughts or questions below.`
                        : 'Your email address will not be published. Required fields are marked *'}
                </p>
                <form onSubmit={handleCommentSubmit}>
                    <div className="row">
                        {!user && (
                            <>
                                <div className="col-xl-6">
                                    <input
                                        type="text"
                                        placeholder="Name *"
                                        disabled
                                        value="Please login to comment"
                                    />
                                </div>
                                <div className="col-xl-6">
                                    <input
                                        type="email"
                                        placeholder="Email *"
                                        disabled
                                        value="Please login to comment"
                                    />
                                </div>
                            </>
                        )}
                        <div className="col-xl-12">
                            <textarea
                                rows="5"
                                placeholder={
                                    user ? 'Leave a reply...' : 'Please log in to submit a comment...'
                                }
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                disabled={!user || submitting}
                                required
                            ></textarea>
                        </div>
                        <div className="col-12">
                            <button
                                type="submit"
                                className="common_btn"
                                disabled={!user || submitting}
                            >
                                {submitting ? 'Posting...' : user ? 'Post Comment' : 'Log In to Comment'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}
