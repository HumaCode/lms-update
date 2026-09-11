import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import StatusBadge from '@/Admin/Components/StatusBadge';
import { formatCurrency, formatDate, getImageUrl } from '@/Utils/formatters';
import { route } from '@/Utils/routes';

import Swal from 'sweetalert2';

export default function Show({ withdraw, settings, payoutMode = 'manual' }) {
    const [selectedStatus, setSelectedStatus] = useState(withdraw.status);
    const isPending = withdraw.status === 'pending';

    const gatewayInfoObj = withdraw.instructor?.gateway_info;
    const payoutAccountInfo = withdraw.payout_account_info || (gatewayInfoObj ? `Gateway: ${gatewayInfoObj.gateway}\n\n${gatewayInfoObj.information}` : null);
    const instructorAvatar = withdraw.instructor?.avatar || withdraw.instructor?.image || withdraw.instructor?.avatar_url;

    const handleStatusSubmit = (e) => {
        e.preventDefault();
        const isApproved = selectedStatus === 'approved';
        const isRejected = selectedStatus === 'rejected';
        const isAuto = isApproved && payoutMode === 'automatic';

        Swal.fire({
            title: isAuto ? `⚡ Konfirmasi Disbursement Otomatis` : `Konfirmasi Perubahan Status`,
            html: isAuto
                ? `Apakah Anda yakin ingin menyetujui penarikan ini? Sistem akan <strong>secara otomatis mengirim dana riil via Xendit API</strong> sebesar <strong class="text-success">${formatCurrency(withdraw.amount, settings)}</strong> ke rekening instruktur.`
                : `Apakah Anda yakin ingin mengubah status pengajuan penarikan dana ini menjadi <strong class="${isApproved ? 'text-success' : isRejected ? 'text-danger' : 'text-primary'}">${selectedStatus.toUpperCase()}</strong>?`,
            icon: isApproved ? (isAuto ? 'success' : 'question') : isRejected ? 'warning' : 'info',
            showCancelButton: true,
            confirmButtonColor: isApproved ? '#2fb344' : isRejected ? '#d63939' : '#206bc4',
            cancelButtonColor: '#6c757d',
            confirmButtonText: isAuto ? '🚀 Kirim Dana via Xendit API' : 'Ya, Proses Sekarang',
            cancelButtonText: 'Batal',
            customClass: {
                popup: 'rounded-4 shadow-lg border-0',
                confirmButton: 'px-4 py-2 fw-bold shadow-sm',
                cancelButton: 'px-4 py-2 fw-bold shadow-sm'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('admin.withdraw-request.status.update', withdraw.id), {
                    status: selectedStatus,
                });
            }
        });
    };

    return (
        <AdminLayout>
            <Head title={`Withdraw Request Details`} />

            <PageHeader
                title="Withdraw Request Details"
                breadcrumbs={[
                    { label: 'Dashboard', url: route('admin.dashboard') },
                    { label: 'Withdraw Requests', url: route('admin.withdraw-request.index') },
                    { label: 'Details' },
                ]}
                actionText="Back to Requests"
                actionUrl={route('admin.withdraw-request.index')}
                actionIcon="ti ti-arrow-left"
            />

            <div className="page-body">
                <div className="container-xl">
                    <div className="row g-4">
                        {/* Main Information Card */}
                        <div className="col-lg-8">
                            {/* Header Summary Banner */}
                            <div className="card shadow-sm border-0 mb-4">
                                <div className="card-body p-4 bg-gradient text-dark rounded-top" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                                        <div>
                                            <span className="text-uppercase tracking-wide text-muted fw-bold small">Withdrawal Request</span>
                                            <h2 className="mb-0 fw-bold text-primary display-6 mt-1">
                                                {formatCurrency(withdraw.amount, settings)}
                                            </h2>
                                        </div>
                                        <div>
                                            <StatusBadge status={withdraw.status} />
                                        </div>
                                    </div>
                                </div>

                                {/* Overview Stats */}
                                <div className="card-body p-4">
                                    <div className="row g-3">
                                        <div className="col-md-6 col-6">
                                            <div className="p-3 bg-light rounded-3 border">
                                                <div className="text-secondary small text-uppercase font-weight-bold mb-1">
                                                    Requested Amount
                                                </div>
                                                <div className="fs-2 fw-bold text-danger">
                                                    {formatCurrency(withdraw.amount, settings)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-6">
                                            <div className="p-3 bg-light rounded-3 border">
                                                <div className="text-secondary small text-uppercase font-weight-bold mb-1">
                                                    Current Wallet Balance
                                                </div>
                                                <div className="fs-2 fw-bold text-success">
                                                    {formatCurrency(withdraw.instructor?.wallet || 0, settings)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Instructor Payout Info */}
                            <div className="card shadow-sm border-0 mb-4">
                                <div className="card-header bg-white py-3">
                                    <h4 className="card-title fw-bold mb-0 text-dark">
                                        <i className="ti ti-building-bank text-primary me-2 fs-3"></i>
                                        Payout Account Information
                                    </h4>
                                </div>
                                <div className="card-body p-4">
                                    {payoutAccountInfo ? (
                                        <div className="p-3 bg-light rounded-3 border">
                                            <div className="text-dark font-monospace fw-medium" style={{ whiteSpace: 'pre-wrap', color: '#1e293b' }}>
                                                {payoutAccountInfo}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="alert alert-warning mb-0 d-flex align-items-center">
                                            <i className="ti ti-alert-triangle fs-2 me-2"></i>
                                            <span>Instructor has not provided payout account details yet.</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Section: Instructor & Process Action */}
                        <div className="col-lg-4">
                            {/* Instructor Card */}
                            <div className="card shadow-sm border-0 mb-4">
                                <div className="card-header bg-white py-3">
                                    <h4 className="card-title fw-bold mb-0 text-dark">
                                        <i className="ti ti-user me-2 text-primary fs-3"></i>
                                        Instructor Details
                                    </h4>
                                </div>
                                <div className="card-body p-4 text-center">
                                    {instructorAvatar ? (
                                        <img
                                            src={getImageUrl(instructorAvatar)}
                                            alt={withdraw.instructor?.name || 'Instructor Avatar'}
                                            className="avatar avatar-xl rounded-circle mx-auto mb-3 object-cover border"
                                            style={{ width: '72px', height: '72px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div className="avatar avatar-xl rounded-circle bg-primary-subtle text-primary fw-bold mx-auto mb-3 fs-1 d-flex align-items-center justify-content-center" style={{ width: '72px', height: '72px' }}>
                                            {withdraw.instructor?.name ? withdraw.instructor.name.substring(0, 2).toUpperCase() : 'IN'}
                                        </div>
                                    )}
                                    <h4 className="mb-1 fw-bold text-dark">{withdraw.instructor?.name || 'Unknown Instructor'}</h4>
                                    <p className="text-muted small mb-3">{withdraw.instructor?.email}</p>

                                    <hr className="my-3 text-muted" />

                                    <div className="d-flex justify-content-between align-items-center text-start mb-2">
                                        <span className="text-secondary small">Submitted Date:</span>
                                        <span className="fw-semibold text-dark small">{formatDate(withdraw.created_at)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Form Card */}
                            <div className="card shadow-sm border-0">
                                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                                    <h4 className="card-title fw-bold mb-0 text-dark">
                                        <i className="ti ti-settings me-2 text-primary fs-3"></i>
                                        Action & Status
                                    </h4>
                                    <span className={`badge ${payoutMode === 'automatic' ? 'bg-success-subtle text-success border border-success' : 'bg-secondary-subtle text-secondary border'}`}>
                                        {payoutMode === 'automatic' ? '⚡ Auto API' : '📝 Manual'}
                                    </span>
                                </div>
                                <div className="card-body p-4">
                                    {!isPending ? (
                                        <div className="alert alert-info mb-0 border-0 shadow-sm">
                                            <div className="d-flex align-items-start">
                                                <i className="ti ti-info-circle fs-2 me-2 mt-1"></i>
                                                <div>
                                                    <strong>Processed</strong>
                                                    <p className="mb-0 small mt-1">
                                                        This request is marked as <strong>{withdraw.status.toUpperCase()}</strong> and cannot be modified.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleStatusSubmit}>
                                            <div className={`alert ${payoutMode === 'automatic' ? 'alert-primary' : 'alert-warning'} border-0 shadow-sm mb-4`}>
                                                <div className="d-flex align-items-start">
                                                    <i className={`ti ${payoutMode === 'automatic' ? 'ti-bolt' : 'ti-alert-circle'} fs-2 me-2 mt-1`}></i>
                                                    <div className="small">
                                                        {payoutMode === 'automatic' ? (
                                                            <span><strong>Mode Otomatis Xendit API:</strong> Menyetujui status ini akan <strong>secara instan mentransfer dana nyata</strong> sebesar <strong>{formatCurrency(withdraw.amount, settings)}</strong> ke akun instruktur via API.</span>
                                                        ) : (
                                                            <span><strong>Mode Manual:</strong> Pastikan Anda telah melakukan transfer manual via bank sebelum menyetujui. <strong>{formatCurrency(withdraw.amount, settings)}</strong> akan dipotong dari dompet instruktur.</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label fw-bold text-dark required">Update Request Status</label>
                                                <select
                                                    className="form-select form-select-lg"
                                                    value={selectedStatus}
                                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                                >
                                                    <option value="pending">⏳ Pending Review</option>
                                                    <option value="approved">✅ Approved & Paid</option>
                                                    <option value="rejected">❌ Rejected</option>
                                                </select>
                                            </div>

                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-lg w-100 fw-bold shadow-sm"
                                                disabled={selectedStatus === 'pending'}
                                            >
                                                <i className="ti ti-check me-1"></i>
                                                Confirm & Save Status
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
