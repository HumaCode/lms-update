import React from 'react';

export default function CourseBreadcrumb({ course, reviewsCount = 0, avgRating = 0 }) {
    const formattedDate = course.updated_at
        ? new Date(course.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'Recent';

    const instructorImg = course.instructor?.image
        ? (course.instructor.image.startsWith('/') ? course.instructor.image : `/${course.instructor.image}`)
        : '/default-files/avatar.png';

    const ratingVal = Number(avgRating) || 0;

    return (
        <section
            className="wsus__breadcrumb course_details_breadcrumb"
            style={{ background: `url(/frontend/assets/images/breadcrumb_bg.jpg)` }}
        >
            <div className="wsus__breadcrumb_overlay">
                <div className="container">
                    <div className="row">
                        <div className="col-12 wow fadeInUp">
                            <div className="wsus__breadcrumb_text">
                                <p className="rating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <i
                                            key={star}
                                            className={star <= Math.round(ratingVal) ? 'fas fa-star' : 'far fa-star'}
                                        />
                                    ))}
                                    <span>({ratingVal.toFixed(1)} Reviews)</span>
                                </p>
                                <h1>{course.title}</h1>
                                <ul className="list">
                                    {course.instructor && (
                                        <li>
                                            <span>
                                                <img
                                                    src={instructorImg}
                                                    alt={course.instructor.name}
                                                    className="img-fluid"
                                                    style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/default-files/avatar.png';
                                                    }}
                                                />
                                            </span>
                                            By {course.instructor.name}
                                        </li>
                                    )}
                                    {course.category && (
                                        <li>
                                            <span>
                                                <img
                                                    src="/frontend/assets/images/globe_icon_blue.png"
                                                    alt="Globe"
                                                    className="img-fluid"
                                                />
                                            </span>
                                            {course.category.name}
                                        </li>
                                    )}
                                    <li>
                                        <span>
                                            <img
                                                src="/frontend/assets/images/calendar_blue.png"
                                                alt="Calendar"
                                                className="img-fluid"
                                            />
                                        </span>
                                        Last updated {formattedDate}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
