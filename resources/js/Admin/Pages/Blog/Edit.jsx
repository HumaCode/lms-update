import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import { route } from '@/Utils/routes';

export default function Edit({ blog, categories = [] }) {
    const { data, setData, processing, errors } = useForm({
        title: blog?.title || '',
        category: blog?.blog_category_id || '',
        image: null,
        description: blog?.description || '',
        status: blog?.status ? 1 : 0,
    });

    const [imagePreview, setImagePreview] = useState(
        blog?.blog_image || (blog?.image ? (blog.image.startsWith('http') ? blog.image : `/${blog.image}`) : null)
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
        router.post(route('admin.blogs.update', blog.id), {
            _method: 'PUT',
            ...data,
        }, {
            forceFormData: true,
            onSuccess: () => {
                if (window.toast) {
                    window.toast.success('Artikel Blog Berhasil Diperbarui', 'Data artikel blog telah diperbarui.');
                }
            },
            onError: () => {
                if (window.toast) {
                    window.toast.danger('Gagal Memperbarui Artikel Blog', 'Silakan periksa kembali inputan form.');
                }
            },
        });
    };

    return (
        <AdminLayout title={`Edit Post: ${blog?.title}`}>
            <Head title={`Edit Post: ${blog?.title}`} />
            <PageHeader title="Edit Blog Post" pretitle="Content Management" />

            <div className="page-body">
                <div className="container-xl">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h3 className="card-title">Edit Article</h3>
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
                                        <label className="form-label">Change Featured Image</label>
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
                                            <option value={1}>Published</option>
                                            <option value={0}>Draft / Inactive</option>
                                        </select>
                                    </div>

                                    <div className="col-12 mt-4">
                                        <button type="submit" className="btn btn-primary" disabled={processing}>
                                            {processing ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Updating...
                                                </>
                                            ) : (
                                                'Update Post'
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
