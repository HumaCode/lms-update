import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import { route } from '@/Utils/routes';

export default function Edit({ testimonial }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: testimonial?.user_name || '',
        title: testimonial?.user_title || '',
        rating: testimonial?.rating || 5,
        review: testimonial?.review || '',
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(
        testimonial?.testimonial_user_image || (testimonial?.user_image ? (testimonial.user_image.startsWith('http') ? testimonial.user_image : `/${testimonial.user_image}`) : '')
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
        post(route('admin.testimonial-section.update', testimonial.id), {
            forceFormData: true,
            onSuccess: () => {
                if (window.toast) {
                    window.toast.success('Testimonial Berhasil Diperbarui', 'Data testimonial telah diperbarui.');
                }
            },
            onError: () => {
                if (window.toast) {
                    window.toast.danger('Gagal Memperbarui Testimonial', 'Silakan periksa kembali inputan form.');
                }
            },
        });
    };

    return (
        <AdminLayout title="Edit Testimonial">
            <Head title="Edit Testimonial" />
            <PageHeader title="Edit Testimonial" pretitle="Sections" />

            <div className="page-body">
                <div className="container-xl">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h3 className="card-title">Edit Testimonial</h3>
                            <Link href={route('admin.testimonial-section.index')} className="btn btn-primary">
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
                                                    style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
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

                                    {/* Name */}
                                    <div className="col-md-6">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                    </div>

                                    {/* Title */}
                                    <div className="col-md-6">
                                        <label className="form-label">Title</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                        />
                                        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                                    </div>

                                    {/* Rating */}
                                    <div className="col-md-12">
                                        <label className="form-label">Rating</label>
                                        <select
                                            className={`form-select ${errors.rating ? 'is-invalid' : ''}`}
                                            value={data.rating}
                                            onChange={(e) => setData('rating', e.target.value)}
                                        >
                                            <option value={5}>5 Stars</option>
                                            <option value={4}>4 Stars</option>
                                            <option value={3}>3 Stars</option>
                                            <option value={2}>2 Stars</option>
                                            <option value={1}>1 Star</option>
                                        </select>
                                        {errors.rating && <div className="invalid-feedback">{errors.rating}</div>}
                                    </div>

                                    {/* Review */}
                                    <div className="col-md-12">
                                        <label className="form-label">Review</label>
                                        <textarea
                                            rows={4}
                                            className={`form-control ${errors.review ? 'is-invalid' : ''}`}
                                            value={data.review}
                                            onChange={(e) => setData('review', e.target.value)}
                                        />
                                        {errors.review && <div className="invalid-feedback">{errors.review}</div>}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="col-12 mt-4">
                                        <button className="btn btn-primary" type="submit" disabled={processing}>
                                            {processing ? 'Updating...' : 'Update'}
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
