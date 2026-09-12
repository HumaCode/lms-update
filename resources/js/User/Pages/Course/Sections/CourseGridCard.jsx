import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { getImageUrl, formatCurrency } from '@/Utils/formatters';

export default function CourseGridCard({ course }) {
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
    const instructorImg = getImageUrl(course.instructor?.image, '/frontend/assets/images/course_instructor_img.jpg');

    const formatDuration = (val) => {
        if (!val) return '15 Hours';
        if (typeof val === 'string' && val.toLowerCase().includes('hour')) return val;
        const num = parseInt(val, 10);
        if (isNaN(num)) return val;
        const h = Math.floor(num / 60);
        if (h > 0) return `${h} Hours`;
        return `${num} Mins`;
    };

    const hasRating = course.reviews_avg_rating !== null && course.reviews_avg_rating !== undefined && Number(course.reviews_avg_rating) > 0;
    const ratingVal = hasRating ? Number(course.reviews_avg_rating) : 0;

    const lessonsCount = course.lessons_count ?? (course.lessons ? course.lessons.length : 0);
    const studentsCount = course.enrollments_count ?? (course.enrollments ? course.enrollments.length : 0);

    const enrolledCourseIds = props?.user_enrolled_course_ids || [];
    const isEnrolled = enrolledCourseIds.includes(course.id) || Boolean(course.is_enrolled);

    return (
        <div
            className="wsus__single_courses_3"
            style={{
                borderRadius: '12px',
                background: '#ffffff',
                border: '1px solid #F1F5F9',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
                overflow: 'hidden',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.08)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.04)';
            }}
        >
            {/* Thumbnail with duration badge */}
            <div
                className="wsus__single_courses_3_img position-relative"
                style={{ height: '195px', overflow: 'hidden' }}
            >
                <Link href={route('courses.show', course.slug)}>
                    <img
                        src={thumbnail}
                        alt={course.title}
                        className="w-100 h-100 object-fit-cover"
                        style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '100%', transition: 'transform 0.4s ease' }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/frontend/assets/images/courses_img_1.jpg';
                        }}
                    />
                </Link>

                {/* Duration Badge */}
                <span
                    style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: '#2563EB',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    }}
                >
                    <i className="far fa-clock" style={{ fontSize: '11px' }}></i> {formatDuration(course.duration)}
                </span>
            </div>

            {/* Content Body */}
            <div
                className="wsus__single_courses_text_3"
                style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}
            >
                {/* Rating row */}
                <div className="d-flex align-items-center mb-2">
                    <div className="d-flex align-items-center gap-1 me-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <i
                                key={star}
                                className={hasRating && star <= Math.round(ratingVal) ? 'fas fa-star' : 'far fa-star'}
                                style={{
                                    color: hasRating && star <= Math.round(ratingVal) ? '#F59E0B' : '#CBD5E1',
                                    fontSize: '12px',
                                }}
                            />
                        ))}
                    </div>
                    <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
                        ({ratingVal.toFixed(1)} Rating)
                    </span>
                </div>

                {/* Course Title */}
                <Link
                    href={route('courses.show', course.slug)}
                    style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#0F172A',
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '44px',
                        marginBottom: '12px',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#2563EB')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#0F172A')}
                >
                    {course.title}
                </Link>

                {/* Lessons and Students count */}
                <div
                    className="d-flex align-items-center gap-3 mb-3"
                    style={{ fontSize: '13px', color: '#64748B' }}
                >
                    <span className="d-inline-flex align-items-center gap-1">
                        <i className="far fa-file-alt" style={{ color: '#94A3B8' }}></i> {lessonsCount} Lessons
                    </span>
                    <span className="d-inline-flex align-items-center gap-1">
                        <i className="fas fa-user-friends" style={{ color: '#94A3B8' }}></i> {studentsCount} Student
                    </span>
                </div>

                {/* Instructor author */}
                <div className="d-flex align-items-center mt-auto pt-2">
                    <div
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            marginRight: '10px',
                            flexShrink: 0,
                            background: '#F1F5F9',
                        }}
                    >
                        <img
                            src={instructorImg}
                            alt={course.instructor?.name || 'Instructor'}
                            className="w-100 h-100 object-fit-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/frontend/assets/images/course_instructor_img.jpg';
                            }}
                        />
                    </div>
                    <h4
                        style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#334155',
                            margin: 0,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {course.instructor?.name || 'Hermann P. Schnitzel'}
                    </h4>
                </div>
            </div>

            {/* Footer: Enroll button / Go to Course button and Price */}
            <div
                className="wsus__single_courses_3_footer"
                style={{
                    padding: '14px 22px',
                    borderTop: '1px solid #F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#ffffff',
                }}
            >
                {isEnrolled ? (
                    <Link
                        href={route('student.course-player.index', course.slug)}
                        style={{
                            width: '100%',
                            background: '#10B981',
                            color: '#ffffff',
                            borderRadius: '10px',
                            padding: '10px 16px',
                            fontSize: '14px',
                            fontWeight: 700,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#059669';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#10B981';
                        }}
                    >
                        <i className="far fa-play-circle" style={{ fontSize: '16px' }}></i> Go To Course
                    </Link>
                ) : (
                    <>
                        <Link
                            href={route('courses.show', course.slug)}
                            style={{
                                border: '1px solid #E2E8F0',
                                background: '#ffffff',
                                color: '#0F172A',
                                borderRadius: '6px',
                                padding: '6px 14px',
                                fontSize: '13px',
                                fontWeight: 600,
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#2563EB';
                                e.currentTarget.style.color = '#2563EB';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#E2E8F0';
                                e.currentTarget.style.color = '#0F172A';
                            }}
                        >
                            Enroll <i className="fas fa-arrow-right" style={{ fontSize: '11px' }}></i>
                        </Link>

                        <div className="d-flex flex-column align-items-end text-end ms-auto">
                            {isFree ? (
                                <span style={{ color: '#16A34A', fontWeight: 700, fontSize: '16px' }}>FREE</span>
                            ) : hasDiscount ? (
                                <>
                                    <del
                                        style={{
                                            color: '#94A3B8',
                                            fontWeight: 400,
                                            fontSize: '12px',
                                            lineHeight: '1.2',
                                            display: 'block',
                                        }}
                                    >
                                        {formatCurrency(course.price, settings)}
                                    </del>
                                    <span
                                        style={{
                                            color: '#0F172A',
                                            fontWeight: 700,
                                            fontSize: '16px',
                                            lineHeight: '1.2',
                                            display: 'block',
                                        }}
                                    >
                                        {formatCurrency(finalPrice, settings)}
                                    </span>
                                </>
                            ) : (
                                <span
                                    style={{
                                        color: '#0F172A',
                                        fontWeight: 700,
                                        fontSize: '16px',
                                        lineHeight: '1.2',
                                        display: 'block',
                                    }}
                                >
                                    {formatCurrency(finalPrice, settings)}
                                </span>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
