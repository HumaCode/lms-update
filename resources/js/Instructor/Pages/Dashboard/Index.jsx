import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import InstructorLayout from '@/Instructor/Layouts/InstructorLayout';
import StatCard from '@/Instructor/Components/StatCard';
import { formatCurrency } from '@/Utils/formatters';
import { route } from '@/Utils/routes';

export default function Index({
    pendingCourses = 0,
    approvedCourses = 0,
    rejectedCourses = 0,
    orderItems = [],
}) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const calculateEarnings = (price, commissionRate) => {
        const rate = Number(commissionRate) || 0;
        const p = Number(price) || 0;
        const commission = (p * rate) / 100;
        return p - commission;
    };

    return (
        <InstructorLayout title="Instructor Studio">
            <Head title="Instructor Dashboard" />

            {/* STATUS ALERT */}
            {user?.approve_status === 'pending' && (
                <div className="alert alert-warning border-0 shadow-sm d-flex align-items-center gap-3 mb-4 rounded-3 p-3">
                    <i className="fas fa-clock fs-3 text-warning"></i>
                    <div>
                        <div className="fw-bold">Instructor Application Pending Review</div>
                        <div className="small text-muted">
                            Hi <strong>{user.name}</strong>, your instructor application is currently under review by our administration team. You will be notified via email once approved.
                        </div>
                    </div>
                </div>
            )}

            {/* STAT CARDS */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <StatCard
                        title="Approved Courses"
                        value={approvedCourses}
                        icon="fas fa-check-circle"
                        variant="success"
                    />
                </div>
                <div className="col-md-4">
                    <StatCard
                        title="Pending Review"
                        value={pendingCourses}
                        icon="fas fa-hourglass-half"
                        variant="warning"
                    />
                </div>
                <div className="col-md-4">
                    <StatCard
                        title="Rejected Courses"
                        value={rejectedCourses}
                        icon="fas fa-times-circle"
                        variant="danger"
                    />
                </div>
            </div>

            {/* QUICK ACTIONS & RECENT ORDERS */}
            <div className="card border-0 shadow-sm rounded-3">
                <div className="card-header bg-white border-bottom py-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
                    <div>
                        <h5 className="fw-bold mb-0 text-dark">Recent Course Sales</h5>
                        <p className="text-muted small mb-0">Latest purchases of your published courses</p>
                    </div>
                    <div className="d-flex gap-2">
                        <Link href={route('instructor.courses.create')} className="btn btn-primary btn-sm px-3">
                            <i className="fas fa-plus me-1"></i> Create New Course
                        </Link>
                        <Link href={route('instructor.orders.index')} className="btn btn-outline-secondary btn-sm">
                            View All Sales
                        </Link>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Course Name</th>
                                <th>Student</th>
                                <th>Price</th>
                                <th>Fee</th>
                                <th>Your Earning</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.length > 0 ? (
                                orderItems.map((item, idx) => (
                                    <tr key={item.id || idx}>
                                        <td className="text-muted" style={{ width: '40px' }}>
                                            {idx + 1}
                                        </td>
                                        <td>
                                            <div className="fw-semibold text-dark">
                                                {item.course?.title || 'Course'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="fw-medium text-dark">
                                                {item.order?.customer?.name || 'Student'}
                                            </div>
                                            <div className="small text-muted">
                                                {item.order?.customer?.email || ''}
                                            </div>
                                        </td>
                                        <td className="fw-medium">
                                            {formatCurrency(item.price, item.order?.currency)}
                                        </td>
                                        <td className="text-muted">
                                            {item.commission_rate ?? 0}%
                                        </td>
                                        <td className="fw-bold text-success">
                                            {formatCurrency(
                                                calculateEarnings(item.price, item.commission_rate),
                                                item.order?.currency
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">
                                        <i className="fas fa-receipt fs-1 d-block mb-2 text-muted opacity-50"></i>
                                        No course sales recorded yet. Publish your courses to start earning!
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
