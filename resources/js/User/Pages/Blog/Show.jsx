import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import UserLayout from '../../Layouts/UserLayout';

export default function BlogShow({ blog, recentBlogs = [], blogCategories = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            router.get(route('login'));
            return;
        }
        setSubmitting(true);
        router.post(
            route('blog.comment.store', blog.id),
            { comment },
            {
                preserveScroll: true,
                onSuccess: () => setComment(''),
                onFinish: () => setSubmitting(false),
            }
        );
    };

    return (
        <UserLayout>
            <Head title={`${blog.title} - EduCore Blog`} />

            {/* Breadcrumb */}
            <section
                className="wsus__breadcrumb"
                style={{
                    background: 'url(/frontend/assets/images/breadcrumb_bg.jpg) no-repeat center/cover',
                    padding: '50px 0',
                }}
            >
                <div className="container text-center text-white">
                    <h2 className="fw-bold mb-2">Blog Details</h2>
                    <ul className="d-flex justify-content-center list-unstyled mb-0 gap-2 small">
                        <li><Link href={route('home')} className="text-white-50 text-decoration-none">Home</Link></li>
                        <li>/</li>
                        <li><Link href={route('blog.index')} className="text-white-50 text-decoration-none">Blog</Link></li>
                        <li>/</li>
                        <li className="text-white text-truncate" style={{ maxWidth: '300px' }}>{blog.title}</li>
                    </ul>
                </div>
            </section>

            {/* Main Article Content */}
            <section className="blog_details_section py-5 bg-light">
                <div className="container">
                    <div className="row g-4">
                        {/* Article Column */}
                        <div className="col-lg-8">
                            <article className="card border-0 shadow-sm rounded-3 bg-white p-4 mb-4">
                                <img
                                    src={blog.image ? `/${blog.image}` : '/frontend/assets/images/blog_details_thumb.jpg'}
                                    alt={blog.title}
                                    className="w-100 rounded-3 mb-4"
                                    style={{ maxHeight: '420px', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/frontend/assets/images/blog_details_thumb.jpg';
                                    }}
                                />

                                <div className="d-flex align-items-center gap-3 text-muted small mb-3">
                                    <span><i className="far fa-user text-primary me-1"></i> {blog.author?.name || 'Admin'}</span>
                                    <span><i className="far fa-calendar text-primary me-1"></i> {new Date(blog.created_at).toLocaleDateString()}</span>
                                    {blog.category && <span className="badge bg-primary">{blog.category.name}</span>}
                                </div>

                                <h1 className="h2 fw-bold text-dark mb-4">{blog.title}</h1>

                                <div
                                    className="article_body text-muted lh-lg mb-5"
                                    dangerouslySetInnerHTML={{ __html: blog.description || '' }}
                                />

                                <hr />

                                {/* Comments List */}
                                <div className="comments_area mt-4">
                                    <h5 className="fw-bold text-dark mb-4">
                                        Comments ({blog.comments?.length || 0})
                                    </h5>

                                    {blog.comments && blog.comments.length > 0 ? (
                                        <div className="d-flex flex-column gap-3 mb-4">
                                            {blog.comments.map((c) => (
                                                <div className="card bg-light border-0 p-3 rounded-3" key={c.id}>
                                                    <div className="d-flex justify-content-between mb-1">
                                                        <h6 className="fw-bold text-dark mb-0">{c.user?.name || 'Reader'}</h6>
                                                        <span className="text-muted small">{new Date(c.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-muted small mb-0">{c.comment}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted small mb-4">No comments yet. Be the first to share your thoughts!</p>
                                    )}

                                    {/* Leave a comment */}
                                    <form onSubmit={handleCommentSubmit} className="card bg-light border-0 p-4 rounded-3">
                                        <h6 className="fw-bold text-dark mb-3">Leave a Reply</h6>
                                        <div className="mb-3">
                                            <textarea
                                                className="form-control form-control-sm"
                                                rows="4"
                                                placeholder={user ? "Write your comment..." : "Please log in to post a comment"}
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                disabled={!user || submitting}
                                                required
                                            ></textarea>
                                        </div>
                                        <div>
                                            <button className="btn btn-primary btn-sm px-4" type="submit" disabled={!user || submitting}>
                                                {submitting ? 'Posting...' : 'Submit Comment'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </article>
                        </div>

                        {/* Sidebar Column */}
                        <div className="col-lg-4">
                            {/* Categories Widget */}
                            {blogCategories.length > 0 && (
                                <div className="card border-0 shadow-sm rounded-3 bg-white p-4 mb-4">
                                    <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">Categories</h5>
                                    <ul className="list-unstyled mb-0">
                                        {blogCategories.map((cat) => (
                                            <li className="d-flex justify-content-between align-items-center py-2 border-bottom" key={cat.id}>
                                                <Link href={route('blog.index', { category: cat.slug })} className="text-decoration-none text-dark small">
                                                    {cat.name}
                                                </Link>
                                                <span className="badge bg-secondary-subtle text-secondary small">{cat.blogs_count || 0}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Recent Blogs Widget */}
                            {recentBlogs.length > 0 && (
                                <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
                                    <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">Recent Posts</h5>
                                    <div className="d-flex flex-column gap-3">
                                        {recentBlogs.map((rb) => (
                                            <div className="d-flex gap-3 align-items-center" key={rb.id}>
                                                <img
                                                    src={rb.image ? `/${rb.image}` : '/frontend/assets/images/blog_img_1.jpg'}
                                                    alt={rb.title}
                                                    className="rounded-3"
                                                    style={{ width: '70px', height: '55px', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/frontend/assets/images/blog_img_1.jpg';
                                                    }}
                                                />
                                                <div>
                                                    <h6 className="fw-bold mb-1 small">
                                                        <Link href={route('blog.show', rb.slug)} className="text-dark text-decoration-none">
                                                            {rb.title}
                                                        </Link>
                                                    </h6>
                                                    <span className="text-muted small" style={{ fontSize: '11px' }}>
                                                        {new Date(rb.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </UserLayout>
    );
}
