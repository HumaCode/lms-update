import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import { route } from '@/Utils/routes';

export default function Index({ becomeInstructor }) {
    const { data, setData, post, processing, errors } = useForm({
        title: becomeInstructor?.title || '',
        subtitle: becomeInstructor?.subtitle || '',
        button_text: becomeInstructor?.button_text || '',
        button_url: becomeInstructor?.button_url || '',
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(
        becomeInstructor?.become_instructor_image || (becomeInstructor?.image ? (becomeInstructor.image.startsWith('http') ? becomeInstructor.image : `/${becomeInstructor.image}`) : '')
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
        post(route('admin.become-instructor-section.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (window.toast) {
                    window.toast.success('Become Instructor Section Berhasil Diperbarui', 'Data banner telah disimpan ke database.');
                }
            },
            onError: () => {
                if (window.toast) {
                    window.toast.danger('Gagal Memperbarui Become Instructor Section', 'Silakan periksa kembali inputan form.');
                }
            },
        });
    };

    return (
        <AdminLayout title="Become Instructor Banner">
            <Head title="Become Instructor Banner" />
            <PageHeader title="Become Instructor Banner" pretitle="Sections" />

            <div className="page-body">
                <div className="container-xl">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Become Instructor Banner Settings</h3>
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

                                    {/* Title & Subtitle */}
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

                                    <div className="col-md-6">
                                        <label className="form-label">Subtitle</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.subtitle ? 'is-invalid' : ''}`}
                                            value={data.subtitle}
                                            onChange={(e) => setData('subtitle', e.target.value)}
                                        />
                                        {errors.subtitle && <div className="invalid-feedback">{errors.subtitle}</div>}
                                    </div>

                                    {/* Button Text & URL */}
                                    <div className="col-md-6">
                                        <label className="form-label">Button Text</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.button_text ? 'is-invalid' : ''}`}
                                            value={data.button_text}
                                            onChange={(e) => setData('button_text', e.target.value)}
                                        />
                                        {errors.button_text && <div className="invalid-feedback">{errors.button_text}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Button URL</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.button_url ? 'is-invalid' : ''}`}
                                            value={data.button_url}
                                            onChange={(e) => setData('button_url', e.target.value)}
                                        />
                                        {errors.button_url && <div className="invalid-feedback">{errors.button_url}</div>}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="col-12 mt-4">
                                        <button className="btn btn-primary" type="submit" disabled={processing}>
                                            {processing ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Sedang memproses...
                                                </>
                                            ) : (
                                                <>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="icon icon-tabler icon-tabler-device-floppy me-2"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="2"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
                                                        <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                                                        <path d="M14 4l0 4l-6 0l0 -4" />
                                                    </svg>
                                                    Update
                                                </>
                                            )}
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
