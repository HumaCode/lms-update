import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import StatusBadge from '@/Admin/Components/StatusBadge';
import Pagination from '@/Components/UI/Pagination';
import { formatCurrency, formatDate } from '@/Utils/formatters';
import { route } from '@/Utils/routes';

export default function Index({ orders }) {
    return (
        <AdminLayout>
            <Head title="Orders" />

            <PageHeader
                title="Orders Management"
                breadcrumbs={[
                    { label: 'Dashboard', url: route('admin.dashboard') },
                    { label: 'Orders' },
                ]}
            />

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">All Customer Orders</h3>
                    <div className="card-actions">
                        <span className="badge bg-blue text-blue-fg">
                            {orders.total || orders.data?.length || 0} Total Orders
                        </span>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-vcenter card-table table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Invoice</th>
                                <th>Customer</th>
                                <th>Total Amount</th>
                                <th>Paid Amount</th>
                                <th>Currency</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th className="text-end">Invoice</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.data && orders.data.length > 0 ? (
                                orders.data.map((order, index) => (
                                    <tr key={order.id}>
                                        <td className="text-secondary" style={{ width: '50px' }}>
                                            {(orders.current_page - 1) * orders.per_page + index + 1}
                                        </td>
                                        <td>
                                            <span className="badge bg-purple-lt font-monospace">
                                                #{order.invoice_id || order.id}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="font-weight-medium">
                                                {order.customer?.name || 'N/A'}
                                            </div>
                                            <div className="text-secondary small">
                                                {order.customer?.email || ''}
                                            </div>
                                        </td>
                                        <td className="font-weight-medium">
                                            {formatCurrency(order.total_amount, order.currency)}
                                        </td>
                                        <td className="text-success font-weight-medium">
                                            {formatCurrency(order.paid_amount, order.currency)}
                                        </td>
                                        <td>
                                            <code>{order.currency || 'USD'}</code>
                                        </td>
                                        <td>
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="text-secondary small">
                                            {formatDate(order.created_at)}
                                        </td>
                                        <td className="text-end">
                                            <Link
                                                href={route('admin.orders.show', order.id)}
                                                className="btn btn-sm btn-outline-primary"
                                                title="View Invoice"
                                            >
                                                <i className="ti ti-eye me-1"></i>
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center py-4 text-secondary">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {orders.links && (
                    <div className="card-footer d-flex align-items-center justify-content-between">
                        <Pagination links={orders.links} />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
