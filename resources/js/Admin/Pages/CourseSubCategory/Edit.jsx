import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import { route } from '@/Utils/routes';

export default function Edit({ category, subCategory }) {
    const { data, setData, processing, errors } = useForm({
        name: subCategory.name || '',
        icon: subCategory.icon || '',
        image: null,
        show_at_trending: subCategory.show_at_trending ? 1 : 0,
        status: subCategory.status ? 1 : 0,
    });

    const [imagePreview, setImagePreview] = useState(
        subCategory.image ? `/${subCategory.image}` : null
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('admin.course-sub-categories.update', [category.id, subCategory.id]), {
            _method: 'PUT',
            ...data,
        });
    };

    return (
        <AdminLayout>
            <Head title={`Edit Sub-Category - ${subCategory.name}`} />

            <PageHeader
                title={`Edit Sub-Category: ${subCategory.name}`}
                breadcrumbs={[
                    { label: 'Dashboard', url: route('admin.dashboard') },
                    { label: 'Course Categories', url: route('admin.course-categories.index') },
                    { label: category.name, url: route('admin.course-sub-categories.index', category.id) },
                    { label: subCategory.name },
                    { label: 'Edit' },
                ]}
                actionText="Back to Sub-Categories"
                actionUrl={route('admin.course-sub-categories.index', category.id)}
                actionIcon="ti ti-arrow-left"
            />

            <div className="row">
                <div className="col-md-8 col-lg-7">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Edit Sub-Category</h3>
                        </div>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label required">Sub-Category Name</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        autoFocus
                                    />
                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Icon Class</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.icon ? 'is-invalid' : ''}`}
                                        value={data.icon}
                                        onChange={(e) => setData('icon', e.target.value)}
                                    />
                                    {errors.icon && <div className="invalid-feedback">{errors.icon}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Cover Image</label>
                                    <input
                                        type="file"
                                        className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                                    {imagePreview && (
                                        <div className="mt-2">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="img-thumbnail"
                                                style={{ maxHeight: '120px' }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-check form-switch mt-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={data.show_at_trending === 1}
                                                onChange={(e) => setData('show_at_trending', e.target.checked ? 1 : 0)}
                                            />
                                            <span className="form-check-label">Show at Trending</span>
                                        </label>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-check form-switch mt-2">
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
                            </div>
                            <div className="card-footer text-end">
                                <div className="d-flex justify-content-end gap-2">
                                    <Link
                                        href={route('admin.course-sub-categories.index', category.id)}
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
                                                Update Sub-Category
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
