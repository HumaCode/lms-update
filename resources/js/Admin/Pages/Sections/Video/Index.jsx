import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import { route } from '@/Utils/routes';

export default function Index({ video }) {
    const { data, setData, post, processing, errors } = useForm({
        video_url: video?.video_url || '',
        description: video?.description || '',
        button_text: video?.button_text || '',
        button_url: video?.button_url || '',
        background: null,
    });

    const [backgroundPreview, setBackgroundPreview] = useState(
        video?.video_background || (video?.background ? (video.background.startsWith('http') ? video.background : `/${video.background}`) : '')
    );

    const handleBackgroundChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('background', file);
            setBackgroundPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.video-section.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (window.toast) {
                    window.toast.success('Video Section Berhasil Diperbarui', 'Data video section telah disimpan ke database.');
                }
            },
            onError: () => {
                if (window.toast) {
                    window.toast.danger('Gagal Memperbarui Video Section', 'Silakan periksa kembali inputan form.');
                }
            },
        });
    };

    return (
        <AdminLayout title="Video Section">
            <Head title="Video Section" />
            <PageHeader title="Video Section" pretitle="Sections" />

            <div className="page-body">
                <div className="container-xl">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Video Section Settings</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="row g-3">
                                    {/* Background Image */}
                                    <div className="col-md-12">
                                        {backgroundPreview && (
                                            <div className="mb-2">
                                                <img
                                                    src={backgroundPreview}
                                                    alt="Preview"
                                                    className="img-thumbnail"
                                                    style={{ maxHeight: '120px', backgroundColor: '#c5c5c5' }}
                                                />
                                            </div>
                                        )}
                                        <label className="form-label">Background</label>
                                        <input
                                            type="file"
                                            className={`form-control ${errors.background ? 'is-invalid' : ''}`}
                                            onChange={handleBackgroundChange}
                                            accept="image/*"
                                        />
                                        {errors.background && <div className="invalid-feedback">{errors.background}</div>}
                                    </div>

                                    {/* Video URL */}
                                    <div className="col-md-12">
                                        <label className="form-label">Video URL</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.video_url ? 'is-invalid' : ''}`}
                                            value={data.video_url}
                                            onChange={(e) => setData('video_url', e.target.value)}
                                        />
                                        {errors.video_url && <div className="invalid-feedback">{errors.video_url}</div>}
                                    </div>

                                    {/* Description */}
                                    <div className="col-md-12">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            rows="4"
                                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                        ></textarea>
                                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
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
