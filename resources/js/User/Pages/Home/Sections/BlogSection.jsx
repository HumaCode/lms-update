import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';

const fallbackBlogs = [
    {
        id: 'demo-1',
        title: 'Uncovering Learning Opportunities in Academia.',
        slug: 'uncovering-learning-opportunities-in-academia',
        image: 'frontend/assets/images/blog_4_img_2.jpg',
        created_at: '2024-04-28',
        author: { name: 'Doug Lyphe' },
        comments_count: 21,
        description: 'Suspends dictum sed sem allium convallis Proin dictum ipsum.',
    },
    {
        id: 'demo-2',
        title: 'Internationally Distinguished Skillful Educators.',
        slug: 'internationally-distinguished-skillful-educators',
        image: 'frontend/assets/images/blog_4_img_3.jpg',
        created_at: '2024-01-12',
        author: { name: 'Eleanor Fant' },
        comments_count: 48,
        description: 'Suspends dictum sed sem allium convallis Proin dictum ipsum.',
    },
    {
        id: 'demo-3',
        title: 'Uncovering Learning Opportunities in Academia.',
        slug: 'uncovering-learning-opportunities-in-academia-2',
        image: 'frontend/assets/images/blog_4_img_4.jpg',
        created_at: '2024-04-28',
        author: { name: 'Doug Lyphe' },
        comments_count: 21,
        description: 'Suspends dictum sed sem allium convallis Proin dictum ipsum.',
    },
    {
        id: 'demo-4',
        title: 'Exploring Learning Landscapes in Academic.',
        slug: 'exploring-learning-landscapes-in-academic',
        image: 'frontend/assets/images/blog_4_img_1.jpg',
        created_at: '2024-03-23',
        author: { name: 'Richard Tea' },
        comments_count: 3,
        description: 'Suspends dictum sed sem allium convallis Proin dictum ipsum.',
    },
];

