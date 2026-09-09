import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StudentDashboardLayout from '../../../Layouts/StudentDashboardLayout';

export default function StudentOrderIndex({ orders }) {
    const orderList = orders?.data || [];

    return (
        <StudentDashboardLayout title="Order History" subtitle="Orders">
            <Head title="Order History - Student Dashboard" />

            <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
                <h5 className="fw-bold text-dark mb-4">My Orders</h5>

                {orderList.length === 0 ? (
                    <p className="text-muted small py-4 text-center">No orders recorded.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light small">
                                <tr>
                                    <th>Invoice #</th>
                                    <th>Date</th>
                                    <th>Total Amount</th>
                                    <th>Payment Method</th>
                                    <th>Payment Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className="small">
                                {orderList.map((ord) => (
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
                                            <Link href={route('student.orders.show', ord.id)} className="btn btn-sm btn-outline-primary">
                                                <i className="fas fa-file-invoice me-1"></i> Invoice
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {orders?.links && orders.links.length > 3 && (
                    <div className="d-flex justify-content-center mt-4">
                        <ul className="pagination pagination-sm shadow-sm mb-0">
                            {orders.links.map((link, idx) => (
                                <li key={idx} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                                    <Link href={link.url || '#'} className="page-link" dangerouslySetInnerHTML={{ __html: link.label }} />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </StudentDashboardLayout>
    );
}
