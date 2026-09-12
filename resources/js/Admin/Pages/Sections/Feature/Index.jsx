import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import { route } from '@/Utils/routes';

export default function Index({ feature }) {
    const { data, setData, post, processing, errors } = useForm({
        title_one: feature?.title_one || '',
        title_two: feature?.title_two || '',
        title_three: feature?.title_three || '',
        subtitle_one: feature?.subtitle_one || '',
        subtitle_two: feature?.subtitle_two || '',
        subtitle_three: feature?.subtitle_three || '',
        image_one: null,
        image_two: null,
        image_three: null,
    });

    const [previewOne, setPreviewOne] = useState(
        feature?.feature_image_one || ''
    );
    const [previewTwo, setPreviewTwo] = useState(
        feature?.feature_image_two || ''
    );
    const [previewThree, setPreviewThree] = useState(
        feature?.feature_image_three || ''
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
        post(route('admin.feature.store'), {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                if (window.toast) {
                    window.toast.success('Features Section Berhasil Diperbarui', 'Data feature section telah disimpan ke database.');
                }
            },
            onError: () => {
                if (window.toast) {
                    window.toast.danger('Gagal Memperbarui Features Section', 'Silakan periksa kembali kelengkapan form input.');
                }
            },
        });
    };

    return (
        <AdminLayout title="Features Section">
            <Head title="Features Section" />
            <PageHeader title="Features Section" pretitle="Sections" />

            <div className="page-body">
                <div className="container-xl">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Features Section Settings</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="row g-3">
                                    {/* Feature Item 1 */}
                                    <div className="col-md-12">
                                        <label className="form-label fw-bold text-primary fs-3 mb-2">Feature 1</label>
                                        {previewOne && (
                                            <div className="mb-2">
                                                <img src={previewOne} alt="Feature 1 Preview" className="img-thumbnail" style={{ maxHeight: '120px' }} />
                                            </div>
                                        )}
                                        <label className="form-label">Image One</label>
                                        <input
                                            type="file"
                                            className={`form-control ${errors.image_one ? 'is-invalid' : ''}`}
                                            onChange={(e) => handleFileChange('image_one', setPreviewOne, e)}
                                            accept="image/*"
                                        />
                                        {errors.image_one && <div className="invalid-feedback">{errors.image_one}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Title One</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.title_one ? 'is-invalid' : ''}`}
                                            value={data.title_one}
                                            onChange={(e) => setData('title_one', e.target.value)}
                                        />
                                        {errors.title_one && <div className="invalid-feedback">{errors.title_one}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Subtitle One</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.subtitle_one ? 'is-invalid' : ''}`}
                                            value={data.subtitle_one}
                                            onChange={(e) => setData('subtitle_one', e.target.value)}
                                        />
                                        {errors.subtitle_one && <div className="invalid-feedback">{errors.subtitle_one}</div>}
                                    </div>

                                    <hr className="my-4" />

                                    {/* Feature Item 2 */}
                                    <div className="col-md-12">
                                        <label className="form-label fw-bold text-primary fs-3 mb-2">Feature 2</label>
                                        {previewTwo && (
                                            <div className="mb-2">
                                                <img src={previewTwo} alt="Feature 2 Preview" className="img-thumbnail" style={{ maxHeight: '120px' }} />
                                            </div>
                                        )}
                                        <label className="form-label">Image Two</label>
                                        <input
                                            type="file"
                                            className={`form-control ${errors.image_two ? 'is-invalid' : ''}`}
                                            onChange={(e) => handleFileChange('image_two', setPreviewTwo, e)}
                                            accept="image/*"
                                        />
                                        {errors.image_two && <div className="invalid-feedback">{errors.image_two}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Title Two</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.title_two ? 'is-invalid' : ''}`}
                                            value={data.title_two}
                                            onChange={(e) => setData('title_two', e.target.value)}
                                        />
                                        {errors.title_two && <div className="invalid-feedback">{errors.title_two}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Subtitle Two</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.subtitle_two ? 'is-invalid' : ''}`}
                                            value={data.subtitle_two}
                                            onChange={(e) => setData('subtitle_two', e.target.value)}
                                        />
                                        {errors.subtitle_two && <div className="invalid-feedback">{errors.subtitle_two}</div>}
                                    </div>

                                    <hr className="my-4" />

                                    {/* Feature Item 3 */}
                                    <div className="col-md-12">
                                        <label className="form-label fw-bold text-primary fs-3 mb-2">Feature 3</label>
                                        {previewThree && (
                                            <div className="mb-2">
                                                <img src={previewThree} alt="Feature 3 Preview" className="img-thumbnail" style={{ maxHeight: '120px' }} />
                                            </div>
                                        )}
                                        <label className="form-label">Image Three</label>
                                        <input
                                            type="file"
                                            className={`form-control ${errors.image_three ? 'is-invalid' : ''}`}
                                            onChange={(e) => handleFileChange('image_three', setPreviewThree, e)}
                                            accept="image/*"
                                        />
                                        {errors.image_three && <div className="invalid-feedback">{errors.image_three}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Title Three</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.title_three ? 'is-invalid' : ''}`}
                                            value={data.title_three}
                                            onChange={(e) => setData('title_three', e.target.value)}
                                        />
                                        {errors.title_three && <div className="invalid-feedback">{errors.title_three}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Subtitle Three</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.subtitle_three ? 'is-invalid' : ''}`}
                                            value={data.subtitle_three}
                                            onChange={(e) => setData('subtitle_three', e.target.value)}
                                        />
                                        {errors.subtitle_three && <div className="invalid-feedback">{errors.subtitle_three}</div>}
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
