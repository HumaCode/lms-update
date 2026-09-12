import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import { route } from '@/Utils/routes';

export default function Index({ hero }) {
    const { data, setData, post, processing, errors } = useForm({
        label: hero?.label || '',
        title: hero?.title || '',
        subtitle: hero?.subtitle || '',
        button_text: hero?.button_text || '',
        button_url: hero?.button_url || '',
        video_button_text: hero?.video_button_text || '',
        video_button_url: hero?.video_button_url || '',
        banner_item_title: hero?.banner_item_title || '',
        banner_item_subtitle: hero?.banner_item_subtitle || '',
        rounded_text: hero?.round_text || '',
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(
        hero?.hero_image || ''
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
        post(route('admin.hero.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (window.toast) {
                    window.toast.success('Hero Section Berhasil Diperbarui', 'Data hero section telah disimpan ke database.');
                }
            },
            onError: () => {
                if (window.toast) {
                    window.toast.danger('Gagal Memperbarui Hero Section', 'Silakan periksa kembali kelengkapan form input.');
                }
            }
        });
    };

    return (
        <AdminLayout title="Hero Section">
            <Head title="Hero Section" />
            <PageHeader title="Hero Section" pretitle="Sections" />

            <div className="page-body">
                <div className="container-xl">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Hero Section Settings</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Label</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.label ? 'is-invalid' : ''}`}
                                            value={data.label}
                                            onChange={(e) => setData('label', e.target.value)}
                                        />
                                        {errors.label && <div className="invalid-feedback">{errors.label}</div>}
                                    </div>

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

                                    <div className="col-md-12">
                                        <label className="form-label">Subtitle</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.subtitle ? 'is-invalid' : ''}`}
                                            value={data.subtitle}
                                            onChange={(e) => setData('subtitle', e.target.value)}
                                        />
                                        {errors.subtitle && <div className="invalid-feedback">{errors.subtitle}</div>}
                                    </div>

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
                                        <label className="form-label">Button Url</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.button_url ? 'is-invalid' : ''}`}
                                            value={data.button_url}
                                            onChange={(e) => setData('button_url', e.target.value)}
                                        />
                                        {errors.button_url && <div className="invalid-feedback">{errors.button_url}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Video Button Text</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.video_button_text ? 'is-invalid' : ''}`}
                                            value={data.video_button_text}
                                            onChange={(e) => setData('video_button_text', e.target.value)}
                                        />
                                        {errors.video_button_text && <div className="invalid-feedback">{errors.video_button_text}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Video Button Url</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.video_button_url ? 'is-invalid' : ''}`}
                                            value={data.video_button_url}
                                            onChange={(e) => setData('video_button_url', e.target.value)}
                                        />
                                        {errors.video_button_url && <div className="invalid-feedback">{errors.video_button_url}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Banner Item Title</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.banner_item_title ? 'is-invalid' : ''}`}
                                            value={data.banner_item_title}
                                            onChange={(e) => setData('banner_item_title', e.target.value)}
                                        />
                                        {errors.banner_item_title && <div className="invalid-feedback">{errors.banner_item_title}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Banner Item Subtitle</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.banner_item_subtitle ? 'is-invalid' : ''}`}
                                            value={data.banner_item_subtitle}
                                            onChange={(e) => setData('banner_item_subtitle', e.target.value)}
                                        />
                                        {errors.banner_item_subtitle && <div className="invalid-feedback">{errors.banner_item_subtitle}</div>}
                                    </div>

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

                                    <div className="col-md-12">
                                        <label className="form-label">Hero Image</label>
                                        {imagePreview && (
                                            <div className="mb-2">
                                                <img src={imagePreview} alt="Hero Preview" className="img-thumbnail" style={{ maxHeight: '120px' }} />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                                            onChange={handleImageChange}
                                            accept="image/*"
                                        />
                                        {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                                    </div>

                                    <div className="col-12 mt-4">
                                        <button className="btn btn-primary" type="submit" disabled={processing}>
                                            {processing ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Sedang memproses...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="ti ti-device-floppy me-1 fs-2"></i> Update
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
