import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import StatusBadge from '@/Admin/Components/StatusBadge';
import { formatCurrency, formatDate } from '@/Utils/formatters';
import { route } from '@/Utils/routes';

export default function Show({ withdraw }) {
    const [selectedStatus, setSelectedStatus] = useState(withdraw.status);
    const isPending = withdraw.status === 'pending';

    const handleStatusSubmit = (e) => {
        e.preventDefault();
        if (confirm(`Are you sure you want to mark this request as ${selectedStatus.toUpperCase()}? This action cannot be undone.`)) {
            router.post(route('admin.withdraw-request.status.update', withdraw.id), {
                status: selectedStatus,
            });
        }
    };

    return (
        <AdminLayout>
            <Head title={`Withdraw Request #${withdraw.id}`} />

            <PageHeader
                title={`Withdraw Request #${withdraw.id}`}
                breadcrumbs={[
                    { label: 'Dashboard', url: route('admin.dashboard') },
                    { label: 'Withdraw Requests', url: route('admin.withdraw-request.index') },
                    { label: `Request #${withdraw.id}` },
                ]}
                actionText="Back to Requests"
                actionUrl={route('admin.withdraw-request.index')}
                actionIcon="ti ti-arrow-left"
            />

            <div className="row">
                <div className="col-md-8 col-lg-7">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h3 className="card-title">Withdrawal Details</h3>
                            <StatusBadge status={withdraw.status} />
                        </div>
                        <div className="card-body">
                            <div className="datagrid mb-4">
                                <div className="datagrid-item">
                                    <div className="datagrid-title">Instructor</div>
                                    <div className="datagrid-content font-weight-medium">
                                        {withdraw.instructor?.name || 'Unknown'}
                                    </div>
                                    <div className="text-secondary small">
                                        {withdraw.instructor?.email}
                                    </div>
                                </div>
                                <div className="datagrid-item">
                                    <div className="datagrid-title">Current Wallet Balance</div>
                                    <div className="datagrid-content font-weight-bold text-success fs-3">
                                        {formatCurrency(withdraw.instructor?.wallet || 0)}
                                    </div>
                                </div>
                                <div className="datagrid-item">
                                    <div className="datagrid-title">Requested Amount</div>
                                    <div className="datagrid-content font-weight-bold text-danger fs-3">
                                        {formatCurrency(withdraw.amount)}
                                    </div>
                                </div>
                                <div className="datagrid-item">
                                    <div className="datagrid-title">Submission Date</div>
                                    <div className="datagrid-content">
                                        {formatDate(withdraw.created_at)}
                                    </div>
                                </div>
                            </div>

                            {withdraw.payout_account_info && (
                                <div className="mb-4">
                                    <label className="form-label font-weight-medium">Instructor Account / Payout Info</label>
                                    <div className="p-3 bg-light rounded border font-monospace text-wrap">
                                        {withdraw.payout_account_info}
                                    </div>
                                </div>
                            )}

                            <div className="border-top pt-4">
                                <h4 className="mb-2">Process Request</h4>
                                {!isPending ? (
                                    <div className="alert alert-info mb-0">
                                        This withdrawal request has already been processed with status <strong>{withdraw.status}</strong>. It cannot be modified further.
                                    </div>
                                ) : (
                                    <form onSubmit={handleStatusSubmit}>
                                        <div className="alert alert-warning">
                                            <strong>Caution:</strong> Approving this request will automatically deduct <strong>{formatCurrency(withdraw.amount)}</strong> from the instructor's wallet.
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label required">Update Status</label>
                                            <select
                                                className="form-select"
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={selectedStatus === 'pending'}
                                        >
                                            Confirm & Update Status
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
