import React from 'react';
import { Link } from '@inertiajs/react';
import { formatCurrency, formatDate } from '@/Utils/formatters';
import { route } from '@/Utils/routes';

export default function RecentSalesTable({ orders = [] }) {
    const calculateEarnings = (price, commissionRate) => {
        const rate = Number(commissionRate) || 0;
        const p = Number(price) || 0;
        const commission = (p * rate) / 100;
        return p - commission;
    };

    return (
        <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-header bg-white border-bottom py-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
                <div>
                    <h5 className="fw-bold mb-0 text-dark">Recent Course Sales</h5>
                    <p className="text-muted small mb-0">Latest purchases and commission breakdown</p>
                </div>
                <Link href={route('instructor.orders.index')} className="btn btn-outline-secondary btn-sm">
                    View All Orders
                </Link>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: '40px' }}>#</th>
                            <th>Course</th>
                            <th>Student</th>
                            <th>Price</th>
                            <th>Platform Fee</th>
                            <th>Your Earning</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders && orders.length > 0 ? (
                            orders.map((item, idx) => (
                                <tr key={item.id || idx}>
                                    <td className="text-muted">{idx + 1}</td>
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
                                    <td className="text-muted small">
                                        {item.created_at ? formatDate(item.created_at) : '-'}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4 text-muted">
                                    <i className="fas fa-receipt fs-2 d-block mb-2 text-muted opacity-50"></i>
                                    No sales recorded yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
