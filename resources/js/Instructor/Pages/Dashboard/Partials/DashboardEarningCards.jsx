import React from 'react';
import { usePage } from '@inertiajs/react';
import { formatCurrency } from '@/Utils/formatters';

export default function DashboardEarningCards({ metrics = {} }) {
    const { settings } = usePage().props;
    const totalRevenue = Number(metrics.total_revenue) || 0;
    const thisMonthEarning = Number(metrics.this_month_earning) || 0;
    const totalStudents = Number(metrics.total_students) || 0;
    const coursesRating = Number(metrics.courses_rating) || 0;
    const totalReviews = Number(metrics.total_reviews) || 0;
    const approvedCourses = Number(metrics.approved_courses) || 0;
    const pendingCourses = Number(metrics.pending_courses) || 0;
    const rejectedCourses = Number(metrics.rejected_courses) || 0;

    return (
        <div className="mb-4">
            <div className="row g-4">
                {/* REVENUE CARD */}
                <div className="col-xl-4 col-sm-6">
                    <div className="wsus__dash_earning shadow-sm h-100 mt-0">
                        <h6>REVENUE</h6>
                        <h3 className="text-dark fw-bold">{formatCurrency(totalRevenue, settings)}</h3>
                        <p className="mb-0">
                            <i className="fas fa-calendar-alt me-1"></i>
                            {thisMonthEarning > 0
                                ? `${formatCurrency(thisMonthEarning, settings)} this month`
                                : 'Earning this month'}
                        </p>
                    </div>
                </div>

                {/* STUDENTS ENROLLMENTS CARD */}
                <div className="col-xl-4 col-sm-6">
                    <div className="wsus__dash_earning shadow-sm h-100 mt-0">
                        <h6>STUDENTS ENROLLMENTS</h6>
                        <h3 className="text-dark fw-bold">{totalStudents.toLocaleString()}</h3>
                        <p className="mb-0">
                            <i className="fas fa-user-graduate me-1"></i>
                            Total Enrolled Students
                        </p>
                    </div>
                </div>

                {/* COURSES RATING CARD */}
                <div className="col-xl-4 col-sm-6">
                    <div className="wsus__dash_earning shadow-sm h-100 mt-0">
                        <h6>COURSES RATING</h6>
                        <h3 className="text-dark fw-bold d-flex align-items-center gap-2">
                            <span>{coursesRating > 0 ? coursesRating.toFixed(2) : '5.00'}</span>
                            <span className="fs-6 text-warning">
                                <i className="fas fa-star"></i>
                            </span>
                        </h3>
                        <p className="mb-0">
                            <i className="fas fa-comment-dots me-1"></i>
                            {totalReviews > 0 ? `${totalReviews} reviews` : 'Rating overview'}
                        </p>
                    </div>
                </div>
            </div>

            {/* QUICK COURSE STATUS STRIP */}
            <div className="d-flex flex-wrap gap-2 mt-3 pt-2">
                <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fs-7 d-flex align-items-center gap-2">
                    <i className="fas fa-check-circle"></i>
                    <span><strong>{approvedCourses}</strong> Approved Courses</span>
                </span>
                <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-3 py-2 rounded-pill fs-7 d-flex align-items-center gap-2">
                    <i className="fas fa-clock"></i>
                    <span><strong>{pendingCourses}</strong> Pending Review</span>
                </span>
                {rejectedCourses > 0 && (
                    <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 rounded-pill fs-7 d-flex align-items-center gap-2">
                        <i className="fas fa-times-circle"></i>
                        <span><strong>{rejectedCourses}</strong> Rejected</span>
                    </span>
                )}
            </div>
        </div>
    );
}
