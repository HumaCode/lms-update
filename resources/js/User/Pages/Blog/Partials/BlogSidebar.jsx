import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';

export default function BlogSidebar({ recentBlogs = [], blogCategories = [] }) {
    const [search, setSearch] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (search.trim()) {
            router.get(route('blog.index'), { search: search.trim() });
        }
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
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const popularTags = [
        'Course',
        'Education',
        'Learn',
        'Online',
        'eLearning',
        'LMS',
        'Development',
    ];

    return (
        <div className="wsus__blog_sidebar wsus__sidebar">
            {/* Search Widget */}
            <form onSubmit={handleSearchSubmit} className="wsus__sidebar_search">
                <input
                    type="text"
                    placeholder="Search Here..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" aria-label="Search">
                    <img
                        src="/frontend/assets/images/search_icon.png"
                        alt="Search"
                        className="img-fluid"
                    />
                </button>
            </form>

            {/* Recent Posts Widget */}
            {recentBlogs.length > 0 && (
                <div className="wsus__sidebar_recent_post">
                    <h3>Recent Posts</h3>
                    <ul className="d-flex flex-wrap">
                        {recentBlogs.map((item) => (
                            <li key={item.id}>
                                <Link href={route('blog.show', item.slug)} className="img">
                                    <img
                                        src={formatImagePath(
                                            item.blog_image || item.image,
                                            '/frontend/assets/images/blog_4_img_1.jpg'
                                        )}
                                        alt={item.title}
                                        className="img-fluid"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/frontend/assets/images/blog_4_img_1.jpg';
                                        }}
                                    />
                                </Link>
                                <div className="text">
                                    <p>
                                        <span>
                                            <img
                                                src="/frontend/assets/images/calendar_blue.png"
                                                alt="Calendar"
                                                className="img-fluid"
                                            />
                                        </span>
                                        {formatDate(item.created_at)}
                                    </p>
                                    <Link href={route('blog.show', item.slug)} className="title">
                                        {item.title}
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Categories Widget */}
            {blogCategories.length > 0 && (
                <div className="wsus__sidebar_blog_category">
                    <h3>Categories</h3>
                    <ul>
                        {blogCategories.map((cat) => (
                            <li key={cat.id}>
                                <Link href={route('blog.index', { category: cat.slug })}>
                                    {cat.name}{' '}
                                    <span>
                                        ({cat.blogs_count || 0})
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Tags Widget */}
            <div className="wsus__sidebar_blog_tags">
                <h3>Tags</h3>
                <ul className="d-flex flex-wrap">
                    {popularTags.map((tag, idx) => (
                        <li key={idx}>
                            <Link href={route('blog.index', { search: tag })}>{tag}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
