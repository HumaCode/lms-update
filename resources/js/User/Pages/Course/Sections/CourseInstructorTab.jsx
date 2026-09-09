import React from 'react';

export default function CourseInstructorTab({
    instructor,
    reviewsCount = 0,
    avgRating = 0,
    totalStudents = 0,
}) {
    const defaultInstructorImg = '/frontend/assets/images/course_instructor_img.jpg';

    const instructorImg = instructor?.image
        ? (instructor.image.startsWith('/') ? instructor.image : `/${instructor.image}`)
        : defaultInstructorImg;

    const ratingVal = avgRating && Number(avgRating) > 0 ? Number(avgRating) : 4.7;
    const displayReviews = reviewsCount && Number(reviewsCount) > 0 ? reviewsCount.toLocaleString() : '74,537';
    const displayCourses = instructor?.courses_count && Number(instructor.courses_count) > 0 ? instructor.courses_count : 8;
    const displayStudents = totalStudents && Number(totalStudents) > 0 ? totalStudents.toLocaleString() : 32;

    const name = instructor?.name || 'Instructor';
    const headline = instructor?.headline || 'IT Technician at IBM';
    const bio =
        instructor?.bio ||
        'Sed mi leo placerat nulla Donec pharetra rutrum ullamcorpe Ut eget convallis mi. Sed cursus aliquam Nula sed allium lectus fermentum enim Nam maximus pretium consectetu lacinia finibus.';

    return (
        <div
            className="wsus__courses_instructor box_area"
            style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '36px 36px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                border: 'none',
            }}
        >
            <h3
                style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    color: '#111827',
                    marginTop: 0,
                    marginBottom: '24px',
                }}
            >
                Instructor Details
            </h3>

            <div className="row align-items-center g-4">
                {/* Left Column: Square Rounded Photo */}
                <div className="col-lg-4 col-md-5 d-flex justify-content-center justify-content-md-start">
                    <div
                        style={{
                            width: '100%',
                            maxWidth: '280px',
                            aspectRatio: '1 / 1',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            background: '#F9FAFB',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                        }}
                    >
                        <img
                            src={instructorImg}
                            alt={name}
                            className="w-100 h-100"
                            style={{ objectFit: 'cover' }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = defaultInstructorImg;
                            }}
                        />
                    </div>
                </div>

                {/* Right Column: Instructor Details */}
                <div className="col-lg-8 col-md-7">
                    <div>
                        <h4
                            style={{
                                fontSize: '22px',
                                fontWeight: 700,
                                color: '#111827',
                                marginBottom: '4px',
                            }}
                        >
                            {name}
                        </h4>
                        <p
                            style={{
                                fontSize: '15px',
                                color: '#9CA3AF',
                                fontWeight: 400,
                                marginBottom: '18px',
                            }}
                        >
                            {headline}
                        </p>

                        {/* Meta Stats Row - Guaranteed single-line per item */}
                        <div
                            className="d-flex flex-wrap align-items-center gap-3 mb-3"
                            style={{ rowGap: '10px' }}
                        >
                            {/* Reviews */}
                            <div
                                className="d-inline-flex align-items-center"
                                style={{
                                    whiteSpace: 'nowrap',
                                    fontSize: '14px',
                                    color: '#111827',
                                }}
                            >
                                <i className="fas fa-star me-1" style={{ color: '#F59E0B' }}></i>
                                <span style={{ fontWeight: 500, color: '#4B5563' }}>
                                    {displayReviews} Reviews
                                </span>
                            </div>

                            {/* Rating Badge */}
                            <div style={{ whiteSpace: 'nowrap' }}>
                                <span
                                    style={{
                                        background: '#F8C23C',
                                        color: '#111827',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        padding: '4px 10px',
                                        borderRadius: '5px',
                                        display: 'inline-block',
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {ratingVal.toFixed(1)} Rating
                                </span>
                            </div>

                            {/* Courses */}
                            <div
                                className="d-inline-flex align-items-center"
                                style={{
                                    whiteSpace: 'nowrap',
                                    fontSize: '14px',
                                    color: '#4B5563',
                                }}
                            >
                                <img
                                    src="/frontend/assets/images/book_icon.png"
                                    alt="book"
                                    style={{
                                        width: '18px',
                                        height: '18px',
                                        objectFit: 'contain',
                                        marginRight: '6px',
                                    }}
                                />
                                <span>{displayCourses} Courses</span>
                            </div>

                            {/* Students */}
                            <div
                                className="d-inline-flex align-items-center"
                                style={{
                                    whiteSpace: 'nowrap',
                                    fontSize: '14px',
                                    color: '#4B5563',
                                }}
                            >
                                <img
                                    src="/frontend/assets/images/user_icon_gray.png"
                                    alt="user"
                                    style={{
                                        width: '18px',
                                        height: '18px',
                                        objectFit: 'contain',
                                        marginRight: '6px',
                                    }}
                                />
                                <span>{displayStudents} Students</span>
                            </div>
                        </div>

                        {/* Badges Row */}
                        <div className="d-flex flex-wrap align-items-center gap-2 my-3">
                            <div title="Exclusive Author" style={{ width: '32px', height: '32px' }}>
                                <img
                                    src="/frontend/assets/images/badge_1.png"
                                    alt="Exclusive Author"
                                    className="img-fluid w-100 h-100 object-fit-contain"
                                />
                            </div>
                            <div title="Top Earning" style={{ width: '32px', height: '32px' }}>
                                <img
                                    src="/frontend/assets/images/badge_2.png"
                                    alt="Top Earning"
                                    className="img-fluid w-100 h-100 object-fit-contain"
                                />
                            </div>
                            <div title="Trending" style={{ width: '32px', height: '32px' }}>
                                <img
                                    src="/frontend/assets/images/badge_3.png"
                                    alt="Trending"
                                    className="img-fluid w-100 h-100 object-fit-contain"
                                />
                            </div>
                            <div title="2 Years of Membership" style={{ width: '32px', height: '32px' }}>
                                <img
                                    src="/frontend/assets/images/badge_4.png"
                                    alt="2 Years of Membership"
                                    className="img-fluid w-100 h-100 object-fit-contain"
                                />
                            </div>
                            <div title="Collector Level 1" style={{ width: '32px', height: '32px' }}>
                                <img
                                    src="/frontend/assets/images/badge_5.png"
                                    alt="Collector Level 1"
                                    className="img-fluid w-100 h-100 object-fit-contain"
                                />
                            </div>
                        </div>

                        {/* Description / Bio */}
                        <p
                            style={{
                                fontSize: '14px',
                                lineHeight: '1.65',
                                color: '#4B5563',
                                marginTop: '16px',
                                marginBottom: '22px',
                            }}
                        >
                            {bio}
                        </p>

                        {/* Social Link Buttons */}
                        <div className="d-flex flex-wrap align-items-center gap-2">
                            {[
                                { icon: 'fab fa-twitter', href: instructor?.x || '#' },
                                { icon: 'fab fa-facebook-f', href: instructor?.facebook || '#' },
                                { icon: 'fab fa-linkedin-in', href: instructor?.linkedin || '#' },
                                { icon: 'fab fa-pinterest-p', href: instructor?.website || '#' },
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '50%',
                                        border: '1px solid #E5E7EB',
                                        color: '#4B5563',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '14px',
                                        textDecoration: 'none',
                                        transition: 'all 0.25s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'var(--colorPrimary)';
                                        e.currentTarget.style.borderColor = 'var(--colorPrimary)';
                                        e.currentTarget.style.color = '#fff';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.borderColor = '#E5E7EB';
                                        e.currentTarget.style.color = '#4B5563';
                                    }}
                                >
                                    <i className={social.icon}></i>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
