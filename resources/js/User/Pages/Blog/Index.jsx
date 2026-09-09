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

            {/* Breadcrumb */}
            <section
                className="wsus__breadcrumb"
                style={{
                    background: 'url(/frontend/assets/images/breadcrumb_bg.jpg) no-repeat center/cover',
                    padding: '50px 0',
                }}
            >
                <div className="container text-center text-white">
                    <h2 className="fw-bold mb-2">Our Blog & Articles</h2>
                    <ul className="d-flex justify-content-center list-unstyled mb-0 gap-2 small">
                        <li><Link href={route('home')} className="text-white-50 text-decoration-none">Home</Link></li>
                        <li>/</li>
                        <li className="text-white">Blogs</li>
                    </ul>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="blog_section py-5 bg-light">
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
                        <div className="d-flex justify-content-center mt-4">
                            <ul className="pagination pagination-sm shadow-sm mb-0">
                                {blogs.links.map((link, i) => (
                                    <li key={i} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                                        <Link href={link.url || '#'} className="page-link" dangerouslySetInnerHTML={{ __html: link.label }} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </section>
        </UserLayout>
    );
}
