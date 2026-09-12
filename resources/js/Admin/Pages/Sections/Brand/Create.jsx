import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import { route } from '@/Utils/routes';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        url: '',
        status: 1,
        image: null,
    });

    const [imagePreview, setImagePreview] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.brand-section.store'), {
            forceFormData: true,
            onSuccess: () => {
                if (window.toast) {
                    window.toast.success('Brand Berhasil Ditambahkan', 'Data brand baru telah disimpan.');
                }
            },
            onError: () => {
                if (window.toast) {
                    window.toast.danger('Gagal Menambahkan Brand', 'Silakan periksa kembali inputan form.');
                }
            },
        });
    };

    return (
        <AdminLayout title="Create Brand">
            <Head title="Create Brand" />
            <PageHeader title="Create Brand" pretitle="Sections" />

            <div className="page-body">
                <div className="container-xl">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h3 className="card-title">Create Brand</h3>
                            <Link href={route('admin.brand-section.index')} className="btn btn-primary">
                                Back
                            </Link>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="row g-3">
                                    {/* Image */}
                                    <div className="col-md-12">
                                        {imagePreview && (
                                            <div className="mb-2">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="img-thumbnail"
                                                    style={{ maxHeight: '120px', backgroundColor: '#c5c5c5' }}
                                                />
                                            </div>
                                        )}
                                        <label className="form-label">Image</label>
                                        <input
                                            type="file"
                                            className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                                            onChange={handleImageChange}
                                            accept="image/*"
                                        />
                                        {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                                    </div>

                                    {/* URL */}
                                    <div className="col-md-12">
                                        <label className="form-label">URL</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.url ? 'is-invalid' : ''}`}
                                            value={data.url}
                                            onChange={(e) => setData('url', e.target.value)}
                                        />
                                        {errors.url && <div className="invalid-feedback">{errors.url}</div>}
                                    </div>

                                    {/* Status */}
                                    <div className="col-md-12">
                                        <label className="form-label">Status</label>
                                        <select
                                            className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                        >
                                            <option value={1}>Active</option>
                                            <option value={0}>Inactive</option>
                                        </select>
                                        {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="col-12 mt-4">
                                        <button className="btn btn-primary" type="submit" disabled={processing}>
                                            {processing ? 'Saving...' : 'Create'}
                                        </button>
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
