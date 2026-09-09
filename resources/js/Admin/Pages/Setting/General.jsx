import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import SettingSidebar from './Components/SettingSidebar';
import { route } from '@/Utils/routes';

export default function General({ settings = {}, currencies = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        site_name: settings.site_name || '',
        phone: settings.phone || '',
        location: settings.location || '',
        default_currency: settings.default_currency || 'USD',
        currency_icon: settings.currency_icon || '$',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.general-settings.update'));
    };

    return (
        <AdminLayout>
            <Head title="General Settings" />

            <PageHeader
                title="Settings"
                breadcrumbs={[
                    { label: 'Dashboard', url: route('admin.dashboard') },
                    { label: 'General Settings' },
                ]}
            />

            <div className="card">
                <div className="row g-0">
                    <SettingSidebar />

                    <div className="col-12 col-md-9 d-flex flex-column">
                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <h3 className="card-title mb-4">General Platform Settings</h3>

                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label required">Site Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.site_name ? 'is-invalid' : ''}`}
                                            value={data.site_name}
                                            onChange={(e) => setData('site_name', e.target.value)}
                                        />
                                        {errors.site_name && <div className="invalid-feedback">{errors.site_name}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Support Phone</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                        />
                                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Office Location / Address</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                        />
                                        {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label required">Default Currency</label>
                                        <select
                                            className={`form-select ${errors.default_currency ? 'is-invalid' : ''}`}
                                            value={data.default_currency}
                                            onChange={(e) => setData('default_currency', e.target.value)}
                                        >
                                            {currencies.map((curr, idx) => (
                                                <option key={idx} value={curr}>
                                                    {curr}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.default_currency && <div className="invalid-feedback">{errors.default_currency}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label required">Currency Symbol / Icon</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.currency_icon ? 'is-invalid' : ''}`}
                                            placeholder="e.g. $, Rp, €, £"
                                            value={data.currency_icon}
                                            onChange={(e) => setData('currency_icon', e.target.value)}
                                        />
                                        {errors.currency_icon && <div className="invalid-feedback">{errors.currency_icon}</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer bg-transparent text-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={processing}
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
