import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StudentDashboardLayout from '@/Student/Layouts/StudentDashboardLayout';
import { getImageUrl } from '@/Utils/formatters';

export default function EnrolledCourses({ enrollments = [] }) {
    return (
        <StudentDashboardLayout title="Enrolled Courses" subtitle="My Learning">
            <Head title="Enrolled Courses - Student Dashboard" />

            {/* Custom High-Contrast Button Styling */}
            <style>{`
                .btn-continue-learning {
                    background-color: #2563eb !important;
                    color: #ffffff !important;
                    font-weight: 600 !important;
                    font-size: 0.95rem !important;
                    border: none !important;
                    padding: 10px 18px !important;
                    border-radius: 8px !important;
                    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25) !important;
                    transition: all 0.25s ease-in-out !important;
                    text-decoration: none !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    gap: 8px !important;
                    width: 100% !important;
                }
                .btn-continue-learning *,
                .btn-continue-learning span,
                .btn-continue-learning i,
                .btn-continue-learning:hover *,
                .btn-continue-learning:focus *,
                .btn-continue-learning:active * {
                    color: #ffffff !important;
                }
                .btn-continue-learning:hover,
                .btn-continue-learning:focus,
                .btn-continue-learning:active {
                    background-color: #1d4ed8 !important;
                    color: #ffffff !important;
                    transform: translateY(-2px) !important;
                    box-shadow: 0 6px 18px rgba(37, 99, 235, 0.4) !important;
                }
            `}</style>

            <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                    <h5 className="fw-bold text-dark mb-0">My Enrolled Courses ({enrollments.length})</h5>
                </div>

                {enrollments.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="fas fa-book-reader fa-3x text-muted mb-3 opacity-50"></i>
                        <h6 className="fw-semibold text-secondary">No courses enrolled yet</h6>
                        <p className="text-muted small">Explore our course catalog and start learning today!</p>
                        <Link href={route('courses.index')} className="btn btn-primary btn-sm px-4 rounded-pill mt-2">
                            Browse Courses
                        </Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        {enrollments.map((enr) => {
                            const course = enr.course;
                            if (!course) return null;

                            const ratingVal = course.reviews_avg_rating ? Number(course.reviews_avg_rating) : 0;

                            return (
                                <div className="col-lg-4 col-md-6" key={enr.id}>
                                    <div
                                        className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white"
                                        style={{ transition: 'all 0.3s ease' }}
                                    >
                                        {/* Thumbnail Container */}
                                        <div
                                            className="position-relative overflow-hidden"
                                            style={{ height: '195px', width: '100%', backgroundColor: '#f8fafc' }}
                                        >
                                            <Link href={route('student.course-player.index', course.slug)}>
                                                <img
                                                    src={getImageUrl(course.thumbnail, '/frontend/assets/images/courses_img_1.jpg')}
                                                    alt={course.title}
                                                    style={{
                                                        objectFit: 'cover',
                                                        objectPosition: 'center',
                                                        width: '100%',
                                                        height: '100%',
                                                        display: 'block',
                                                        transition: 'transform 0.4s ease',
                                                    }}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/frontend/assets/images/courses_img_1.jpg';
                                                    }}
                                                />
                                            </Link>

                                            {/* Duration Badge Top Right */}
                                            <span
                                                className="badge position-absolute shadow-sm"
                                                style={{
                                                    top: '12px',
                                                    right: '12px',
                                                    backgroundColor: '#2563eb',
                                                    color: '#ffffff',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    zIndex: 2,
                                                }}
                                            >
                                                <i className="far fa-clock"></i>
                                                {course.duration ? `${course.duration} Hours` : (course.category?.name || '1 Hours')}
                                            </span>
                                        </div>

                                        {/* Content Body */}
                                        <div className="card-body p-3.5 p-md-4 d-flex flex-column">
                                            {/* Rating Row */}
                                            <div className="d-flex align-items-center mb-2">
                                                <div className="d-flex align-items-center gap-1 me-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <i
                                                            key={star}
                                                            className={ratingVal > 0 && star <= Math.round(ratingVal) ? 'fas fa-star' : 'far fa-star'}
                                                            style={{
                                                                color: ratingVal > 0 && star <= Math.round(ratingVal) ? '#F59E0B' : '#CBD5E1',
                                                                fontSize: '13px',
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="small fw-medium" style={{ color: '#2563eb', fontSize: '13px' }}>
                                                    ({ratingVal > 0 ? ratingVal.toFixed(1) : '0.0'} Rating)
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h6 className="fw-bold mb-1">
                                                <Link
                                                    href={route('student.course-player.index', course.slug)}
                                                    className="text-dark text-decoration-none text-truncate-2"
                                                    style={{ fontSize: '1.02rem', lineHeight: '1.4' }}
                                                >
                                                    {course.title}
                                                </Link>
                                            </h6>

                                            {/* Instructor */}
                                            <p className="small text-muted mb-3">
                                                Instructor: {course.instructor?.name || 'Instructor'}
                                            </p>

                                            {/* Continue Learning Action Button */}
                                            <div className="mt-auto pt-2">
                                                <Link
                                                    href={route('student.course-player.index', course.slug)}
                                                    className="btn-continue-learning"
                                                >
                                                    <i className="fas fa-play-circle fs-6 text-white"></i>
                                                    <span className="text-white fw-semibold">Continue Learning</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </StudentDashboardLayout>
    );
}
