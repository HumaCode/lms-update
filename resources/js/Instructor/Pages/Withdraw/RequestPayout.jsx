import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InstructorLayout from '@/Instructor/Layouts/InstructorLayout';
import StatCard from '@/Instructor/Components/StatCard';
import { formatCurrency } from '@/Utils/formatters';
import { route } from '@/Utils/routes';

export default function RequestPayout({
    currentBalance = 0,
    pendingBalance = 0,
    totalPayout = 0,
    gatewayInfo = null,
}) {
    const { data, setData, post, processing, errors } = useForm({
        amount: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('instructor.withdraw.request-payout.create'));
    };

    return (
        <InstructorLayout
            title="Request Payout"
            crumbs={[
                { label: 'Withdrawals', url: route('instructor.withdraw.index') },
                { label: 'Request Payout' },
            ]}
        >
            <Head title="Request Payout" />

            {/* BALANCE CARDS */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <StatCard
                        title="Available Balance"
                        value={formatCurrency(currentBalance)}
                        icon="fas fa-wallet"
                        variant="success"
                    />
                </div>
                <div className="col-md-4">
                    <StatCard
                        title="Pending Payout"
                        value={formatCurrency(pendingBalance)}
                        icon="fas fa-hourglass-half"
                        variant="warning"
                    />
                </div>
                <div className="col-md-4">
                    <StatCard
                        title="Total Paid Out"
                        value={formatCurrency(totalPayout)}
                        icon="fas fa-money-check-alt"
                        variant="primary"
                    />
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-3">
                <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0 text-dark">Submit Payout Request</h5>
                    <Link href={route('instructor.withdraw.index')} className="btn btn-outline-secondary btn-sm">
                        <i className="fas fa-arrow-left me-1"></i> Back to Withdrawals
                    </Link>
                </div>

                <div className="card-body p-4">
                    {/* PAYOUT ACCOUNT PREVIEW */}
                    {gatewayInfo ? (
                        <div className="p-3 bg-light rounded-3 mb-4 border">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="badge bg-primary text-white text-uppercase px-2 py-1">
                                    {gatewayInfo.gateway}
                                </span>
                                <Link
                                    href={route('instructor.profile.index')}
                                    className="small text-primary text-decoration-none fw-semibold"
                                >
                                    <i className="fas fa-cog me-1"></i> Change Payout Details
                                </Link>
                            </div>
                            <div className="small font-monospace text-muted whitespace-pre-wrap">
                                {gatewayInfo.information}
                            </div>
                        </div>
                    ) : (
                        <div className="alert alert-warning border-0 shadow-sm d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                <strong>Payout Account Missing:</strong> You haven't set up your payout bank/gateway account yet.
                            </div>
                            <Link href={route('instructor.profile.index')} className="btn btn-sm btn-dark">
                                Configure Payout Account
                            </Link>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
                        <div className="mb-3">
                            <label className="form-label required fw-semibold">Payout Amount</label>
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    max={currentBalance}
                                    className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                                    placeholder="Enter amount to withdraw..."
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    autoFocus
                                />
                                {errors.amount && (
                                    <div className="invalid-feedback">{errors.amount}</div>
                                )}
                            </div>
                            <div className="form-text">
                                Maximum withdrawable amount: <strong>{formatCurrency(currentBalance)}</strong>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary px-4"
                            disabled={processing || !gatewayInfo || Number(currentBalance) <= 0}
                        >
                            {processing ? 'Submitting Request...' : 'Confirm & Request Payout'}
                        </button>
                    </form>
                </div>
            </div>
        </InstructorLayout>
    );
}
