import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InstructorLayout from '@/Instructor/Layouts/InstructorLayout';
import { route } from '@/Utils/routes';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        seo_description: '',
        thumbnail: null,
        demo_video_storage: 'youtube',
        demo_video_source: '',
        price: '',
        discount: '',
        description: '',
    });

    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('thumbnail', file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('instructor.courses.sore-basic-info'), {
            forceFormData: true,
        });
    };

    return (
        <InstructorLayout
            title="Create Course"
            crumbs={[
                { label: 'Courses', url: route('instructor.courses.index') },
                { label: 'Create Course' },
            ]}
        >
            <Head title="Create New Course" />

            <div className="card border-0 shadow-sm rounded-3">
                <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="fw-bold mb-0 text-dark">Step 1: Course Basic Information</h5>
                        <p className="text-muted small mb-0">Provide core information about your upcoming course</p>
                    </div>
                    <Link href={route('instructor.courses.index')} className="btn btn-outline-secondary btn-sm">
                        <i className="fas fa-arrow-left me-1"></i> Back to Courses
                    </Link>
                </div>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="card-body p-4">
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="form-label required fw-semibold">Course Title</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                    placeholder="e.g. Modern Fullstack Web Development with Laravel and React"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    autoFocus
                                />
                                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                            </div>

                            <div className="col-12">
                                <label className="form-label fw-semibold">SEO Meta Description</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.seo_description ? 'is-invalid' : ''}`}
                                    placeholder="Short snippet for search engine previews..."
                                    value={data.seo_description}
                                    onChange={(e) => setData('seo_description', e.target.value)}
                                />
                                {errors.seo_description && <div className="invalid-feedback">{errors.seo_description}</div>}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label required fw-semibold">Course Thumbnail</label>
                                <input
                                    type="file"
                                    className={`form-control ${errors.thumbnail ? 'is-invalid' : ''}`}
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                />
                                {errors.thumbnail && <div className="invalid-feedback">{errors.thumbnail}</div>}
                                {thumbnailPreview && (
                                    <div className="mt-2">
                                        <img
                                            src={thumbnailPreview}
                                            alt="Preview"
                                            className="img-thumbnail rounded-3"
                                            style={{ maxHeight: '130px' }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="col-md-3">
                                <label className="form-label required fw-semibold">Course Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                    placeholder="e.g. 49.99 (0 for Free)"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                />
                                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-semibold">Discounted Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className={`form-control ${errors.discount ? 'is-invalid' : ''}`}
                                    placeholder="Optional promo price"
                                    value={data.discount}
                                    onChange={(e) => setData('discount', e.target.value)}
                                />
                                {errors.discount && <div className="invalid-feedback">{errors.discount}</div>}
                            </div>

                            <div className="col-md-4">
                                <label className="form-label fw-semibold">Preview Video Provider</label>
                                <select
                                    className="form-select"
                                    value={data.demo_video_storage}
                                    onChange={(e) => setData('demo_video_storage', e.target.value)}
                                >
                                    <option value="youtube">YouTube</option>
                                    <option value="vimeo">Vimeo</option>
                                    <option value="external_link">External MP4 URL</option>
                                </select>
                            </div>

                            <div className="col-md-8">
                                <label className="form-label fw-semibold">Preview Video URL</label>
                                <input
                                    type="url"
                                    className="form-control"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    value={data.demo_video_source}
                                    onChange={(e) => setData('demo_video_source', e.target.value)}
                                />
                            </div>

                            <div className="col-12">
                                <label className="form-label required fw-semibold">Course Description</label>
                                <textarea
                                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                    rows="8"
                                    placeholder="Describe learning goals, prerequisites, and syllabus highlights..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                ></textarea>
                                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                            </div>
                        </div>
                    </div>

                    <div className="card-footer bg-white border-top py-3 text-end">
                        <button
                            type="submit"
                            className="btn btn-primary px-4"
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Saving Course...
                                </>
                            ) : (
                                <>
                                    Save & Continue to Step 2 <i className="fas fa-arrow-right ms-1"></i>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </InstructorLayout>
    );
}
