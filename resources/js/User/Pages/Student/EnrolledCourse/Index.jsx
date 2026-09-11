import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StudentDashboardLayout from '../../../Layouts/StudentDashboardLayout';
import { getImageUrl } from '@/Utils/formatters';

export default function EnrolledCourses({ enrollments = [] }) {
    return (
        <StudentDashboardLayout title="Enrolled Courses" subtitle="My Learning">
            <Head title="Enrolled Courses - Student Dashboard" />

            <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
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

                            return (
                                <div className="col-lg-4 col-md-6" key={enr.id}>
                                    <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden transition-all hover-lift">
                                        <div className="position-relative overflow-hidden" style={{ height: '180px' }}>
                                            <img
                                                src={getImageUrl(course.thumbnail, '/frontend/assets/images/courses_img_1.jpg')}
                                                alt={course.title}
                                                className="w-100 h-100"
                                                style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '100%', transition: 'transform 0.3s ease' }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/frontend/assets/images/courses_img_1.jpg';
                                                }}
                                            />
                                            {course.category && (
                                                <span className="badge bg-primary position-absolute top-0 start-0 m-2 shadow-sm">
                                                    {course.category.name}
                                                </span>
                                            )}
                                        </div>

                                        <div className="card-body p-3 d-flex flex-column">
                                            <h6 className="fw-bold mb-2">
                                                <Link
                                                    href={route('student.course-player.index', course.slug)}
                                                    className="text-dark text-decoration-none text-truncate-2"
                                                >
                                                    {course.title}
                                                </Link>
                                            </h6>

                                            <p className="small text-muted mb-3">
                                                Instructor: {course.instructor?.name || 'Tutor'}
                                            </p>

                                            <div className="mt-auto">
                                                <Link
                                                    href={route('student.course-player.index', course.slug)}
                                                    className="btn btn-primary btn-sm w-100 shadow-sm"
                                                >
                                                    <i className="fas fa-play-circle me-1"></i> Continue Learning
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
