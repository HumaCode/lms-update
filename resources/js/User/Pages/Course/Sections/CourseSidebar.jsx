import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { getImageUrl, formatCurrency } from '@/Utils/formatters';

export default function CourseSidebar({
    course,
    onPlayVideo,
    handleAddToCart,
    handleEnrollFree,
    handleBuyNowDirectly,
    addingToCart,
    isEnrolled = false,
}) {
    const { props } = usePage();
    const settings = props?.settings || {};
    const numPrice = Number(course.price || 0);
    const numDiscount = Number(course.discount || 0);
    const finalPrice = course.final_price !== undefined ? Number(course.final_price) : (
        numDiscount > 0 && numDiscount < numPrice ? (numPrice - numDiscount) : (numDiscount > 0 ? numDiscount : numPrice)
    );
    const hasDiscount = numDiscount > 0 && finalPrice < numPrice;
    const isFree = numPrice === 0;

    const thumbnail = getImageUrl(course.thumbnail, '/frontend/assets/images/courses_img_1.jpg');
    const instructorImg = getImageUrl(course.instructor?.image, '/default-files/avatar.png');

    const formatDuration = (mins) => {
        if (!mins) return 'Self-paced';
        if (isNaN(mins)) return mins;
        const num = parseInt(mins, 10);
        const h = Math.floor(num / 60);
        const m = num % 60;
        if (h > 0 && m > 0) return `${h}h ${m}m`;
        if (h > 0) return `${h} hours`;
        return `${m} minutes`;
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = encodeURIComponent(course.title || 'Course');

    const videoToPlay =
        course.demo_video_source ||
        course.chapters?.find((ch) => ch.lessons?.some((l) => l.is_preview == 1))?.lessons?.find((l) => l.is_preview == 1)?.file_path ||
        'https://www.youtube.com/watch?v=sVPYIRF9RCQ';

    return (
        <div className="wsus__courses_sidebar">
            {/* Video / Thumbnail */}
            <div className="wsus__courses_sidebar_video position-relative">
                <style>{`
                    @keyframes pulseHalo {
                        0% { transform: scale(0.92); opacity: 0.8; }
                        50% { transform: scale(1.12); opacity: 0.35; }
                        100% { transform: scale(0.92); opacity: 0.8; }
                    }
                `}</style>
                <img
                    src={thumbnail}
                    alt={course.title}
                    className="img-fluid w-100 h-100 object-fit-cover"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/frontend/assets/images/courses_img_1.jpg';
                    }}
                />

                {/* Video Play Button with Outer Translucent Halo */}
                <div
                    className="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center"
                    style={{ zIndex: 5 }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            width: '115px',
                            height: '115px',
                            borderRadius: '50%',
                            background: 'rgba(59, 130, 246, 0.38)',
                            animation: 'pulseHalo 2s infinite ease-in-out',
                            pointerEvents: 'none',
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => onPlayVideo(videoToPlay)}
                        title="Play Course Preview"
                        style={{
                            position: 'relative',
                            width: '72px',
                            height: '72px',
                            borderRadius: '50%',
                            background: 'var(--colorPrimary, #2F66EE)',
                            border: 'none',
                            outline: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 20px rgba(47, 102, 238, 0.45)',
                            transition: 'all 0.3s ease',
                            zIndex: 6,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.08)';
                            e.currentTarget.style.background = 'var(--colorOrange, #FF9900)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.background = 'var(--colorPrimary, #2F66EE)';
                        }}
                    >
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="#ffffff"
                            style={{ marginLeft: '4px' }}
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Price */}
            <h3 className="wsus__courses_sidebar_price">
                {isFree ? (
                    'FREE'
                ) : hasDiscount ? (
                    <>
                        <del>{formatCurrency(course.price, settings)}</del>
                        {formatCurrency(finalPrice, settings)}
                    </>
                ) : (
                    formatCurrency(finalPrice, settings)
                )}
            </h3>

            {/* Course Meta Info */}
            <div className="wsus__courses_sidebar_list_info">
                <ul>
                    <li>
                        <p>
                            <span>
                                <img
                                    src="/frontend/assets/images/clock_icon_black.png"
                                    alt="clock"
                                    className="img-fluid"
                                />
                            </span>
                            Course Duration
                        </p>
                        {formatDuration(course.duration)}
                    </li>
                    <li>
                        <p>
                            <span>
                                <img
                                    src="/frontend/assets/images/network_icon_black.png"
                                    alt="network"
                                    className="img-fluid"
                                />
                            </span>
                            Skill Level
                        </p>
                        {course.level?.name || 'All Levels'}
                    </li>
                    <li>
                        <p>
                            <span>
                                <img
                                    src="/frontend/assets/images/user_icon_black_2.png"
                                    alt="User"
                                    className="img-fluid"
                                />
                            </span>
                            Student Enrolled
                        </p>
                        {course.enrollments_count || 0}
                    </li>
                    <li>
                        <p>
                            <span>
                                <img
                                    src="/frontend/assets/images/language_icon_black.png"
                                    alt="Language"
                                    className="img-fluid"
                                />
                            </span>
                            Language
                        </p>
                        {course.language?.name || 'English'}
                    </li>
                </ul>

                {isEnrolled ? (
                    <Link
                        href={route('student.course-player.index', course.slug)}
                        className="common_btn w-100 text-center text-white text-decoration-none d-block py-3 fw-bold"
                        style={{ background: '#10B981', borderRadius: '8px' }}
                    >
                        <i className="fas fa-play-circle me-2"></i> Go to Course
                    </Link>
                ) : isFree ? (
                    <button
                        type="button"
                        className="common_btn w-100"
                        style={{ border: 'none', cursor: 'pointer', background: '#10B981', color: '#fff' }}
                        onClick={handleEnrollFree}
                        disabled={addingToCart}
                    >
                        {addingToCart ? (
                            'Enrolling...'
                        ) : (
                            <>
                                Enroll Course (Free) <i className="fas fa-arrow-right ms-2"></i>
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        type="button"
                        className="common_btn w-100"
                        style={{ border: 'none', cursor: 'pointer' }}
                        onClick={handleAddToCart}
                        disabled={addingToCart}
                    >
                        {addingToCart ? (
                            'Adding to Cart...'
                        ) : (
                            <>
                                Enroll The Course <i className="fas fa-arrow-right ms-2"></i>
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Buy Now / Checkout shortcut (Only for paid courses and when not enrolled) */}
            {!isFree && !isEnrolled && (
                <div className="wsus__courses_sidebar_share_btn d-flex flex-wrap justify-content-between mt-3">
                    <button
                        type="button"
                        onClick={handleBuyNowDirectly}
                        className="common_btn w-100"
                        style={{
                            background: '#1F2937',
                            color: '#fff',
                            textAlign: 'center',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                        disabled={addingToCart}
                    >
                        <i className="fas fa-shopping-bag me-2"></i> {addingToCart ? 'Processing...' : 'Buy Now Directly'}
                    </button>
                </div>
            )}

            {/* Social Share Area */}
            <div className="wsus__courses_sidebar_share_area">
                <span>Share:</span>
                <ul>
                    <li>
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Share on Facebook"
                        >
                            <i className="fab fa-facebook-f"></i>
                        </a>
                    </li>
                    <li>
                        <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Share on LinkedIn"
                        >
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                    </li>
                    <li>
                        <a
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareTitle}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Share on Twitter"
                        >
                            <i className="fab fa-twitter"></i>
                        </a>
                    </li>
                    <li>
                        <a
                            href={`https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${shareTitle}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Share on Reddit"
                        >
                            <i className="fab fa-reddit"></i>
                        </a>
                    </li>
                </ul>
            </div>

            {/* Includes Section */}
            <div className="wsus__courses_sidebar_info">
                <h3>This Course Includes</h3>
                <ul>
                    <li>
                        <span>
                            <img
                                src="/frontend/assets/images/video_icon_black.png"
                                alt="video"
                                className="img-fluid"
                            />
                        </span>
                        {formatDuration(course.duration)} Video Lectures
                    </li>
                    <li>
                        <span>
                            <img
                                src="/frontend/assets/images/file_download_icon_black.png"
                                alt="download"
                                className="img-fluid"
                            />
                        </span>
                        Full Access to Practice Exercises
                    </li>
                    {course.certificate ? (
                        <li>
                            <span>
                                <img
                                    src="/frontend/assets/images/certificate_icon_black.png"
                                    alt="Certificate"
                                    className="img-fluid"
                                />
                            </span>
                            Certificate of Completion
                        </li>
                    ) : null}
                    <li>
                        <span>
                            <img
                                src="/frontend/assets/images/life_time_icon.png"
                                alt="Lifetime"
                                className="img-fluid"
                            />
                        </span>
                        Course Lifetime Access
                    </li>
                </ul>
            </div>

            {/* Instructor Sidebar Card */}
            {course.instructor && (
                <div className="wsus__courses_sidebar_instructor">
                    <div className="image_area d-flex flex-wrap align-items-center">
                        <div className="img">
                            <img
                                src={instructorImg}
                                alt={course.instructor.name}
                                className="img-fluid w-100 h-100 object-fit-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/default-files/avatar.png';
                                }}
                            />
                        </div>
                        <div className="text">
                            <h3>{course.instructor.name}</h3>
                            <p>
                                <span>Instructor</span> {course.instructor.headline || 'Verified Instructor'}
                            </p>
                        </div>
                    </div>
                    <ul className="d-flex flex-wrap">
                        <li title="Exclusive Author">
                            <img src="/frontend/assets/images/badge_1.png" alt="Badge" className="img-fluid" />
                        </li>
                        <li title="Top Earning">
                            <img src="/frontend/assets/images/badge_2.png" alt="Badge" className="img-fluid" />
                        </li>
                        <li title="Trending">
                            <img src="/frontend/assets/images/badge_3.png" alt="Badge" className="img-fluid" />
                        </li>
                        <li title="2 Years of Membership">
                            <img src="/frontend/assets/images/badge_4.png" alt="Badge" className="img-fluid" />
                        </li>
                        <li title="Collector Level 1">
                            <img src="/frontend/assets/images/badge_5.png" alt="Badge" className="img-fluid" />
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
