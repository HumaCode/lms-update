import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import StatusBadge from '@/Admin/Components/StatusBadge';
import Pagination from '@/Components/UI/Pagination';
import { formatCurrency, formatDate } from '@/Utils/formatters';
import { route } from '@/Utils/routes';

export default function Index({ withdraws }) {
    return (
        <AdminLayout>
            <Head title="Withdraw Requests" />

            <PageHeader
                title="Instructor Withdraw Requests"
                breadcrumbs={[
                    { label: 'Dashboard', url: route('admin.dashboard') },
                    { label: 'Withdraw Requests' },
                ]}
            />

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">All Payout Requests</h3>
                    <div className="card-actions">
                        <span className="badge bg-blue text-blue-fg">
                            {withdraws.total || withdraws.data?.length || 0} Requests
                        </span>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-vcenter card-table table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Instructor</th>
                                <th>Requested Amount</th>
                                <th>Current Wallet</th>
                                <th>Status</th>
                                <th>Requested Date</th>
                                <th className="text-end">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {withdraws.data && withdraws.data.length > 0 ? (
                                withdraws.data.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="text-secondary" style={{ width: '50px' }}>
                                            {(withdraws.current_page - 1) * withdraws.per_page + index + 1}
                                        </td>
                                        <td>
                                            <div className="font-weight-medium">
                                                {item.instructor?.name || 'Unknown Instructor'}
                                            </div>
                                            <div className="text-secondary small">
                                                {item.instructor?.email || ''}
                                            </div>
                                        </td>
                                        <td className="font-weight-bold text-danger">
                                            {formatCurrency(item.amount)}
                                        </td>
                                        <td className="text-secondary">
                                            {formatCurrency(item.instructor?.wallet || 0)}
                                        </td>
                                        <td>
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td className="text-secondary small">
                                            {formatDate(item.created_at)}
                                        </td>
                                        <td className="text-end">
                                            <Link
                                                href={route('admin.withdraw-request.show', item.id)}
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                <i className="ti ti-eye me-1"></i>
                                                Review
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-secondary">
                                        No withdraw requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {withdraws.links && (
                    <div className="card-footer d-flex align-items-center justify-content-between">
                        <Pagination links={withdraws.links} />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
