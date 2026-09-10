import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { notifySuccess, notifyError } from '@/Utils/notifications';

export default function CourseCard({ course }) {
    const [adding, setAdding] = useState(false);

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

    const avgRating = course.reviews_avg_rating ? Math.round(course.reviews_avg_rating) : 5;

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
                                className={i < avgRating ? 'fas fa-star' : 'far fa-star'}
                            ></i>
                        ))}
                        <span>({course.reviews_avg_rating ? Number(course.reviews_avg_rating).toFixed(1) : '5.0'} Rating)</span>
                    </p>
                </div>

                <Link className="title" href={route('courses.show', course.slug)}>
                    {course.title}
                </Link>
                <ul>
                    <li>{course.lessons_count || 0} Lessons</li>
                    <li>{course.enrollments_count || 0} Students</li>
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
            <div className="wsus__single_courses_3_footer">
                <a
                    className="common_btn add_to_cart"
                    href="#"
                    onClick={handleAddToCart}
                    style={{ pointerEvents: adding ? 'none' : 'auto', opacity: adding ? 0.7 : 1 }}
                >
                    {adding ? 'Adding...' : 'Add to Cart'}{' '}
                    <i className="far fa-arrow-right"></i>
                </a>
                <p>
                    {course.discount > 0 ? (
                        <>
                            <del>${course.price}</del> ${course.discount}
                        </>
                    ) : (
                        course.price > 0 ? `$${course.price}` : 'Free'
                    )}
                </p>
            </div>
        </div>
    );
}