export default function BlogSection({ blogs = [] }) {
    // Use real blogs, pad with fallbacks if fewer than 4 so carousel can slide seamlessly
    const blogList = blogs && blogs.length >= 4
        ? blogs
        : [...(blogs || []), ...fallbackBlogs.slice(0, Math.max(0, 5 - (blogs?.length || 0)))];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(3);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    // Responsive visible count
    useEffect(() => {
        const updateVisible = () => {
            if (window.innerWidth < 768) {
                setVisibleCount(1);
            } else if (window.innerWidth < 1200) {
                setVisibleCount(2);
            } else {
                setVisibleCount(3);
            }
        };

        updateVisible();
        window.addEventListener('resize', updateVisible);
        return () => window.removeEventListener('resize', updateVisible);
    }, []);

    const maxIndex = Math.max(0, blogList.length - visibleCount);

    const slidePrev = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
    };

    const slideNext = () => {
        setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    };

    // Touch swipe support
    const handleTouchStart = (e) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current - touchEndX.current > 50) {
            slideNext();
        }
        if (touchStartX.current - touchEndX.current < -50) {
            slidePrev();
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'April 28, 2024';
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <section className="blog_4 mt_110 xs_mt_90 pt_120 xs_pt_100 pb_120 xs_pb_100">
            <div className="container">
                <div className="row align-items-end mb_50">
                    <div className="col-8 col-md-9 col-xl-6">
                        {/* Standard EduCore section heading: style.css automatically adds book icon before h5 */}
                        <div className="wsus__section_heading heading_left mb-0">
                            <h5>Latest blogs</h5>
                            <h2>Our Latest News Feed.</h2>
                        </div>
                    </div>
                    <div className="col-4 col-md-3 col-xl-6 text-end">
                        <div className="d-flex align-items-center justify-content-end gap-2">
                            {/* Prev button: White circular button with crisp left arrow */}
                            <button
                                type="button"
                                onClick={slidePrev}
                                aria-label="Previous slide"
                                style={{
                                    width: '45px',
                                    height: '45px',
                                    borderRadius: '50%',
                                    border: '1px solid rgba(30, 30, 47, 0.12)',
                                    background: '#ffffff',
                                    color: '#1e1e2f',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.25s ease',
                                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--colorPrimary, #356df1)';
                                    e.currentTarget.style.color = '#ffffff';
                                    e.currentTarget.style.borderColor = 'var(--colorPrimary, #356df1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#ffffff';
                                    e.currentTarget.style.color = '#1e1e2f';
                                    e.currentTarget.style.borderColor = 'rgba(30, 30, 47, 0.12)';
                                }}
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="19" y1="12" x2="5" y2="12"></line>
                                    <polyline points="12 19 5 12 12 5"></polyline>
                                </svg>
                            </button>

                            {/* Next button: Blue circular button with crisp right arrow */}
                            <button
                                type="button"
                                onClick={slideNext}
                                aria-label="Next slide"
                                style={{
                                    width: '45px',
                                    height: '45px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: 'var(--colorPrimary, #356df1)',
                                    color: '#ffffff',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.25s ease',
                                    boxShadow: '0 4px 12px rgba(53, 109, 241, 0.35)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.06)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Carousel Track Container */}
            <div
                style={{
                    overflow: 'hidden',
                    width: '100%',
                    padding: '10px 0 20px',
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    style={{
                        display: 'flex',
                        transition: 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)',
                        transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                    }}
                >
                    {blogList.map((blog, idx) => {
                        const blogUrl = typeof route === 'function' && blog.slug
                            ? route('blog.show', blog.slug)
                            : `/blog/${blog.slug || idx}`;

                        return (
                            <div
                                key={blog.id || idx}
                                style={{
                                    flex: `0 0 ${100 / visibleCount}%`,
                                    maxWidth: `${100 / visibleCount}%`,
                                    padding: '0 12px',
                                    boxSizing: 'border-box',
                                }}
                            >
                                <div
                                    className="wsus__single_blog_4"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        flexWrap: 'nowrap',
                                        alignItems: 'stretch',
                                        background: '#ffffff',
                                        boxShadow: '0px 2px 10px 0px rgba(30, 30, 47, 0.10), 0px 4px 3px 0px rgba(30, 30, 47, 0.12)',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        height: '100%',
                                        minHeight: '340px',
                                        margin: 0,
                                    }}
                                >
                                    {/* Left Image with Date badge */}
                                    <Link
                                        href={blogUrl}
                                        className="wsus__single_blog_4_img"
                                        style={{
                                            flex: '0 0 220px',
                                            width: '220px',
                                            position: 'relative',
                                            display: 'block',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <img
                                            src={
                                                blog.blog_image ||
                                                (blog.image
                                                    ? (blog.image.startsWith('http') || blog.image.startsWith('/')
                                                        ? blog.image
                                                        : `/${blog.image}`)
                                                    : `/frontend/assets/images/blog_4_img_${(idx % 4) + 1}.jpg`)
                                            }
                                            alt={blog.title}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                display: 'block',
                                            }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `/frontend/assets/images/blog_4_img_${(idx % 4) + 1}.jpg`;
                                            }}
                                        />
                                        <span className="date">
                                            {formatDate(blog.created_at)}
                                        </span>
                                    </Link>

                                    {/* Right Content */}
                                    <div
                                        className="wsus__single_blog_4_text"
                                        style={{
                                            flex: '1',
                                            width: 'auto',
                                            padding: '28px 24px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                                            <li>
                                                <span>
                                                    <img
                                                        src="/frontend/assets/images/user_icon_black.png"
                                                        alt="User"
                                                        className="img-fluid"
                                                    />
                                                </span>
                                                By {blog.author?.name || 'Admin'}
                                            </li>
                                            <li>
                                                <span>
                                                    <img
                                                        src="/frontend/assets/images/comment_icon_black.png"
                                                        alt="Comment"
                                                        className="img-fluid"
                                                    />
                                                </span>
                                                {blog.comments_count || blog.comments?.length || 21} Comments
                                            </li>
                                        </ul>

                                        <Link
                                            href={blogUrl}
                                            className="title"
                                            style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                fontWeight: '700',
                                                fontSize: '19px',
                                                lineHeight: '1.35',
                                                marginBottom: '10px',
                                            }}
                                        >
                                            {blog.title}
                                        </Link>

                                        <p
                                            style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                marginBottom: '20px',
                                                marginTop: 0,
                                                fontSize: '14px',
                                                lineHeight: '22px',
                                                color: 'var(--paraColor, #555555)',
                                            }}
                                        >
                                            {blog.description
                                                ? blog.description.replace(/<[^>]+>/g, '').slice(0, 110) + '...'
                                                : 'Suspends dictum sed sem allium convallis Proin dictum ipsum.'}
                                        </p>

                                        <div>
                                            <Link
                                                href={blogUrl}
                                                className="common_btn"
                                                style={{
                                                    padding: '10px 22px',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                }}
                                            >
                                                Read More
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                                    <polyline points="12 5 19 12 12 19"></polyline>
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
