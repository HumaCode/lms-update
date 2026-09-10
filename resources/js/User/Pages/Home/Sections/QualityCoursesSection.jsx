import React, { useState, useRef } from 'react';
import { Link } from '@inertiajs/react';

const fallbackCourses = [
    {
        id: 'qc-1',
        title: 'Complete Blender Creator Learn 3D Modelling.',
        slug: 'complete-blender-creator-learn-3d-modelling',
        thumbnail: '/frontend/assets/images/courses_3_img_1.jpg',
        duration: '15',
        reviews_avg_rating: '4.8',
        lessons_count: 24,
        enrollments_count: 38,
        price: 254,
        discount: 156.00,
        instructor: {
            name: 'Hermann P. Schnitzel',
            image: '/frontend/assets/images/author_img_2.jpg',
        },
    },
    {
        id: 'qc-2',
        title: 'HTML5 & CSS3 Masterclass for Modern Web Development.',
        slug: 'html5-css3-masterclass-for-modern-web-development',
        thumbnail: '/frontend/assets/images/courses_3_img_2.jpg',
        duration: '24',
        reviews_avg_rating: '4.9',
        lessons_count: 32,
        enrollments_count: 56,
        price: 199,
        discount: 129.00,
        instructor: {
            name: 'John Doe',
            image: '/frontend/assets/images/author_img_1.jpg',
        },
    },
    {
        id: 'qc-3',
        title: 'Python for Data Science and Machine Learning Bootcamp.',
        slug: 'python-for-data-science-and-machine-learning-bootcamp',
        thumbnail: '/frontend/assets/images/courses_3_img_3.jpg',
        duration: '18',
        reviews_avg_rating: '4.7',
        lessons_count: 28,
        enrollments_count: 42,
        price: 220,
        discount: 140.00,
        instructor: {
            name: 'Jane Smith',
            image: '/frontend/assets/images/author_img_3.jpg',
        },
    },
];

