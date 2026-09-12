import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import { route } from '@/Utils/routes';

export default function Index({ about }) {
    const { data, setData, post, processing, errors } = useForm({
        rounded_text: about?.rounded_text || '',
        lerner_count: about?.lerner_count || '',
        lerner_count_text: about?.lerner_count_text || '',
        about_title: about?.title || '',
        about_description: about?.description || '',
        button_text: about?.button_text || '',
        button_url: about?.button_url || '',
        video_url: about?.video_url || '',
        image: null,
        lerner_image: null,
        video_image: null,
        old_image: about?.image || '',
        old_lerner_image: about?.lerner_image || '',
        old_video_image: about?.video_image || '',
    });

    const [imagePreview, setImagePreview] = useState(
        about?.about_image || (about?.image ? (about.image.startsWith('http') ? about.image : `/${about.image}`) : '')
    );
    const [lernerImagePreview, setLernerImagePreview] = useState(
        about?.about_lerner_image || (about?.lerner_image ? (about.lerner_image.startsWith('http') ? about.lerner_image : `/${about.lerner_image}`) : '')
    );
    const [videoImagePreview, setVideoImagePreview] = useState(
        about?.about_video_image || (about?.video_image ? (about.video_image.startsWith('http') ? about.video_image : `/${about.video_image}`) : '')
    );

    const handleFileChange = (field, setPreview, e) => {
        const file = e.target.files[0];
        if (file) {
            setData(field, file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.about-section.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (window.toast) {
                    window.toast.success('About Us Section Berhasil Diperbarui', 'Data About Us telah disimpan ke database.');
                }
            },
            onError: () => {
                if (window.toast) {
                    window.toast.danger('Gagal Memperbarui About Us Section', 'Silakan periksa kembali inputan form.');
                }
            },
        });
    };

    return (
        <AdminLayout title="About Us Section">
            <Head title="About Us Section" />
            <PageHeader title="About Us Section" pretitle="Sections" />

            <div className="page-body">
                <div className="container-xl">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">About Us Section Settings</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="row g-3">
                                    {/* Main Image */}
                                    <div className="col-md-12">
                                        {imagePreview && (
                                            <div className="mb-2">
                                                <img src={imagePreview} alt="Main Preview" className="img-thumbnail" style={{ maxHeight: '120px', backgroundColor: '#c5c5c5' }} />
                                            </div>
                                        )}
                                        <label className="form-label">Image</label>
                                        <input
                                            type="file"
                                            className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                                            onChange={(e) => handleFileChange('image', setImagePreview, e)}
                                            accept="image/*"
                                        />
                                        {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                                    </div>

                                    {/* Rounded Text */}
                                    <div className="col-md-12">
                                        <label className="form-label">Rounded Text</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.rounded_text ? 'is-invalid' : ''}`}
                                            value={data.rounded_text}
                                            onChange={(e) => setData('rounded_text', e.target.value)}
                                        />
                                        {errors.rounded_text && <div className="invalid-feedback">{errors.rounded_text}</div>}
                                    </div>

                                    {/* Learner Count & Text */}
                                    <div className="col-md-6">
                                        <label className="form-label">Learner Count</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.lerner_count ? 'is-invalid' : ''}`}
                                            value={data.lerner_count}
                                            onChange={(e) => setData('lerner_count', e.target.value)}
                                        />
                                        {errors.lerner_count && <div className="invalid-feedback">{errors.lerner_count}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Learner Count Text</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.lerner_count_text ? 'is-invalid' : ''}`}
                                            value={data.lerner_count_text}
                                            onChange={(e) => setData('lerner_count_text', e.target.value)}
                                        />
                                        {errors.lerner_count_text && <div className="invalid-feedback">{errors.lerner_count_text}</div>}
                                    </div>

                                    {/* Learner Image */}
                                    <div className="col-md-12">
                                        {lernerImagePreview && (
                                            <div className="mb-2">
                                                <img src={lernerImagePreview} alt="Learner Preview" className="img-thumbnail" style={{ maxHeight: '120px', backgroundColor: '#c5c5c5' }} />
                                            </div>
                                        )}
                                        <label className="form-label">Learner Image</label>
                                        <input
                                            type="file"
                                            className={`form-control ${errors.lerner_image ? 'is-invalid' : ''}`}
                                            onChange={(e) => handleFileChange('lerner_image', setLernerImagePreview, e)}
                                            accept="image/*"
                                        />
                                        {errors.lerner_image && <div className="invalid-feedback">{errors.lerner_image}</div>}
                                    </div>

                                    {/* About Title */}
                                    <div className="col-md-12">
                                        <label className="form-label">About Title</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.about_title ? 'is-invalid' : ''}`}
                                            value={data.about_title}
                                            onChange={(e) => setData('about_title', e.target.value)}
                                        />
                                        {errors.about_title && <div className="invalid-feedback">{errors.about_title}</div>}
                                    </div>

                                    {/* About Description */}
                                    <div className="col-md-12">
                                        <label className="form-label">About Description</label>
                                        <textarea
                                            rows="5"
                                            className={`form-control ${errors.about_description ? 'is-invalid' : ''}`}
                                            value={data.about_description}
                                            onChange={(e) => setData('about_description', e.target.value)}
                                        ></textarea>
                                        {errors.about_description && <div className="invalid-feedback">{errors.about_description}</div>}
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

                                    {/* Video Image */}
                                    <div className="col-md-12">
                                        {videoImagePreview && (
                                            <div className="mb-2">
                                                <img src={videoImagePreview} alt="Video Image Preview" className="img-thumbnail" style={{ maxHeight: '120px', backgroundColor: '#c5c5c5' }} />
                                            </div>
                                        )}
                                        <label className="form-label">Video Image</label>
                                        <input
                                            type="file"
                                            className={`form-control ${errors.video_image ? 'is-invalid' : ''}`}
                                            onChange={(e) => handleFileChange('video_image', setVideoImagePreview, e)}
                                            accept="image/*"
                                        />
                                        {errors.video_image && <div className="invalid-feedback">{errors.video_image}</div>}
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
