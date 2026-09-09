import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import { route } from '@/Utils/routes';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        status: 1,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.blog-categories.store'));
    };

    return (
        <AdminLayout>
            <Head title="Create Blog Category" />

            <PageHeader
                title="Create Blog Category"
                breadcrumbs={[
                    { label: 'Dashboard', url: route('admin.dashboard') },
                    { label: 'Blog Categories', url: route('admin.blog-categories.index') },
                    { label: 'Create' },
                ]}
                actionText="Back to List"
                actionUrl={route('admin.blog-categories.index')}
                actionIcon="ti ti-arrow-left"
            />

            <div className="row">
                <div className="col-md-8 col-lg-6">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Category Information</h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label required">Category Name</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        placeholder="e.g. Technology, Education, Career"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        autoFocus
                                    />
                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={data.status === 1}
                                            onChange={(e) => setData('status', e.target.checked ? 1 : 0)}
                                        />
                                        <span className="form-check-label">Active Status</span>
                                    </label>
                                </div>
                            </div>
                            <div className="card-footer text-end">
                                <div className="d-flex justify-content-end gap-2">
                                    <Link
                                        href={route('admin.blog-categories.index')}
                                        className="btn btn-link link-secondary"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className="ti ti-check me-1"></i>
                                                Save Category
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
