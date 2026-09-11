import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import { route } from '@/Utils/routes';

export default function Index({
    gatewaySettings = {},
    paypalCurrencies = [],
    stripeCurrencies = [],
    razorpayCurrencies = [],
}) {
    const [activeTab, setActiveTab] = useState('xendit');

    // Ensure array safety for currency dropdowns
    const safePaypalCurrencies = Array.isArray(paypalCurrencies)
        ? paypalCurrencies
        : Object.values(paypalCurrencies || {});
    const safeStripeCurrencies = Array.isArray(stripeCurrencies)
        ? stripeCurrencies
        : Object.values(stripeCurrencies || {});
    const safeRazorpayCurrencies = Array.isArray(razorpayCurrencies)
        ? razorpayCurrencies
        : Object.values(razorpayCurrencies || {});

    // Xendit Form
    const xenditForm = useForm({
        xendit_status: gatewaySettings.xendit_status || 'active',
        xendit_mode: gatewaySettings.xendit_mode || 'development',
        xendit_currency: gatewaySettings.xendit_currency || 'IDR',
        xendit_secret_key: gatewaySettings.xendit_secret_key || 'xnd_development_sZPXUVfXQMwOexwHH1jizq3PYHlQITdEZBOBauzdzlWZ4YJCdr0gXAoiOlrZH',
        xendit_webhook_token: gatewaySettings.xendit_webhook_token || '',
    });

    // PayPal Form
    const paypalForm = useForm({
        paypal_mode: gatewaySettings.paypal_mode || 'sandbox',
        paypal_currency: gatewaySettings.paypal_currency || 'USD',
        paypal_rate: gatewaySettings.paypal_rate || '1',
        paypal_client_id: gatewaySettings.paypal_client_id || '',
        paypal_client_secret: gatewaySettings.paypal_client_secret || '',
        paypal_app_id: gatewaySettings.paypal_app_id || '',
    });

    // Stripe Form
    const stripeForm = useForm({
        stripe_status: gatewaySettings.stripe_status || 'inactive',
        stripe_currency: gatewaySettings.stripe_currency || 'USD',
        stripe_rate: gatewaySettings.stripe_rate || '1',
        stripe_publishable_key: gatewaySettings.stripe_publishable_key || '',
        stripe_secret: gatewaySettings.stripe_secret || '',
    });

    // Razorpay Form
    const razorpayForm = useForm({
        razorpay_status: gatewaySettings.razorpay_status || 'inactive',
        razorpay_currency: gatewaySettings.razorpay_currency || 'INR',
        razorpay_rate: gatewaySettings.razorpay_rate || '1',
        razorpay_key: gatewaySettings.razorpay_key || '',
        razorpay_secret: gatewaySettings.razorpay_secret || '',
    });

    const handleXenditSubmit = (e) => {
        e.preventDefault();
        xenditForm.post(route('admin.xendit-setting.update'));
    };

    const handlePaypalSubmit = (e) => {
        e.preventDefault();
        paypalForm.post(route('admin.paypal-setting.update'));
    };

    const handleStripeSubmit = (e) => {
        e.preventDefault();
        stripeForm.post(route('admin.stripe-setting.update'));
    };

    const handleRazorpaySubmit = (e) => {
        e.preventDefault();
        razorpayForm.post(route('admin.razorpay-setting.update'));
    };

    return (
        <AdminLayout>
            <Head title="Payment Gateways Configuration" />

            <PageHeader
                title="Payment Gateways"
                breadcrumbs={[
                    { label: 'Dashboard', url: route('admin.dashboard') },
                    { label: 'Payment Settings' },
                ]}
            />

            <div className="card shadow-sm border-0 rounded-3">
                <div className="card-header bg-white border-bottom">
                    <ul className="nav nav-tabs card-header-tabs" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link fw-bold ${activeTab === 'xendit' ? 'active text-primary' : 'text-secondary'}`}
                                onClick={() => setActiveTab('xendit')}
                                type="button"
                            >
                                <i className="ti ti-wallet me-2"></i>
                                Xendit (Indonesia)
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link fw-semibold ${activeTab === 'paypal' ? 'active' : ''}`}
                                onClick={() => setActiveTab('paypal')}
                                type="button"
                            >
                                <i className="ti ti-brand-paypal me-2"></i>
                                PayPal
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link fw-semibold ${activeTab === 'stripe' ? 'active' : ''}`}
                                onClick={() => setActiveTab('stripe')}
                                type="button"
                            >
                                <i className="ti ti-brand-stripe me-2"></i>
                                Stripe
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link fw-semibold ${activeTab === 'razorpay' ? 'active' : ''}`}
                                onClick={() => setActiveTab('razorpay')}
                                type="button"
                            >
                                <i className="ti ti-credit-card me-2"></i>
                                Razorpay
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="card-body p-4">
                    {/* XENDIT TAB */}
                    {activeTab === 'xendit' && (
                        <form onSubmit={handleXenditSubmit}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h4 className="fw-bold text-dark mb-1">Xendit Payment Gateway Configuration</h4>
                                    <p className="text-muted small mb-0">
                                        Terima pembayaran otomatis via Transfer Bank (VA), E-Wallet (GoPay, OVO, DANA, ShopeePay), QRIS, & Kartu Kredit.
                                    </p>
                                </div>
                                <span
                                    className="badge px-3 py-2 fs-6 fw-bold shadow-sm"
                                    style={{
                                        backgroundColor: xenditForm.data.xendit_status === 'active' ? '#10b981' : '#64748b',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    <i className={`ti ${xenditForm.data.xendit_status === 'active' ? 'ti-circle-check-filled' : 'ti-circle-x-filled'} me-1`}></i>
                                    Status: {xenditForm.data.xendit_status}
                                </span>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label required fw-semibold">Xendit Gateway Status</label>
                                    <select
                                        className="form-select"
                                        value={xenditForm.data.xendit_status}
                                        onChange={(e) => xenditForm.setData('xendit_status', e.target.value)}
                                    >
                                        <option value="active">Active (Aktif)</option>
                                        <option value="inactive">Inactive (Non-aktif)</option>
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label required fw-semibold">Environment / Mode</label>
                                    <select
                                        className="form-select"
                                        value={xenditForm.data.xendit_mode}
                                        onChange={(e) => xenditForm.setData('xendit_mode', e.target.value)}
                                    >
                                        <option value="development">Development (Testing / Sandbox)</option>
                                        <option value="production">Production (Live)</option>
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label required fw-semibold">Currency</label>
                                    <select
                                        className="form-select"
                                        value={xenditForm.data.xendit_currency}
                                        onChange={(e) => xenditForm.setData('xendit_currency', e.target.value)}
                                    >
                                        <option value="IDR">IDR (Rupiah Indonesia)</option>
                                        <option value="PHP">PHP (Philippine Peso)</option>
                                        <option value="USD">USD (US Dollar)</option>
                                    </select>
                                </div>

                                <div className="col-12">
                                    <label className="form-label required fw-semibold">Secret API Key</label>
                                    <input
                                        type="text"
                                        className={`form-control ${xenditForm.errors.xendit_secret_key ? 'is-invalid' : ''}`}
                                        value={xenditForm.data.xendit_secret_key}
                                        onChange={(e) => xenditForm.setData('xendit_secret_key', e.target.value)}
                                        placeholder="xnd_development_... / xnd_production_..."
                                    />
                                    <div className="form-text small">
                                        API Key rahasia dari Dashboard Xendit Anda (Menu Configuration / API Keys).
                                    </div>
                                    {xenditForm.errors.xendit_secret_key && (
                                        <div className="invalid-feedback">{xenditForm.errors.xendit_secret_key}</div>
                                    )}
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold">Webhook Verification Token (Opsional)</label>
                                    <input
                                        type="text"
                                        className={`form-control ${xenditForm.errors.xendit_webhook_token ? 'is-invalid' : ''}`}
                                        value={xenditForm.data.xendit_webhook_token}
                                        onChange={(e) => xenditForm.setData('xendit_webhook_token', e.target.value)}
                                        placeholder="Token verifikasi callback webhook Xendit"
                                    />
                                    <div className="form-text small">
                                        Token verifikasi dari menu Webhooks di Dashboard Xendit untuk memverifikasi callback status transaksi otomatis.
                                    </div>
                                    {xenditForm.errors.xendit_webhook_token && (
                                        <div className="invalid-feedback">{xenditForm.errors.xendit_webhook_token}</div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-top text-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary px-4 fw-bold shadow-sm"
                                    disabled={xenditForm.processing}
                                >
                                    {xenditForm.processing ? 'Saving...' : 'Save Xendit Settings'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* PAYPAL TAB */}
                    {activeTab === 'paypal' && (
                        <form onSubmit={handlePaypalSubmit}>
                            <h4 className="fw-bold text-dark mb-4">PayPal Configuration</h4>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label required">PayPal Mode</label>
                                    <select
                                        className="form-select"
                                        value={paypalForm.data.paypal_mode}
                                        onChange={(e) => paypalForm.setData('paypal_mode', e.target.value)}
                                    >
                                        <option value="sandbox">Sandbox (Testing)</option>
                                        <option value="live">Live (Production)</option>
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label required">Currency</label>
                                    <select
                                        className="form-select"
                                        value={paypalForm.data.paypal_currency}
                                        onChange={(e) => paypalForm.setData('paypal_currency', e.target.value)}
                                    >
                                        {safePaypalCurrencies.map((curr, idx) => {
                                            const code = typeof curr === 'object' ? curr.code : curr;
                                            return (
                                                <option key={idx} value={code}>
                                                    {code}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label required">Exchange Rate (per USD)</label>
                                    <input
                                        type="text"
                                        className={`form-control ${paypalForm.errors.paypal_rate ? 'is-invalid' : ''}`}
                                        value={paypalForm.data.paypal_rate}
                                        onChange={(e) => paypalForm.setData('paypal_rate', e.target.value)}
                                    />
                                    {paypalForm.errors.paypal_rate && (
                                        <div className="invalid-feedback">{paypalForm.errors.paypal_rate}</div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label required">Client ID</label>
                                    <input
                                        type="text"
                                        className={`form-control ${paypalForm.errors.paypal_client_id ? 'is-invalid' : ''}`}
                                        value={paypalForm.data.paypal_client_id}
                                        onChange={(e) => paypalForm.setData('paypal_client_id', e.target.value)}
                                    />
                                    {paypalForm.errors.paypal_client_id && (
                                        <div className="invalid-feedback">{paypalForm.errors.paypal_client_id}</div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label required">Client Secret</label>
                                    <input
                                        type="password"
                                        className={`form-control ${paypalForm.errors.paypal_client_secret ? 'is-invalid' : ''}`}
                                        value={paypalForm.data.paypal_client_secret}
                                        onChange={(e) => paypalForm.setData('paypal_client_secret', e.target.value)}
                                    />
                                    {paypalForm.errors.paypal_client_secret && (
                                        <div className="invalid-feedback">{paypalForm.errors.paypal_client_secret}</div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label required">App ID</label>
                                    <input
                                        type="text"
                                        className={`form-control ${paypalForm.errors.paypal_app_id ? 'is-invalid' : ''}`}
                                        value={paypalForm.data.paypal_app_id}
                                        onChange={(e) => paypalForm.setData('paypal_app_id', e.target.value)}
                                    />
                                    {paypalForm.errors.paypal_app_id && (
                                        <div className="invalid-feedback">{paypalForm.errors.paypal_app_id}</div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-top text-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={paypalForm.processing}
                                >
                                    {paypalForm.processing ? 'Saving...' : 'Save PayPal Settings'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* STRIPE TAB */}
                    {activeTab === 'stripe' && (
                        <form onSubmit={handleStripeSubmit}>
                            <h4 className="fw-bold text-dark mb-4">Stripe Configuration</h4>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label required">Stripe Status</label>
                                    <select
                                        className="form-select"
                                        value={stripeForm.data.stripe_status}
                                        onChange={(e) => stripeForm.setData('stripe_status', e.target.value)}
                                    >
                                        <option value="inactive">Inactive</option>
                                        <option value="active">Active</option>
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label required">Currency</label>
                                    <select
                                        className="form-select"
                                        value={stripeForm.data.stripe_currency}
                                        onChange={(e) => stripeForm.setData('stripe_currency', e.target.value)}
                                    >
                                        {safeStripeCurrencies.map((curr, idx) => {
                                            const code = typeof curr === 'object' ? curr.code : curr;
                                            return (
                                                <option key={idx} value={code}>
                                                    {code}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label required">Exchange Rate (per USD)</label>
                                    <input
                                        type="text"
                                        className={`form-control ${stripeForm.errors.stripe_rate ? 'is-invalid' : ''}`}
                                        value={stripeForm.data.stripe_rate}
                                        onChange={(e) => stripeForm.setData('stripe_rate', e.target.value)}
                                    />
                                    {stripeForm.errors.stripe_rate && (
                                        <div className="invalid-feedback">{stripeForm.errors.stripe_rate}</div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label required">Publishable Key</label>
                                    <input
                                        type="text"
                                        className={`form-control ${stripeForm.errors.stripe_publishable_key ? 'is-invalid' : ''}`}
                                        value={stripeForm.data.stripe_publishable_key}
                                        onChange={(e) => stripeForm.setData('stripe_publishable_key', e.target.value)}
                                    />
                                    {stripeForm.errors.stripe_publishable_key && (
                                        <div className="invalid-feedback">{stripeForm.errors.stripe_publishable_key}</div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label required">Secret Key</label>
                                    <input
                                        type="password"
                                        className={`form-control ${stripeForm.errors.stripe_secret ? 'is-invalid' : ''}`}
                                        value={stripeForm.data.stripe_secret}
                                        onChange={(e) => stripeForm.setData('stripe_secret', e.target.value)}
                                    />
                                    {stripeForm.errors.stripe_secret && (
                                        <div className="invalid-feedback">{stripeForm.errors.stripe_secret}</div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-top text-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={stripeForm.processing}
                                >
                                    {stripeForm.processing ? 'Saving...' : 'Save Stripe Settings'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* RAZORPAY TAB */}
                    {activeTab === 'razorpay' && (
                        <form onSubmit={handleRazorpaySubmit}>
                            <h4 className="fw-bold text-dark mb-4">Razorpay Configuration</h4>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label required">Razorpay Status</label>
                                    <select
                                        className="form-select"
                                        value={razorpayForm.data.razorpay_status}
                                        onChange={(e) => razorpayForm.setData('razorpay_status', e.target.value)}
                                    >
                                        <option value="inactive">Inactive</option>
                                        <option value="active">Active</option>
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label required">Currency</label>
                                    <select
                                        className="form-select"
                                        value={razorpayForm.data.razorpay_currency}
                                        onChange={(e) => razorpayForm.setData('razorpay_currency', e.target.value)}
                                    >
                                        {safeRazorpayCurrencies.map((curr, idx) => {
                                            const code = typeof curr === 'object' ? curr.code : curr;
                                            return (
                                                <option key={idx} value={code}>
                                                    {code}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label required">Exchange Rate (per USD)</label>
                                    <input
                                        type="text"
                                        className={`form-control ${razorpayForm.errors.razorpay_rate ? 'is-invalid' : ''}`}
                                        value={razorpayForm.data.razorpay_rate}
                                        onChange={(e) => razorpayForm.setData('razorpay_rate', e.target.value)}
                                    />
                                    {razorpayForm.errors.razorpay_rate && (
                                        <div className="invalid-feedback">{razorpayForm.errors.razorpay_rate}</div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label required">API Key</label>
                                    <input
                                        type="text"
                                        className={`form-control ${razorpayForm.errors.razorpay_key ? 'is-invalid' : ''}`}
                                        value={razorpayForm.data.razorpay_key}
                                        onChange={(e) => razorpayForm.setData('razorpay_key', e.target.value)}
                                    />
                                    {razorpayForm.errors.razorpay_key && (
                                        <div className="invalid-feedback">{razorpayForm.errors.razorpay_key}</div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label required">API Secret</label>
                                    <input
                                        type="password"
                                        className={`form-control ${razorpayForm.errors.razorpay_secret ? 'is-invalid' : ''}`}
                                        value={razorpayForm.data.razorpay_secret}
                                        onChange={(e) => razorpayForm.setData('razorpay_secret', e.target.value)}
                                    />
                                    {razorpayForm.errors.razorpay_secret && (
                                        <div className="invalid-feedback">{razorpayForm.errors.razorpay_secret}</div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-top text-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={razorpayForm.processing}
                                >
                                    {razorpayForm.processing ? 'Saving...' : 'Save Razorpay Settings'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
