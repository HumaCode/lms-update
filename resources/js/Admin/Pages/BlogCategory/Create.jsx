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
        post(route('admin.blog-categories.store'), {
            onSuccess: () => {
                if (window.toast) {
                    window.toast.success('Kategori Blog Berhasil Ditambahkan', 'Data kategori blog baru telah disimpan.');
                }
            },
            onError: () => {
                if (window.toast) {
                    window.toast.danger('Gagal Menambahkan Kategori Blog', 'Silakan periksa kembali inputan form.');
                }
            },
        });
    };

    return (
        <AdminLayout title="Create Blog Category">
            <Head title="Create Blog Category" />
            <PageHeader title="Create Blog Category" pretitle="Content Management" />

            <div className="page-body">
                <div className="container-xl">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h3 className="card-title">Create Category</h3>
                            <Link href={route('admin.blog-categories.index')} className="btn btn-primary">
                                Back
                            </Link>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-12">
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

                                    <div className="col-md-12">
                                        <label className="form-label">Status</label>
                                        <select
                                            className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                                            value={data.status}
                                            onChange={(e) => setData('status', Number(e.target.value))}
                                        >
                                            <option value={1}>Active</option>
                                            <option value={0}>Inactive</option>
                                        </select>
                                        {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                                    </div>

                                    <div className="col-12 mt-4">
                                        <button type="submit" className="btn btn-primary" disabled={processing}>
                                            {processing ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                'Save Category'
                                            )}
                                        </button>
                                        <Link href={route('admin.blog-categories.index')} className="btn btn-link link-secondary ms-2">
                                            Cancel
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
