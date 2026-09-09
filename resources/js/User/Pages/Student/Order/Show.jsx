import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StudentDashboardLayout from '../../../Layouts/StudentDashboardLayout';

export default function StudentOrderShow({ order }) {
    if (!order) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <StudentDashboardLayout title={`Invoice #${order.invoice_id}`} subtitle="Invoice">
            <Head title={`Invoice #${order.invoice_id} - EduCore`} />

            <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
                <div className="d-flex justify-content-between align-items-center mb-4 d-print-none">
                    <Link href={route('student.orders.index')} className="btn btn-outline-secondary btn-sm">
                        <i className="fas fa-arrow-left me-1"></i> Back to Orders
                    </Link>
                    <button onClick={handlePrint} className="btn btn-primary btn-sm">
                        <i className="fas fa-print me-1"></i> Print Invoice
                    </button>
                </div>

                {/* Printable Invoice Box */}
                <div className="invoice_box p-4 border rounded-3 bg-light">
                    <div className="row justify-content-between align-items-center mb-4">
                        <div className="col-sm-6">
                            <h4 className="fw-bold text-dark mb-1">Invoice #{order.invoice_id}</h4>
                            <p className="text-muted small mb-0">Date: {new Date(order.created_at).toLocaleString()}</p>
                        </div>
                        <div className="col-sm-6 text-sm-end">
                            <span className={`badge fs-6 ${order.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                                Status: {order.status}
                            </span>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-sm-6">
                            <h6 className="fw-bold text-dark mb-1">Billed To:</h6>
                            <p className="text-muted small mb-0">{order.customer?.name || 'Customer'}</p>
                            <p className="text-muted small mb-0">{order.customer?.email}</p>
                        </div>
                        <div className="col-sm-6 text-sm-end">
                            <h6 className="fw-bold text-dark mb-1">Payment Method:</h6>
                            <p className="text-muted small text-capitalize mb-0">{order.payment_method}</p>
                            <p className="text-muted small mb-0">Currency: {order.currency || 'USD'}</p>
                        </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="table-responsive mb-4">
                        <table className="table table-bordered bg-white align-middle mb-0">
                            <thead className="table-light small">
                                <tr>
                                    <th>Item / Course Description</th>
                                    <th className="text-end">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="small">
                                {order.order_items && order.order_items.length > 0 ? (
                                    order.order_items.map((it) => (
                                        <tr key={it.id}>
                                            <td>
                                                <span className="fw-bold text-dark">{it.course?.title || 'Course'}</span>
                                            </td>
                                            <td className="text-end fw-bold text-primary">
                                                ${Number(it.price || 0).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td>Course Purchase</td>
                                        <td className="text-end fw-bold text-primary">${Number(order.total_amount || 0).toFixed(2)}</td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="table-light">
                                <tr>
                                    <th className="text-end">Total Paid:</th>
                                    <th className="text-end fs-5 text-primary">
                                        ${Number(order.total_amount || 0).toFixed(2)}
                                    </th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="text-center text-muted small">
                        Thank you for investing in your education with EduCore.
                    </div>
                </div>
            </div>
        </StudentDashboardLayout>
    );
}
