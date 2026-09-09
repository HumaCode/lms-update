import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import { route } from '@/Utils/routes';

export default function Create() {
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        image: null,
        show_at_trending: false,
        status: true,
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.course-categories.store'));
    };

    return (
        <AdminLayout title="Create Course Category">
            <PageHeader
                title="Create Category"
                pretitle="Course Management"
                actions={
                    <Link
                        href={route('admin.course-categories.index')}
                        className="btn btn-outline-secondary"
                    >
                        <i className="ti ti-arrow-left me-1"></i> Back to List
                    </Link>
                }
            />

            <div className="page-body">
                <div className="container-xl">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Category Details</h3>
                        </div>
                        <form onSubmit={submit} encType="multipart/form-data">
                            <div className="card-body">
                                <div className="row g-3">
                                    {/* Image Upload */}
                                    <div className="col-12">
                                        <label className="form-label required">Category Icon / Image</label>
                                        <input
                                            type="file"
                                            className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            required
                                        />
                                        {errors.image && <div className="invalid-feedback">{errors.image}</div>}

                                        {preview && (
                                            <div className="mt-2">
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    style={{
                                                        width: 80,
                                                        height: 80,
                                                        objectFit: 'cover',
                                                        borderRadius: 8,
                                                        border: '1px solid #ddd',
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Category Name */}
                                    <div className="col-12">
                                        <label className="form-label required">Category Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            placeholder="e.g. Web Development"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                    </div>

                                    {/* Show at Trending */}
                                    <div className="col-md-6">
                                        <label className="form-check form-switch mt-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={data.show_at_trending}
                                                onChange={(e) => setData('show_at_trending', e.target.checked)}
                                            />
                                            <span className="form-check-label">Show at Trending</span>
                                        </label>
                                    </div>

                                    {/* Status */}
                                    <div className="col-md-6">
                                        <label className="form-check form-switch mt-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={data.status}
                                                onChange={(e) => setData('status', e.target.checked)}
                                            />
                                            <span className="form-check-label">Active Status</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer d-flex justify-content-end">
                                <Link
                                    href={route('admin.course-categories.index')}
                                    className="btn btn-link link-secondary me-2"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={processing}
                                >
                                    {processing ? 'Saving...' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
