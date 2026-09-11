import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import InstructorLayout from '@/Instructor/Layouts/InstructorLayout';
import StatCard from '@/Instructor/Components/StatCard';
import { formatCurrency, formatPriceInput, parseRawPrice } from '@/Utils/formatters';
import { route } from '@/Utils/routes';

export default function RequestPayout({
    currentBalance = 0,
    pendingBalance = 0,
    totalPayout = 0,
    gatewayInfo = null,
}) {
    const { settings } = usePage().props;
    const currency = (settings?.default_currency || settings?.site_currency || '').toUpperCase();
    const icon = settings?.currency_icon || settings?.site_currency_icon || 'Rp';
    const isRupiah = currency === 'IDR' || icon.toLowerCase().includes('rp') || icon.toLowerCase() === 'idr';

    const { data, setData, post, processing, errors } = useForm({
        amount: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('instructor.withdraw.request-payout.create'));
    };

    const handleChangeAmount = (e) => {
        const raw = parseRawPrice(e.target.value, isRupiah);
        setData('amount', raw);
    };

    const numAmount = Number(data.amount) || 0;
    const numBalance = Number(currentBalance) || 0;
    const isExceeding = numAmount > numBalance;
    const isDisabled = processing || !gatewayInfo || numBalance <= 0 || isExceeding || numAmount <= 0;

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
                        value={formatCurrency(currentBalance, settings)}
                        icon="fas fa-wallet"
                        variant="success"
                    />
                </div>
                <div className="col-md-4">
                    <StatCard
                        title="Pending Payout"
                        value={formatCurrency(pendingBalance, settings)}
                        icon="fas fa-hourglass-half"
                        variant="warning"
                    />
                </div>
                <div className="col-md-4">
                    <StatCard
                        title="Total Paid Out"
                        value={formatCurrency(totalPayout, settings)}
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
                                    href={`${route('instructor.profile.index')}?tab=payout`}
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
                            <Link href={`${route('instructor.profile.index')}?tab=payout`} className="btn btn-sm btn-dark">
                                Configure Payout Account
                            </Link>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
                        <div className="mb-3">
                            <label className="form-label required fw-semibold">Payout Amount</label>
                            <div className="input-group">
                                <span className="input-group-text">{icon}</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    className={`form-control ${errors.amount || isExceeding ? 'is-invalid' : ''}`}
                                    placeholder={!gatewayInfo ? "Configure payout account first..." : (isRupiah ? "e.g. 50.000" : "e.g. 50.00")}
                                    value={formatPriceInput(data.amount, isRupiah)}
                                    onChange={handleChangeAmount}
                                    disabled={!gatewayInfo}
                                    autoFocus={!!gatewayInfo}
                                />
                                {errors.amount && (
                                    <div className="invalid-feedback">{errors.amount}</div>
                                )}
                                {isExceeding && !errors.amount && (
                                    <div className="invalid-feedback">
                                        Jumlah penarikan tidak boleh melebihi saldo tersedia ({formatCurrency(currentBalance, settings)}).
                                    </div>
                                )}
                            </div>
                            {!gatewayInfo ? (
                                <div className="text-danger small mt-1 fw-semibold">
                                    <i className="fas fa-exclamation-circle me-1"></i>
                                    Anda belum mengatur rekening/rekening bank penarikan. Silakan klik <strong>Configure Payout Account</strong> di atas terlebih dahulu.
                                </div>
                            ) : (
                                <div className={`form-text ${isExceeding ? 'text-danger fw-semibold' : ''}`}>
                                    Maximum withdrawable amount: <strong>{formatCurrency(currentBalance, settings)}</strong>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary px-4"
                            disabled={isDisabled}
                        >
                            {!gatewayInfo
                                ? 'Setup Payout Account First'
                                : processing
                                ? 'Submitting Request...'
                                : 'Confirm & Request Payout'}
                        </button>
                    </form>
                </div>
            </div>
        </InstructorLayout>
    );
}
