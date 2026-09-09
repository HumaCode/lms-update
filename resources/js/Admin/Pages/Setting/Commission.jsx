import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import SettingSidebar from './Components/SettingSidebar';
import { route } from '@/Utils/routes';

export default function Commission({ commission_rate = 0 }) {
    const { data, setData, post, processing, errors } = useForm({
        commission_rate: commission_rate,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.commission-settings.update'));
    };

    return (
        <AdminLayout>
            <Head title="Commission Settings" />

            <PageHeader
                title="Settings"
                breadcrumbs={[
                    { label: 'Dashboard', url: route('admin.dashboard') },
                    { label: 'Commission Settings' },
                ]}
            />

            <div className="card">
                <div className="row g-0">
                    <SettingSidebar />

                    <div className="col-12 col-md-9 d-flex flex-column">
                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <h3 className="card-title mb-4">Platform Commission Rate</h3>
                                <p className="text-secondary small">
                                    Define the percentage cut the platform retains from every instructor course sale.
                                </p>

                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label required">Commission Percentage (%)</label>
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                className={`form-control ${errors.commission_rate ? 'is-invalid' : ''}`}
                                                value={data.commission_rate}
                                                onChange={(e) => setData('commission_rate', e.target.value)}
                                            />
                                            <span className="input-group-text">%</span>
                                        </div>
                                        {errors.commission_rate && (
                                            <div className="text-danger small mt-1">{errors.commission_rate}</div>
                                        )}
                                        <small className="form-hint">
                                            e.g. Set 20 to take 20% platform fee; instructor gets 80%.
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer bg-transparent text-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={processing}
                                >
                                    {processing ? 'Saving...' : 'Save Commission Rate'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
