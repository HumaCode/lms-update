import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { notifySuccess, notifyError } from '@/Utils/notifications';
import { formatCurrency } from '@/Utils/formatters';

export default function CourseCard({ course }) {
    const { props } = usePage();
    const settings = props?.settings || {};

    const [adding, setAdding] = useState(false);

    const numPrice = Number(course.price || 0);
    const numDiscount = Number(course.discount || 0);
    const finalPrice = course.final_price !== undefined ? Number(course.final_price) : (
        numDiscount > 0 && numDiscount < numPrice ? (numPrice - numDiscount) : (numDiscount > 0 ? numDiscount : numPrice)
    );
    const hasDiscount = numDiscount > 0 && finalPrice < numPrice;
    const isFree = numPrice === 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        setAdding(true);
        router.post(
            route('cart.store'),
            { course_id: course.id },
            {
                preserveScroll: true,
                onSuccess: () => {
                    notifySuccess('Course added to cart!');
                    setAdding(false);
                },
                onError: (errs) => {
                    notifyError(errs.message || 'Failed to add course to cart.');
                    setAdding(false);
                },
            }
        );
    };

    const convertDuration = (minutes) => {
        if (!minutes) return '0h 0m';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    const hasRating = course.reviews_avg_rating !== null && course.reviews_avg_rating !== undefined && Number(course.reviews_avg_rating) > 0;
    const avgRating = hasRating ? Math.round(Number(course.reviews_avg_rating)) : 0;

    const getImageUrl = (url, defaultImg = '/frontend/assets/images/courses_img_1.jpg') => {
        if (!url) return defaultImg;
        if (typeof url !== 'string') return defaultImg;
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        if (url.startsWith('/')) return url;
        return `/${url}`;
    };

    return (
        <div className="wsus__single_courses_3">
            <div className="wsus__single_courses_3_img">
                <img
                    src={getImageUrl(course.thumbnail)}
                    alt={course.title}
                    className="img-fluid"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/frontend/assets/images/courses_img_1.jpg';
                    }}
                />
                <span className="time">
                    <i className="far fa-clock"></i> {convertDuration(course.duration)}
                </span>
            </div>
            <div className="wsus__single_courses_text_3">
                <div className="rating_area">
                    <p className="rating">
                        {[...Array(5)].map((_, i) => (
                            <i
                                key={i}
                                className={hasRating && i < avgRating ? 'fas fa-star' : 'far fa-star'}
                            ></i>
                        ))}
                        <span>({hasRating ? Number(course.reviews_avg_rating).toFixed(1) : '0.0'} Rating)</span>
                    </p>
                </div>

                <Link className="title" href={route('courses.show', course.slug)}>
                    {course.title}
                </Link>
                <ul>
                    <li>{course.lessons_count ?? 0} Lessons</li>
                    <li>{course.enrollments_count ?? 0} Students</li>
                </ul>
                <div className="author">
                    <div className="img">
                        <img
                            src={course.instructor?.image ? `/${course.instructor.image}` : '/default-files/avatar.png'}
                            alt={course.instructor?.name || 'Instructor'}
                            className="img-fluid"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/default-files/avatar.png';
                            }}
                        />
                    </div>
                    <h4>{course.instructor?.name || 'Instructor'}</h4>
                </div>
            </div>
            <div className="wsus__single_courses_3_footer align-items-center">
                {isFree ? (
                    <Link
                        className="common_btn"
                        href={route('courses.show', course.slug)}
                    >
                        Enroll <i className="fas fa-arrow-right"></i>
                    </Link>
                ) : (
                    <a
                        className="common_btn add_to_cart"
                        href="#"
                        onClick={handleAddToCart}
                        style={{ pointerEvents: adding ? 'none' : 'auto', opacity: adding ? 0.7 : 1 }}
                    >
                        {adding ? 'Adding...' : 'Add to Cart'}{' '}
                        <i className="fas fa-arrow-right"></i>
                    </a>
                )}
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
                                {formatCurrency(numPrice, settings)}
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
            </div>
        </div>
    );
}