export default function QualityCoursesSection({ featuredInstructor, courses = [] }) {
    // Combine real featured courses with demo fallbacks so the slider can always cycle
    const courseList = courses && courses.length > 0
        ? [...courses, ...fallbackCourses.slice(0, Math.max(0, 3 - courses.length))]
        : fallbackCourses;

    const [currentIndex, setCurrentIndex] = useState(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const maxIndex = courseList.length - 1;

    const slidePrev = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
    };

    const slideNext = () => {
        setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    };

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

    const allCoursesUrl = typeof route === 'function' ? route('courses.index') : '/courses';

    return (
        <section className="wsus__quality_courses mt_120 xs_mt_100">
            <div className="row quality_course_slider">
                <div
                    className="quality_course_slider_item"
                    style={{ background: 'url(/frontend/assets/images/quality_courses_bg.jpg)' }}
                >
                    <div className="col-12">
                        <div className="row align-items-center">
                            {/* Left Text & CTA */}
                            <div className="col-xxl-5 col-xl-4 col-md-6 col-lg-7 wow fadeInLeft">
                                <div className="wsus__quality_courses_text">
                                    <div className="wsus__section_heading heading_left mb_30">
                                        <h5>100% QUALITY COURSES</h5>
                                        <h2>
                                            {featuredInstructor?.title ||
                                                'Find Your Match From The Spotlighted Collection'}
                                        </h2>
                                    </div>
                                    <p>
                                        {featuredInstructor?.subtitle ||
                                            'Quisque vitae dignissim nunc, a molestie nisi. Orci varius natoque penatibus parturient nascetu mus.'}
                                    </p>
                                    <Link
                                        className="common_btn"
                                        href={allCoursesUrl}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                                    >
                                        {featuredInstructor?.button_text || 'All Featured Courses'}
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

                            {/* Center Man Image */}
                            <div className="col-xxl-4 col-xl-4 col-md-6 col-lg-6 d-none d-xl-block wow fadeInUp">
                                <div className="wsus__quality_courses_img">
                                    <img
                                        src="/frontend/assets/images/quality_courses_img.png"
                                        alt="Quality Courses"
                                        className="img-fluid w-100"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/frontend/assets/images/quality_courses_img.png';
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Right Course Slider */}
                            <div className="col-xxl-3 col-xl-4 col-md-6 col-lg-5 wow fadeInUp">
                                <div
                                    style={{
                                        position: 'relative',
                                        width: '100%',
                                        maxWidth: '380px',
                                        margin: '0 auto',
                                    }}
                                >
                                    {/* Left Arrow Button */}
                                    <button
                                        type="button"
                                        onClick={slidePrev}
                                        aria-label="Previous course"
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '-22px',
                                            transform: 'translateY(-50%)',
                                            zIndex: 10,
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
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.10)',
                                            transition: 'all 0.25s ease',
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
                                            <polyline points="12 19 5 12 12 19"></polyline>
                                        </svg>
                                    </button>

                                    {/* Right Arrow Button */}
                                    <button
                                        type="button"
                                        onClick={slideNext}
                                        aria-label="Next course"
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            right: '-22px',
                                            transform: 'translateY(-50%)',
                                            zIndex: 10,
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
                                            boxShadow: '0 4px 14px rgba(53, 109, 241, 0.40)',
                                            transition: 'all 0.25s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-50%) scale(1.06)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
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

                                    {/* Carousel Track */}
                                    <div
                                        style={{
                                            overflow: 'hidden',
                                            borderRadius: '10px',
                                            padding: '4px',
                                        }}
                                        onTouchStart={handleTouchStart}
                                        onTouchMove={handleTouchMove}
                                        onTouchEnd={handleTouchEnd}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                transition: 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)',
                                                transform: `translateX(-${currentIndex * 100}%)`,
                                            }}
                                        >
                                            {courseList.map((course, idx) => {
                                                const courseUrl = typeof route === 'function' && course.slug
                                                    ? route('courses.show', course.slug)
                                                    : `/courses/${course.slug || ''}`;

                                                const thumbnailSrc = course.thumbnail
                                                    ? (course.thumbnail.startsWith('http') || course.thumbnail.startsWith('/')
                                                        ? course.thumbnail
                                                        : `/${course.thumbnail}`)
                                                    : '/frontend/assets/images/courses_3_img_1.jpg';

                                                const authorImg = course.instructor?.image
                                                    ? (course.instructor.image.startsWith('http') || course.instructor.image.startsWith('/')
                                                        ? course.instructor.image
                                                        : `/${course.instructor.image}`)
                                                    : '/frontend/assets/images/author_img_2.jpg';

                                                return (
                                                    <div
                                                        key={course.id || idx}
                                                        style={{
                                                            flex: '0 0 100%',
                                                            maxWidth: '100%',
                                                            boxSizing: 'border-box',
                                                        }}
                                                    >
                                                        <div
                                                            className="wsus__single_courses_3"
                                                            style={{
                                                                margin: 0,
                                                                background: '#ffffff',
                                                                borderRadius: '10px',
                                                                boxShadow: '0px 4px 20px rgba(30, 30, 47, 0.10)',
                                                                overflow: 'hidden',
                                                            }}
                                                        >
                                                            {/* Course Thumbnail */}
                                                            <div
                                                                className="wsus__single_courses_3_img"
                                                                style={{ position: 'relative', height: '230px', overflow: 'hidden' }}
                                                            >
                                                                <img
                                                                    src={thumbnailSrc}
                                                                    alt={course.title}
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = '/frontend/assets/images/courses_3_img_1.jpg';
                                                                    }}
                                                                />
                                                                <span className="time">
                                                                    <i className="far fa-clock" style={{ marginRight: '5px' }}></i>
                                                                    {course.duration ? `${course.duration} Hours` : '15 Hours'}
                                                                </span>
                                                            </div>

                                                            {/* Course Body */}
                                                            <div className="wsus__single_courses_text_3">
                                                                {/* Star Ratings */}
                                                                <div className="rating_area" style={{ marginBottom: '10px' }}>
                                                                    <p className="rating" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                        {[1, 2, 3, 4, 5].map((star) => {
                                                                            const hasRating = course.reviews_avg_rating && Number(course.reviews_avg_rating) > 0;
                                                                            const isFilled = hasRating && star <= Math.round(Number(course.reviews_avg_rating));
                                                                            return (
                                                                                <i
                                                                                    key={star}
                                                                                    className={isFilled ? 'fas fa-star' : 'far fa-star'}
                                                                                    style={{ color: isFilled ? '#ff9800' : '#cbd5e1', fontSize: '13px' }}
                                                                                ></i>
                                                                            );
                                                                        })}
                                                                        <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '500', marginLeft: '4px' }}>
                                                                            ({course.reviews_avg_rating ? Number(course.reviews_avg_rating).toFixed(1) : '0.0'} Rating)
                                                                        </span>
                                                                    </p>
                                                                </div>

                                                                {/* Title */}
                                                                <Link
                                                                    className="title"
                                                                    href={courseUrl}
                                                                    style={{
                                                                        display: '-webkit-box',
                                                                        WebkitLineClamp: 2,
                                                                        WebkitBoxOrient: 'vertical',
                                                                        overflow: 'hidden',
                                                                        fontWeight: '700',
                                                                        fontSize: '18px',
                                                                        lineHeight: '1.4',
                                                                        marginBottom: '14px',
                                                                        color: '#1e1e2f',
                                                                    }}
                                                                >
                                                                    {course.title}
                                                                </Link>

                                                                {/* Lessons & Students */}
                                                                <ul style={{ display: 'flex', gap: '20px', margin: '0 0 16px', padding: 0 }}>
                                                                    <li style={{ listStyle: 'none' }}>
                                                                        {course.lessons_count ?? 0} Lessons
                                                                    </li>
                                                                    <li style={{ listStyle: 'none' }}>
                                                                        {course.enrollments_count ?? 0} Student
                                                                    </li>
                                                                </ul>

                                                                {/* Instructor */}
                                                                <div className="author" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                    <div
                                                                        className="img"
                                                                        style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden' }}
                                                                    >
                                                                        <img
                                                                            src={authorImg}
                                                                            alt={course.instructor?.name || 'Author'}
                                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                            onError={(e) => {
                                                                                e.target.onerror = null;
                                                                                e.target.src = '/frontend/assets/images/author_img_2.jpg';
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '500', color: '#1e1e2f' }}>
                                                                        {course.instructor?.name || 'Hermann P. Schnitzel'}
                                                                    </h4>
                                                                </div>
                                                            </div>

                                                            {/* Course Footer */}
                                                            <div className="wsus__single_courses_3_footer">
                                                                <Link
                                                                    className="common_btn"
                                                                    href={courseUrl}
                                                                    style={{
                                                                        padding: '7px 18px',
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        gap: '6px',
                                                                    }}
                                                                >
                                                                    Enroll
                                                                    <svg
                                                                        width="13"
                                                                        height="13"
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
                                                                <p style={{ margin: 0, fontWeight: '700', fontSize: '18px' }}>
                                                                    {course.discount ? (
                                                                        <del style={{ color: 'var(--paraColor, #888)', marginRight: '6px' }}>
                                                                            ${course.price}
                                                                        </del>
                                                                    ) : (course.price > 160 ? (
                                                                        <del style={{ color: 'var(--paraColor, #888)', marginRight: '6px' }}>
                                                                            ${course.price}
                                                                        </del>
                                                                    ) : null)}
                                                                    ${course.discount || course.price || '156.00'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
