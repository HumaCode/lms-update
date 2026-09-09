import React from 'react';
import { Head } from '@inertiajs/react';
import InstructorLayout from '@/Instructor/Layouts/InstructorLayout';
import Pagination from '@/Components/UI/Pagination';
import { formatCurrency, formatDate } from '@/Utils/formatters';

export default function Index({ orderItems }) {
    const calculateEarnings = (price, commissionRate) => {
        const rate = Number(commissionRate) || 0;
        const p = Number(price) || 0;
        const commission = (p * rate) / 100;
        return p - commission;
    };

    return (
        <InstructorLayout
            title="Course Orders & Sales"
            crumbs={[{ label: 'Orders' }]}
        >
            <Head title="Course Orders" />

            <div className="card border-0 shadow-sm rounded-3">
                <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="fw-bold mb-0 text-dark">Course Sales History</h5>
                        <p className="text-muted small mb-0">Record of enrollments in your courses</p>
                    </div>
                    <span className="badge bg-primary text-white">
                        {orderItems.total || orderItems.data?.length || 0} Total Orders
                    </span>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Course</th>
                                <th>Student</th>
                                <th>Gross Price</th>
                                <th>Platform Fee</th>
                                <th>Your Earnings</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.data && orderItems.data.length > 0 ? (
                                orderItems.data.map((item, idx) => (
                                    <tr key={item.id}>
                                        <td className="text-muted" style={{ width: '40px' }}>
                                            {(orderItems.current_page - 1) * orderItems.per_page + idx + 1}
                                        </td>
                                        <td>
                                            <div className="fw-semibold text-dark">
                                                {item.course?.title || 'Course'}
                                            </div>
                                            <div className="small text-muted">
                                                Invoice #{item.order?.invoice_id || item.order_id}
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
                                        <td className="text-muted small">
                                            {formatDate(item.created_at)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">
                                        <i className="fas fa-box-open fs-1 d-block mb-2 opacity-50"></i>
                                        No sales records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {orderItems.links && (
                    <div className="card-footer bg-white border-top d-flex justify-content-between align-items-center py-3">
                        <Pagination links={orderItems.links} />
                    </div>
                )}
            </div>
        </InstructorLayout>
    );
}
