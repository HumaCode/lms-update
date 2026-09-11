import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import InstructorLayout from '@/Instructor/Layouts/InstructorLayout';
import RichTextEditor from '@/Components/RichTextEditor';
import { route } from '@/Utils/routes';
import { notify } from '@/Utils/notifications';
import { formatPriceInput, parseRawPrice } from '@/Utils/formatters';

const slugify = (text) => {
    return (text || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s-]+/g, '-');
};

export default function Create() {
    const { props } = usePage();
    const settings = props?.settings || {};
    const currencyIcon = settings?.currency_icon || '$';
    const isRupiah = (settings?.default_currency || '').toUpperCase() === 'IDR' || currencyIcon.toLowerCase() === 'rp';
    const pricePlaceholder = isRupiah ? 'e.g. 150000' : 'e.g. 49.99';

    const [slugEdited, setSlugEdited] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        slug: '',
        seo_description: '',
        thumbnail: null,
        demo_video_storage: 'youtube',
        demo_video_source: '',
        price: '',
        discount: '',
        features: '',
        description: '',
    });

    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [isFree, setIsFree] = useState(false);

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
            onSuccess: () => {
                notify.success('Course Created Successfully', 'Basic course information has been saved.');
            },
            onError: () => {
                notify.error('Validation Error', 'Please check the form fields and try again.');
            },
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
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setData((prev) => ({
                                            ...prev,
                                            title: val,
                                            slug: slugify(val),
                                        }));
                                    }}
                                    autoFocus
                                />
                                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                            </div>

                            <div className="col-12">
                                <label className="form-label fw-semibold">
                                    Course URL Slug <span className="text-muted fw-normal small">(Auto-generated from title)</span>
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light text-muted small">/courses/</span>
                                    <input
                                        type="text"
                                        className={`form-control bg-light ${errors.slug ? 'is-invalid' : ''}`}
                                        placeholder="Auto-generated slug..."
                                        value={data.slug}
                                        disabled
                                        readOnly
                                    />
                                    {errors.slug && <div className="invalid-feedback">{errors.slug}</div>}
                                </div>
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
                                    <div className="mt-3">
                                        <span className="form-label text-muted small fw-semibold d-block mb-1">
                                            Thumbnail Preview:
                                        </span>
                                        <div
                                            className="border rounded-3 p-2 bg-light d-inline-block text-center shadow-sm"
                                            style={{ maxWidth: '320px', width: '100%' }}
                                        >
                                            <img
                                                src={thumbnailPreview}
                                                alt="Course Thumbnail Preview"
                                                className="rounded-2 img-fluid"
                                                style={{
                                                    maxHeight: '180px',
                                                    width: '100%',
                                                    objectFit: 'contain',
                                                    backgroundColor: '#ffffff',
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="col-12">
                                <div className="card bg-light border-0 p-3 rounded-3">
                                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                        <div>
                                            <h6 className="fw-bold mb-1 text-dark">Course Pricing Option</h6>
                                            <p className="text-muted small mb-0">
                                                {isFree
                                                    ? 'This course will be free for all students.'
                                                    : 'This is a paid course. Set your regular and promo prices below.'}
                                            </p>
                                        </div>
                                        <div className="form-check form-switch form-switch-md mb-0">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                role="switch"
                                                id="freeCourseSwitch"
                                                checked={isFree}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setIsFree(checked);
                                                    if (checked) {
                                                        setData((prev) => ({ ...prev, price: '0', discount: '0' }));
                                                    } else {
                                                        setData((prev) => ({
                                                            ...prev,
                                                            price: prev.price === '0' ? '' : prev.price,
                                                            discount: prev.discount === '0' ? '' : prev.discount,
                                                        }));
                                                    }
                                                }}
                                                style={{ cursor: 'pointer', width: '2.5em', height: '1.25em' }}
                                            />
                                            <label className="form-check-label fw-bold ms-2 cursor-pointer" htmlFor="freeCourseSwitch">
                                                {isFree ? (
                                                    <span className="badge bg-success px-2 py-1">Free Course</span>
                                                ) : (
                                                    <span className="badge bg-primary px-2 py-1">Paid Course</span>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {!isFree && (
                                <>
                                    <div className="col-md-6">
                                        <label className="form-label required fw-semibold">Price / Harga Normal ({currencyIcon})</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                            placeholder={pricePlaceholder}
                                            value={formatPriceInput(data.price, isRupiah)}
                                            onChange={(e) => setData('price', parseRawPrice(e.target.value, isRupiah))}
                                        />
                                        {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Discount Amount / Potongan Diskon ({currencyIcon})</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.discount ? 'is-invalid' : ''}`}
                                            placeholder="Contoh: 20.000"
                                            value={formatPriceInput(data.discount, isRupiah)}
                                            onChange={(e) => setData('discount', parseRawPrice(e.target.value, isRupiah))}
                                        />
                                        <div className="form-text text-muted small">
                                            Kosongkan jika tidak ada diskon. Contoh: Harga 200.000 & Diskon 20.000 = Harga akhir Rp 180.000.
                                        </div>
                                        {errors.discount && <div className="invalid-feedback">{errors.discount}</div>}
                                    </div>
                                </>
                            )}

                            <div className="col-md-4">
                                <label className="form-label fw-semibold">Preview Video Provider</label>
                                <select
                                    className="form-select"
                                    value={data.demo_video_storage || 'youtube'}
                                    onChange={(e) => {
                                        const storage = e.target.value;
                                        setData((prev) => ({
                                            ...prev,
                                            demo_video_storage: storage,
                                            demo_video_source: '',
                                        }));
                                    }}
                                >
                                    <option value="youtube">YouTube (URL)</option>
                                    <option value="vimeo">Vimeo (URL)</option>
                                    <option value="external_link">External MP4 URL</option>
                                    <option value="upload">Upload Video File</option>
                                </select>
                            </div>

                            <div className="col-md-8">
                                {data.demo_video_storage === 'upload' ? (
                                    <>
                                        <label className="form-label fw-semibold">Upload Preview Video File</label>
                                        <input
                                            key="create-video-file-input"
                                            type="file"
                                            className={`form-control ${errors.demo_video_source ? 'is-invalid' : ''}`}
                                            accept="video/mp4,video/webm,video/ogg,video/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setData('demo_video_source', file);
                                                }
                                            }}
                                        />
                                        <span className="text-muted small">Select a video file (MP4, WEBM, MKV)</span>
                                        {errors.demo_video_source && (
                                            <div className="invalid-feedback">{errors.demo_video_source}</div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <label className="form-label fw-semibold">
                                            Preview Video URL (
                                            {data.demo_video_storage === 'vimeo'
                                                ? 'Vimeo'
                                                : data.demo_video_storage === 'external_link'
                                                ? 'External MP4'
                                                : 'YouTube'}
                                            )
                                        </label>
                                        <input
                                            key="create-video-url-input"
                                            type="text"
                                            className={`form-control ${errors.demo_video_source ? 'is-invalid' : ''}`}
                                            placeholder={
                                                data.demo_video_storage === 'vimeo'
                                                    ? 'https://vimeo.com/123456789'
                                                    : data.demo_video_storage === 'external_link'
                                                    ? 'https://example.com/video.mp4'
                                                    : 'https://www.youtube.com/watch?v=...'
                                            }
                                            value={typeof data.demo_video_source === 'string' ? data.demo_video_source : ''}
                                            onChange={(e) => setData('demo_video_source', e.target.value)}
                                        />
                                        {errors.demo_video_source && (
                                            <div className="invalid-feedback">{errors.demo_video_source}</div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="col-12">
                                <label className="form-label fw-semibold">Course Features</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.features ? 'is-invalid' : ''}`}
                                    placeholder="e.g. Available on iOS and Android, Lifetime Access, Certificate included"
                                    value={data.features}
                                    onChange={(e) => setData('features', e.target.value)}
                                />
                                <div className="form-text text-muted small">
                                    Singkat dan padat. Fitur ini akan ditampilkan pada halaman detail kursus (misal: "Available on iOS and Android").
                                </div>
                                {errors.features && <div className="invalid-feedback">{errors.features}</div>}
                            </div>

                            <div className="col-12">
                                <label className="form-label required fw-semibold">Course Description</label>
                                <RichTextEditor
                                    value={data.description}
                                    onChange={(val) => setData('description', val)}
                                    placeholder="Describe learning goals, prerequisites, and syllabus highlights..."
                                />
                                {errors.description && <div className="invalid-feedback d-block">{errors.description}</div>}
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
                                    <i className="fas fa-spinner fa-spin me-2 text-white"></i>
                                    Sedang Menyimpan...
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
