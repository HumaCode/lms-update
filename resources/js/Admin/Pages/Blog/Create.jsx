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
        post(route('admin.blogs.store'), {
            forceFormData: true,
            onSuccess: () => {
                if (window.toast) {
                    window.toast.success('Artikel Blog Berhasil Ditambahkan', 'Artikel blog baru telah disimpan.');
                }
            },
            onError: () => {
                if (window.toast) {
                    window.toast.danger('Gagal Menambahkan Artikel Blog', 'Silakan periksa kembali inputan form.');
                }
            },
        });
    };

    return (
        <AdminLayout title="Write Blog Post">
            <Head title="Write Blog Post" />
            <PageHeader title="Write Blog Post" pretitle="Content Management" />

            <div className="page-body">
                <div className="container-xl">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h3 className="card-title">Article Details</h3>
                            <Link href={route('admin.blogs.index')} className="btn btn-primary">
                                Back
                            </Link>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="row g-3">
                                    <div className="col-md-12">
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

                                    <div className="col-md-6">
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

                                    <div className="col-md-6">
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

                                    <div className="col-md-12">
                                        <label className="form-label required">Article Content</label>
                                        <textarea
                                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                            rows="10"
                                            placeholder="Write article content here..."
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                        ></textarea>
                                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                    </div>

                                    <div className="col-md-12">
                                        <label className="form-label">Status</label>
                                        <select
                                            className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                                            value={data.status}
                                            onChange={(e) => setData('status', Number(e.target.value))}
                                        >
                                            <option value={1}>Publish immediately</option>
                                            <option value={0}>Draft / Inactive</option>
                                        </select>
                                    </div>

                                    <div className="col-12 mt-4">
                                        <button type="submit" className="btn btn-primary" disabled={processing}>
                                            {processing ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Publishing...
                                                </>
                                            ) : (
                                                'Publish Post'
                                            )}
                                        </button>
                                        <Link href={route('admin.blogs.index')} className="btn btn-link link-secondary ms-2">
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
