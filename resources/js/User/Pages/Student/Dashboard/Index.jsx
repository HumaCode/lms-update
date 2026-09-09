import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StudentDashboardLayout from '../../../Layouts/StudentDashboardLayout';

export default function StudentDashboard({
    userCourses = 0,
    reviewCount = 0,
    orderCount = 0,
    orders = []
}) {
    return (
        <StudentDashboardLayout title="Student Dashboard" subtitle="Overview">
            <Head title="Student Dashboard - EduCore" />

            {/* Stat Cards */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-3 p-3 bg-primary text-white d-flex flex-row align-items-center justify-content-between">
                        <div>
                            <span className="text-white-50 small">Enrolled Courses</span>
                            <h3 className="fw-bold mb-0 text-white">{userCourses}</h3>
                        </div>
                        <div className="fs-1 text-white-50">
                            <i className="fas fa-graduation-cap"></i>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-3 p-3 bg-success text-white d-flex flex-row align-items-center justify-content-between">
                        <div>
                            <span className="text-white-50 small">Total Orders</span>
                            <h3 className="fw-bold mb-0 text-white">{orderCount}</h3>
                        </div>
                        <div className="fs-1 text-white-50">
                            <i className="fas fa-shopping-bag"></i>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-3 p-3 bg-warning text-white d-flex flex-row align-items-center justify-content-between">
                        <div>
                            <span className="text-white-50 small">My Reviews</span>
                            <h3 className="fw-bold mb-0 text-white">{reviewCount}</h3>
                        </div>
                        <div className="fs-1 text-white-50">
                            <i className="fas fa-star"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold text-dark mb-0">Recent Order History</h5>
                    <Link href={route('student.orders.index')} className="btn btn-outline-primary btn-sm">
                        View All Orders
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <p className="text-muted small mb-0 py-3 text-center">No orders placed yet.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light small">
                                <tr>
                                    <th>Invoice #</th>
                                    <th>Date</th>
                                    <th>Total Amount</th>
                                    <th>Payment Method</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className="small">
                                {orders.map((ord) => (
                                    <tr key={ord.id}>
                                        <td className="fw-bold text-dark">#{ord.invoice_id}</td>
                                        <td>{new Date(ord.created_at).toLocaleDateString()}</td>
                                        <td className="fw-bold text-primary">${Number(ord.total_amount || 0).toFixed(2)}</td>
                                        <td className="text-capitalize">{ord.payment_method}</td>
                                        <td>
                                            <span className={`badge ${ord.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                                                {ord.status}
                                            </span>
                                        </td>
                                        <td>
                                            <Link href={route('student.orders.show', ord.id)} className="btn btn-sm btn-outline-secondary">
                                                <i className="fas fa-eye"></i> View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </StudentDashboardLayout>
    );
}
