import React from 'react';
import { Head, Link } from '@inertiajs/react';
import InstructorLayout from '@/Instructor/Layouts/InstructorLayout';
import { formatCurrency } from '@/Utils/formatters';
import { route } from '@/Utils/routes';

export default function Index({ courses = [] }) {
    const renderStars = (rating) => {
        const rounded = Math.round(rating || 0);
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i
                    key={i}
                    className={`fas fa-star ${i <= rounded ? 'text-warning' : 'text-muted opacity-25'}`}
                    style={{ fontSize: '0.8rem' }}
                ></i>
            );
        }
        return <div className="d-flex gap-1 align-items-center">{stars}</div>;
    };

    return (
        <InstructorLayout
            title="My Courses"
            crumbs={[{ label: 'Courses' }]}
        >
            <Head title="Instructor Courses" />

            <div className="card border-0 shadow-sm rounded-3">
                <div className="card-header bg-white border-bottom py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
                    <div>
                        <h5 className="fw-bold mb-0 text-dark">Your Course Curriculum</h5>
                        <p className="text-muted small mb-0">Manage published courses, review feedback and update content</p>
                    </div>
                    <Link
                        href={route('instructor.courses.create')}
                        className="btn btn-primary px-3"
                    >
                        <i className="fas fa-plus me-1"></i> Add New Course
                    </Link>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Thumbnail</th>
                                <th>Course Details</th>
                                <th>Price</th>
                                <th>Students</th>
                                <th>Approval</th>
                                <th>Status</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.length > 0 ? (
                                courses.map((course) => (
                                    <tr key={course.id}>
                                        <td style={{ width: '90px' }}>
                                            <img
                                                src={course.thumbnail ? `/${course.thumbnail}` : '/frontend/assets/images/courses_img_1.jpg'}
                                                alt={course.title}
                                                className="rounded-2 shadow-sm"
                                                style={{ width: '80px', height: '52px', objectFit: 'cover' }}
                                            />
                                        </td>
                                        <td>
                                            <div className="fw-bold text-dark">{course.title}</div>
                                            <div className="d-flex align-items-center gap-2 small text-muted mt-1">
                                                <span>{renderStars(course.reviews_avg_rating)}</span>
                                                <span>•</span>
                                                <span className="badge bg-light text-dark border">
                                                    {course.category?.name || 'Uncategorized'}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="fw-bold text-dark">
                                                {formatCurrency(course.discount ? course.discount : course.price)}
                                            </div>
                                            {course.discount && (
                                                <small className="text-decoration-line-through text-muted d-block">
                                                    {formatCurrency(course.price)}
                                                </small>
                                            )}
                                        </td>
                                        <td>
                                            <span className="badge bg-secondary-subtle text-secondary px-2 py-1">
                                                {course.enrollments_count || 0} Students
                                            </span>
                                        </td>
                                        <td>
                                            {course.is_approved === 'approved' && (
                                                <span className="badge bg-success">Approved</span>
                                            )}
                                            {course.is_approved === 'pending' && (
                                                <span className="badge bg-warning text-dark">Pending</span>
                                            )}
                                            {course.is_approved === 'rejected' && (
                                                <span className="badge bg-danger">Rejected</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`badge ${course.status === 'active' ? 'bg-primary' : 'bg-secondary'}`}>
                                                {course.status}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <Link
                                                href={route('instructor.courses.edit', { id: course.id, step: 1 })}
                                                className="btn btn-outline-primary btn-sm px-3"
                                            >
                                                <i className="fas fa-edit me-1"></i> Manage
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">
                                        <i className="fas fa-graduation-cap fs-1 d-block mb-2 opacity-50"></i>
                                        You haven't created any courses yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </InstructorLayout>
    );
}
