import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import UserLayout from '../../Layouts/UserLayout';

export default function BlogIndex({ blogs }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('blog.index'), { search }, { preserveState: true });
    };

    const blogList = blogs?.data || [];

    return (
        <UserLayout>
            <Head title="Latest Blogs & News - EduCore" />

            {/* Breadcrumb matching template */}
            <section
                className="wsus__breadcrumb"
                style={{
                    background: 'url(/frontend/assets/images/breadcrumb_bg.jpg) no-repeat center/cover',
                }}
            >
                <div className="wsus__breadcrumb_overlay">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 wow fadeInUp">
                                <div className="wsus__breadcrumb_text">
                                    <h1>Our Blog & Articles</h1>
                                    <ul>
                                        <li>
                                            <Link href={route('home')}>Home</Link>
                                        </li>
                                        <li>Blogs</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="blog_section mt_120 xs_mt_100 pb_120 xs_pb_100">
                <div className="container">
                    {/* Search Bar */}
                    <div className="row justify-content-center mb-5">
                        <div className="col-md-6">
                            <form onSubmit={handleSearch} className="input-group shadow-sm">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search articles, stories, topics..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button className="btn btn-primary" type="submit">
                                    <i className="fas fa-search me-1"></i> Search
                                </button>
                            </form>
                        </div>
                    </div>

                    {blogList.length === 0 ? (
                        <div className="card border-0 shadow-sm rounded-3 p-5 text-center bg-white">
                            <h5 className="fw-bold text-dark">No blog articles found</h5>
                            <p className="text-muted small mb-0">Check back later for newly published learning insights.</p>
                        </div>
                    ) : (
                        <div className="row g-4 mb-4">
                            {blogList.map((blog) => (
                                <div className="col-lg-4 col-md-6" key={blog.id}>
                                    <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden transition-all hover-lift">
                                        <Link href={route('blog.show', blog.slug)}>
                                            <img
                                                src={blog.image ? `/${blog.image}` : '/frontend/assets/images/blog_1.jpg'}
                                                alt={blog.title}
                                                className="w-100"
                                                style={{ height: '220px', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/frontend/assets/images/blog_img_1.jpg';
                                                }}
                                            />
                                        </Link>
                                        <div className="card-body p-4 d-flex flex-column">
                                            <div className="d-flex justify-content-between text-muted small mb-2">
                                                <span><i className="far fa-calendar text-primary me-1"></i> {new Date(blog.created_at).toLocaleDateString()}</span>
                                                {blog.category && <span className="badge bg-primary-subtle text-primary">{blog.category.name}</span>}
                                            </div>
                                            <h5 className="card-title fw-bold mb-3">
                                                <Link href={route('blog.show', blog.slug)} className="text-dark text-decoration-none">
                                                    {blog.title}
                                                </Link>
                                            </h5>
                                            <p className="card-text text-muted small text-truncate-2 mt-auto">
                                                {blog.description ? blog.description.replace(/<[^>]*>/g, '').substring(0, 120) + '...' : ''}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {blogs?.links && blogs.links.length > 3 && (
                        <div className="mt-5 d-flex justify-content-center">
                            <style>{`
                                .blog-pagination-list {
                                    list-style: none !important;
                                    padding: 0 !important;
                                    margin: 0 !important;
                                    display: flex;
                                    align-items: center;
                                    gap: 8px;
                                }
                                .blog-pagination-list li {
                                    list-style: none !important;
                                    margin: 0 !important;
                                    padding: 0 !important;
                                }
                                .custom-pagination-btn {
                                    width: 44px !important;
                                    height: 44px !important;
                                    min-width: 44px !important;
                                    border-radius: 50% !important;
                                    display: flex !important;
                                    align-items: center !important;
                                    justify-content: center !important;
                                    font-size: 14px !important;
                                    font-weight: 500 !important;
                                    text-decoration: none !important;
                                    transition: all 0.2s ease-in-out !important;
                                    border: 1px solid #E2E8F0 !important;
                                    line-height: normal !important;
                                    padding: 0 !important;
                                }
                                .custom-pagination-btn.is-active {
                                    background-color: #2563EB !important;
                                    color: #FFFFFF !important;
                                    font-weight: 600 !important;
                                    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3) !important;
                                    border-color: #2563EB !important;
                                }
                                .custom-pagination-btn.is-default {
                                    background-color: #FFFFFF !important;
                                    color: #1E293B !important;
                                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
                                }
                                .custom-pagination-btn.is-default:hover {
                                    background-color: #F8FAFC !important;
                                    border-color: #CBD5E1 !important;
                                    color: #2563EB !important;
                                    transform: translateY(-1px);
                                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08) !important;
                                }
                                .custom-pagination-btn.is-disabled {
                                    background-color: #FFFFFF !important;
                                    color: #94A3B8 !important;
                                    border-color: #E2E8F0 !important;
                                    pointer-events: none !important;
                                    opacity: 0.45 !important;
                                    cursor: not-allowed !important;
                                }
                            `}</style>
                            <nav aria-label="Blog pagination">
                                <ul className="blog-pagination-list">
                                    {blogs.links.map((link, index) => {
                                        const isPrev = link.label.includes('Previous') || link.label.includes('&laquo;') || link.label.includes('«');
                                        const isNext = link.label.includes('Next') || link.label.includes('&raquo;') || link.label.includes('»');
                                        const isDisabled = !link.url;
                                        const isActive = link.active;

                                        const stateClass = isActive
                                            ? 'is-active'
                                            : isDisabled
                                            ? 'is-disabled'
                                            : 'is-default';

                                        if (isDisabled) {
                                            return (
                                                <li key={index}>
                                                    <span className={`custom-pagination-btn ${stateClass}`}>
                                                        {isPrev ? (
                                                            <i className="fas fa-chevron-left" style={{ fontSize: '13px' }}></i>
                                                        ) : isNext ? (
                                                            <i className="fas fa-chevron-right" style={{ fontSize: '13px' }}></i>
                                                        ) : (
                                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                        )}
                                                    </span>
                                                </li>
                                            );
                                        }

                                        return (
                                            <li key={index}>
                                                <Link
                                                    href={link.url}
                                                    preserveScroll
                                                    className={`custom-pagination-btn ${stateClass}`}
                                                >
                                                    {isPrev ? (
                                                        <i className="fas fa-chevron-left" style={{ fontSize: '13px' }}></i>
                                                    ) : isNext ? (
                                                        <i className="fas fa-chevron-right" style={{ fontSize: '13px' }}></i>
                                                    ) : (
                                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                    )}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>
                        </div>
                    )}
                </div>
            </section>
        </UserLayout>
    );
}
