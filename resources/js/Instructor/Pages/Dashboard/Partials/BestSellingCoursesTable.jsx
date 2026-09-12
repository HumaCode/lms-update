import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { formatCurrency } from '@/Utils/formatters';
import { route } from '@/Utils/routes';

export default function BestSellingCoursesTable({ courses = [] }) {
    const { settings } = usePage().props;
    // Render 5 star rating icons based on score
    const renderStars = (rating = 5) => {
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 >= 0.5;
        const emptyStars = Math.max(0, 5 - fullStars - (hasHalf ? 1 : 0));

        return (
            <p className="rating mb-1">
                {[...Array(fullStars)].map((_, i) => (
                    <i key={`f-${i}`} className="fas fa-star text-warning" aria-hidden="true"></i>
                ))}
                {hasHalf && <i className="fas fa-star-half-alt text-warning" aria-hidden="true"></i>}
                {[...Array(emptyStars)].map((_, i) => (
                    <i key={`e-${i}`} className="far fa-star text-muted" aria-hidden="true"></i>
                ))}
                <span className="ms-1 fw-bold">({Number(rating).toFixed(1)})</span>
            </p>
        );
    };

    return (
        <div className="wsus__dashboard_contant shadow-sm mb-4">
            <div className="wsus__dashboard_contant_top d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div className="wsus__dashboard_heading">
                    <h5 className="mb-0 text-dark fw-bold">Best Selling Courses</h5>
                    <p className="text-muted small mb-0">Overview of your most enrolled and highest grossing courses</p>
                </div>
                <div className="d-flex gap-2">
                    <Link
                        href={route('instructor.courses.create')}
                        className="btn btn-primary btn-sm px-3 d-flex align-items-center gap-2 text-white fw-bold shadow-sm"
                        style={{ color: '#ffffff' }}
                    >
                        <i className="fas fa-plus text-white"></i>
                        <span className="text-white">New Course</span>
                    </Link>
                    <Link
                        href={route('instructor.courses.index')}
                        className="btn btn-outline-secondary btn-sm px-3"
                    >
                        View All
                    </Link>
                </div>
            </div>

            <div className="wsus__dash_course_table m-0">
                <div className="table-responsive">
                    <table className="table table-borderless align-middle mb-0">
                        <thead className="border-bottom">
                            <tr>
                                <th className="image ps-4" style={{ width: '180px' }}>COURSES</th>
                                <th className="details">DETAILS</th>
                                <th className="sale text-center" style={{ width: '120px' }}>SALES</th>
                                <th className="amount text-end pe-4" style={{ width: '180px' }}>AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses && courses.length > 0 ? (
                                courses.map((course) => (
                                    <tr key={course.id} className="border-bottom">
                                        <td className="image py-3 ps-4">
                                            <div className="image_category position-relative">
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="img-fluid rounded-3"
                                                    style={{ width: '150px', height: '90px', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/frontend/assets/images/courses_3_img_1.jpg';
                                                    }}
                                                />
                                                {course.category && (
                                                    <span
                                                        className="badge bg-white text-dark shadow-sm position-absolute rounded-pill px-2 py-1 small"
                                                        style={{ bottom: '8px', left: '8px', fontSize: '11px' }}
                                                    >
                                                        {course.category}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="details py-3">
                                            {renderStars(course.rating)}
                                            <Link
                                                href={route('instructor.courses.edit', course.id)}
                                                className="title fw-bold text-dark text-decoration-none d-block fs-6 mb-1 hover-primary"
                                                title={course.title}
                                            >
                                                {course.title}
                                            </Link>
                                            <div className="text-muted small">
                                                <span>
                                                    Price:{' '}
                                                    {course.has_discount ? (
                                                        <>
                                                            <del className="text-muted me-1">{formatCurrency(course.price, settings)}</del>
                                                            <strong className="text-danger me-1">{formatCurrency(course.final_price, settings)}</strong>
                                                            <span className="badge bg-danger-subtle text-danger px-1 py-0 small">
                                                                -{Math.round(((course.price - course.final_price) / course.price) * 100)}%
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <strong>{formatCurrency(course.price, settings)}</strong>
                                                    )}
                                                </span>
                                                {course.reviews_count > 0 && (
                                                    <span className="ms-2">({course.reviews_count} reviews)</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="sale py-3 text-center">
                                            <span className="badge bg-primary-subtle text-primary fs-6 px-3 py-2 rounded-pill">
                                                {course.sales_count}
                                            </span>
                                        </td>
                                        <td className="amount py-3 text-end pe-4">
                                            <div className="fw-bold fs-6 text-success">
                                                {formatCurrency(course.earning ?? course.amount, settings)}
                                            </div>
                                            <div className="text-muted small">Total earned</div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-5 text-muted">
                                        <i className="fas fa-graduation-cap fs-1 d-block mb-3 text-muted opacity-50"></i>
                                        <div className="fw-semibold">No courses published yet</div>
                                        <p className="small text-muted mt-1">Start by creating your first course and reach thousands of learners!</p>
                                        <Link href={route('instructor.courses.create')} className="btn btn-primary btn-sm mt-2">
                                            Create Course
                                        </Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
