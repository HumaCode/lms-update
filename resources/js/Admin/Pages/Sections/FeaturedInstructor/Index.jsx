import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import { route } from '@/Utils/routes';

export default function Index({
    instructors = [],
    featuredInstructor,
    selectedCourses = [],
    selectedInstructorCourses = [],
}) {
    const { data, setData, post, processing, errors } = useForm({
        title: featuredInstructor?.title || '',
        subtitle: featuredInstructor?.subtitle || '',
        button_text: featuredInstructor?.button_text || '',
        button_url: featuredInstructor?.button_url || '',
        instructor_id: featuredInstructor?.instructor_id || '',
        featured_courses: selectedCourses || [],
        instructor_image: null,
    });

    const [availableCourses, setAvailableCourses] = useState(selectedInstructorCourses || []);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [imagePreview, setImagePreview] = useState(
        featuredInstructor?.featured_instructor_image ||
            (featuredInstructor?.instructor_image
                ? featuredInstructor.instructor_image.startsWith('http')
                    ? featuredInstructor.instructor_image
                    : `/${featuredInstructor.instructor_image}`
                : '')
    );

    // Dynamic course loading on instructor select change
    const handleInstructorChange = (e) => {
        const id = e.target.value;
        setData((prev) => ({ ...prev, instructor_id: id, featured_courses: [] }));
        setAvailableCourses([]);

        if (id) {
            setLoadingCourses(true);
            fetch(route('admin.get-instructor-courses', id))
                .then((res) => res.json())
                .then((resData) => {
                    setAvailableCourses(resData.courses || []);
                    setLoadingCourses(false);
                })
                .catch(() => setLoadingCourses(false));
        }
    };

    const handleCourseCheckboxChange = (courseId) => {
        setData((prev) => {
            const current = prev.featured_courses || [];
            if (current.includes(courseId)) {
                return { ...prev, featured_courses: current.filter((id) => id !== courseId) };
            } else {
                return { ...prev, featured_courses: [...current, courseId] };
            }
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('instructor_image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.featured-instructor-section.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (window.toast) {
                    window.toast.success(
                        'Featured Instructor Section Berhasil Diperbarui',
                        'Data featured instructor telah disimpan.'
                    );
                }
            },
            onError: () => {
                if (window.toast) {
                    window.toast.danger(
                        'Gagal Memperbarui Featured Instructor Section',
                        'Silakan periksa kembali inputan form.'
                    );
                }
            },
        });
    };

    return (
        <AdminLayout title="Featured Instructor">
            <Head title="Featured Instructor" />
            <PageHeader title="Featured Instructor" pretitle="Sections" />

            <div className="page-body">
                <div className="container-xl">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Featured Instructor Settings</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="row g-3">
                                    {/* Title */}
                                    <div className="col-md-12">
                                        <label className="form-label">Title</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                        />
                                        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                                    </div>

                                    {/* Subtitle */}
                                    <div className="col-md-12">
                                        <label className="form-label">Subtitle</label>
                                        <textarea
                                            rows="3"
                                            className={`form-control ${errors.subtitle ? 'is-invalid' : ''}`}
                                            value={data.subtitle}
                                            onChange={(e) => setData('subtitle', e.target.value)}
                                        ></textarea>
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

                                    {/* Instructor Select */}
                                    <div className="col-md-12">
                                        <label className="form-label">Instructor</label>
                                        <select
                                            className={`form-select ${errors.instructor_id ? 'is-invalid' : ''}`}
                                            value={data.instructor_id}
                                            onChange={handleInstructorChange}
                                        >
                                            <option value="">Select Instructor</option>
                                            {instructors.map((inst) => (
                                                <option value={inst.id} key={inst.id}>
                                                    {inst.name} ({inst.email})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.instructor_id && <div className="invalid-feedback">{errors.instructor_id}</div>}
                                    </div>

                                    {/* Featured Courses Checklist */}
                                    <div className="col-md-12">
                                        <label className="form-label">Featured Courses</label>
                                        {loadingCourses ? (
                                            <div className="text-muted small">Loading courses...</div>
                                        ) : availableCourses.length > 0 ? (
                                            <div className="border rounded p-3 bg-body-tertiary">
                                                {availableCourses.map((c) => {
                                                    const isChecked = (data.featured_courses || []).includes(c.id);
                                                    return (
                                                        <div className="form-check mb-2" key={c.id}>
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`course-${c.id}`}
                                                                checked={isChecked}
                                                                onChange={() => handleCourseCheckboxChange(c.id)}
                                                            />
                                                            <label className="form-check-label ms-2" htmlFor={`course-${c.id}`}>
                                                                {c.title}
                                                            </label>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-muted small">
                                                {data.instructor_id
                                                    ? 'No courses found for this instructor.'
                                                    : 'Please select an instructor first.'}
                                            </div>
                                        )}
                                        {errors.featured_courses && <div className="text-danger small mt-1">{errors.featured_courses}</div>}
                                    </div>

                                    {/* Instructor Image */}
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
                                        <label className="form-label">Instructor Image</label>
                                        <input
                                            type="file"
                                            className={`form-control ${errors.instructor_image ? 'is-invalid' : ''}`}
                                            onChange={handleImageChange}
                                            accept="image/*"
                                        />
                                        {errors.instructor_image && <div className="invalid-feedback">{errors.instructor_image}</div>}
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
