import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import SettingSidebar from './Components/SettingSidebar';
import { route } from '@/Utils/routes';

export default function Logo({ settings = {} }) {
    const { data, setData, post, processing, errors } = useForm({
        site_logo: null,
        site_footer_logo: null,
        site_favicon: null,
        site_breadcrumb: null,
    });

    const [previews, setPreviews] = useState({
        site_logo: settings.site_logo ? `/${settings.site_logo}` : null,
        site_footer_logo: settings.site_footer_logo ? `/${settings.site_footer_logo}` : null,
        site_favicon: settings.site_favicon ? `/${settings.site_favicon}` : null,
        site_breadcrumb: settings.site_breadcrumb ? `/${settings.site_breadcrumb}` : null,
    });

    const handleFileChange = (field, file) => {
        if (file) {
            setData(field, file);
            setPreviews((prev) => ({
                ...prev,
                [field]: URL.createObjectURL(file),
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.logo-settings.update'));
    };

    return (
        <AdminLayout>
            <Head title="Logo & Favicon Settings" />

            <PageHeader
                title="Settings"
                breadcrumbs={[
                    { label: 'Dashboard', url: route('admin.dashboard') },
                    { label: 'Logo & Favicon' },
                ]}
            />

            <div className="card">
                <div className="row g-0">
                    <SettingSidebar />

                    <div className="col-12 col-md-9 d-flex flex-column">
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="card-body">
                                <h3 className="card-title mb-4">Logo & Favicon Branding</h3>

                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <label className="form-label">Header Logo</label>
                                        <input
                                            type="file"
                                            className={`form-control ${errors.site_logo ? 'is-invalid' : ''}`}
                                            accept="image/*"
                                            onChange={(e) => handleFileChange('site_logo', e.target.files[0])}
                                        />
                                        {errors.site_logo && <div className="invalid-feedback">{errors.site_logo}</div>}
                                        {previews.site_logo && (
                                            <div className="mt-2 p-2 bg-light rounded text-center">
                                                <img src={previews.site_logo} alt="Header Logo" style={{ maxHeight: '60px' }} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Footer Logo</label>
                                        <input
                                            type="file"
                                            className={`form-control ${errors.site_footer_logo ? 'is-invalid' : ''}`}
                                            accept="image/*"
                                            onChange={(e) => handleFileChange('site_footer_logo', e.target.files[0])}
                                        />
                                        {errors.site_footer_logo && <div className="invalid-feedback">{errors.site_footer_logo}</div>}
                                        {previews.site_footer_logo && (
                                            <div className="mt-2 p-2 bg-dark rounded text-center">
                                                <img src={previews.site_footer_logo} alt="Footer Logo" style={{ maxHeight: '60px' }} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Favicon (32x32 / png)</label>
                                        <input
                                            type="file"
                                            className={`form-control ${errors.site_favicon ? 'is-invalid' : ''}`}
                                            accept="image/*"
                                            onChange={(e) => handleFileChange('site_favicon', e.target.files[0])}
                                        />
                                        {errors.site_favicon && <div className="invalid-feedback">{errors.site_favicon}</div>}
                                        {previews.site_favicon && (
                                            <div className="mt-2 p-2 bg-light rounded">
                                                <img src={previews.site_favicon} alt="Favicon" style={{ maxHeight: '32px' }} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Breadcrumb Background</label>
                                        <input
                                            type="file"
                                            className={`form-control ${errors.site_breadcrumb ? 'is-invalid' : ''}`}
                                            accept="image/*"
                                            onChange={(e) => handleFileChange('site_breadcrumb', e.target.files[0])}
                                        />
                                        {errors.site_breadcrumb && <div className="invalid-feedback">{errors.site_breadcrumb}</div>}
                                        {previews.site_breadcrumb && (
                                            <div className="mt-2 p-2 bg-light rounded text-center">
                                                <img src={previews.site_breadcrumb} alt="Breadcrumb" style={{ maxHeight: '70px', maxWidth: '100%' }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer bg-transparent text-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={processing}
                                >
                                    {processing ? 'Uploading...' : 'Save Branding'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
