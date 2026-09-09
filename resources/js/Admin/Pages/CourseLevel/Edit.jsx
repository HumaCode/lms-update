import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import { route } from '@/Utils/routes';

export default function Edit({ level }) {
    const { data, setData, put, processing, errors } = useForm({
        name: level.name || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.course-levels.update', level.id));
    };

    return (
        <AdminLayout>
            <Head title={`Edit Level: ${level.name}`} />

            <PageHeader
                title="Edit Course Level"
                breadcrumbs={[
                    { label: 'Dashboard', url: route('admin.dashboard') },
                    { label: 'Course Levels', url: route('admin.course-levels.index') },
                    { label: level.name },
                    { label: 'Edit' },
                ]}
                actionText="Back to List"
                actionUrl={route('admin.course-levels.index')}
                actionIcon="ti ti-arrow-left"
            />

            <div className="row">
                <div className="col-md-8 col-lg-6">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Edit Level</h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label required">Level Name</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        autoFocus
                                    />
                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                </div>
                            </div>
                            <div className="card-footer text-end">
                                <div className="d-flex justify-content-end gap-2">
                                    <Link
                                        href={route('admin.course-levels.index')}
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
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="ti ti-check me-1"></i>
                                                Update Level
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
