import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import { route } from '@/Utils/routes';

export default function Create({ categories = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category: '',
        image: null,
        description: '',
        status: 1,
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.blogs.store'));
    };

    return (
        <AdminLayout>
            <Head title="Write Blog Post" />

            <PageHeader
                title="Write Blog Post"
                breadcrumbs={[
                    { label: 'Dashboard', url: route('admin.dashboard') },
                    { label: 'Blogs', url: route('admin.blogs.index') },
                    { label: 'Write' },
                ]}
                actionText="Back to Blogs"
                actionUrl={route('admin.blogs.index')}
                actionIcon="ti ti-arrow-left"
            />

            <div className="row">
                <div className="col-md-9 col-lg-8">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Article Details</h3>
                        </div>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label required">Post Title</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                        placeholder="Enter engaging blog title..."
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        autoFocus
                                    />
                                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label required">Category</label>
                                        <select
                                            className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                        >
                                            <option value="">-- Select Category --</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label required">Featured Image</label>
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
                                                    style={{ maxHeight: '140px' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label required">Article Content</label>
                                    <textarea
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                        rows="12"
                                        placeholder="Write article content here..."
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    ></textarea>
                                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={data.status === 1}
                                            onChange={(e) => setData('status', e.target.checked ? 1 : 0)}
                                        />
                                        <span className="form-check-label">Publish immediately</span>
                                    </label>
                                </div>
                            </div>
                            <div className="card-footer text-end">
                                <div className="d-flex justify-content-end gap-2">
                                    <Link
                                        href={route('admin.blogs.index')}
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
                                                Publishing...
                                            </>
                                        ) : (
                                            <>
                                                <i className="ti ti-check me-1"></i>
                                                Publish Post
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
