import React from 'react';
import { Link } from '@inertiajs/react';

export default function BlogDetailsContent({ blog }) {
    const formatImagePath = (img, fallback) => {
        if (!img) return fallback;
        if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/')) return img;
        return `/${img}`;
    };

    const formattedDate = blog.created_at
        ? new Date(blog.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: '2-digit',
              year: 'numeric',
          })
        : 'March 08, 2024';

    const commentsCount = blog.comments ? blog.comments.length : 0;
    const authorName = blog.author?.name || 'Hans Down';
    const authorRole = blog.author?.role || 'Digital Education Expert';
    const authorBio =
        blog.author?.bio ||
        'Passionate educator and content creator dedicated to sharing actionable knowledge and real-world skills.';

    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <>
            {/* Thumbnail */}
            <div className="wsus__blog_details_thumb">
                <img
                    src={formatImagePath(blog.image, '/frontend/assets/images/blog_details_thumb.jpg')}
                    alt={blog.title}
                    className="img-fluid w-100"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/frontend/assets/images/blog_details_thumb.jpg';
                    }}
                />
            </div>

            {/* Header / Meta */}
            <div className="wsus__blog_details_header">
                <ul className="d-flex flex-wrap">
                    <li>
                        <span className="author">
                            <img
                                src={formatImagePath(
                                    blog.author?.image,
                                    '/frontend/assets/images/author_img_6.jpg'
                                )}
                                alt={authorName}
                                className="img-fluid"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/frontend/assets/images/author_img_6.jpg';
                                }}
                            />
                        </span>
                        By {authorName}
                    </li>
                    <li>
                        <span>
                            <img
                                src="/frontend/assets/images/calendar_gray.png"
                                alt="calendar"
                                className="img-fluid"
                            />
                        </span>
                        {formattedDate}
                    </li>
                    {blog.category && (
                        <li>
                            <span>
                                <img
                                    src="/frontend/assets/images/bookmark_icon.png"
                                    alt="category"
                                    className="img-fluid"
                                />
                            </span>
                            <Link
                                href={route('blog.index', { category: blog.category.slug })}
                                className="text-decoration-none"
                                style={{ color: 'inherit' }}
                            >
                                {blog.category.name}
                            </Link>
                        </li>
                    )}
                    <li>
                        <span>
                            <img
                                src="/frontend/assets/images/comment_icon_gray.png"
                                alt="comments"
                                className="img-fluid"
                            />
                        </span>
                        {commentsCount} Comments
                    </li>
                </ul>
                <h2>{blog.title}</h2>
            </div>

            {/* Content Text */}
            <div className="wsus__blog_details_text">
                <div
                    dangerouslySetInnerHTML={{ __html: blog.description || '' }}
                />
            </div>

            {/* Tags & Share */}
            <div className="wsus__blog_det_tags_share d-flex flex-wrap mt_50">
                <ul className="tags d-flex flex-wrap align-items-center">
                    <li>
                        <span>Tags:</span>
                    </li>
                    <li>
                        <Link href={route('blog.index')}>Course</Link>
                    </li>
                    <li>
                        <Link href={route('blog.index')}>Education</Link>
                    </li>
                    <li>
                        <Link href={route('blog.index')}>Learn</Link>
                    </li>
                    <li>
                        <Link href={route('blog.index')}>Online</Link>
                    </li>
                </ul>
                <ul className="share d-flex flex-wrap align-items-center">
                    <li>
                        <span>share:</span>
                    </li>
                    <li>
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Share on Facebook"
                        >
                            <i className="fab fa-facebook-f"></i>
                        </a>
                    </li>
                    <li>
                        <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Share on LinkedIn"
                        >
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                    </li>
                    <li>
                        <a
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(blog.title)}`}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Share on Twitter"
                        >
                            <i className="fab fa-twitter"></i>
                        </a>
                    </li>
                    <li>
                        <a
                            href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}`}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Share on Pinterest"
                        >
                            <i className="fab fa-pinterest-p"></i>
                        </a>
                    </li>
                </ul>
            </div>

            {/* Author Bio Box */}
            <div className="wsus__blog_det_author">
                <div className="img">
                    <img
                        src={formatImagePath(
                            blog.author?.image,
                            '/frontend/assets/images/blog_details_author_img.jpg'
                        )}
                        alt={authorName}
                        className="img-fluid"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/frontend/assets/images/blog_details_author_img.jpg';
                        }}
                    />
                </div>
                <div className="text">
                    <h3>{authorName}</h3>
                    <h5>{authorRole}</h5>
                    <p>{authorBio}</p>
                    <ul>
                        <li>
                            <a href="#" aria-label="Facebook">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                        </li>
                        <li>
                            <a href="#" aria-label="LinkedIn">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                        </li>
                        <li>
                            <a href="#" aria-label="Twitter">
                                <i className="fab fa-twitter"></i>
                            </a>
                        </li>
                        <li>
                            <a href="#" aria-label="Pinterest">
                                <i className="fab fa-pinterest-p"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}
