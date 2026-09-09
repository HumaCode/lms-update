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
    const [activeTab, setActiveTab] = useState('paypal');

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

            <div className="card">
                <div className="card-header">
                    <ul className="nav nav-tabs card-header-tabs" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${activeTab === 'paypal' ? 'active' : ''}`}
                                onClick={() => setActiveTab('paypal')}
                                type="button"
                            >
                                <i className="ti ti-brand-paypal me-2"></i>
                                PayPal
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${activeTab === 'stripe' ? 'active' : ''}`}
                                onClick={() => setActiveTab('stripe')}
                                type="button"
                            >
                                <i className="ti ti-brand-stripe me-2"></i>
                                Stripe
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${activeTab === 'razorpay' ? 'active' : ''}`}
                                onClick={() => setActiveTab('razorpay')}
                                type="button"
                            >
                                <i className="ti ti-credit-card me-2"></i>
                                Razorpay
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="card-body">
                    {/* PAYPAL TAB */}
                    {activeTab === 'paypal' && (
                        <form onSubmit={handlePaypalSubmit}>
                            <h3 className="card-title mb-4">PayPal Configuration</h3>
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
                                        {paypalCurrencies.map((curr, idx) => {
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
                            <h3 className="card-title mb-4">Stripe Configuration</h3>
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
                                        {stripeCurrencies.map((curr, idx) => {
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
                            <h3 className="card-title mb-4">Razorpay Configuration</h3>
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
                                        {razorpayCurrencies.map((curr, idx) => {
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
