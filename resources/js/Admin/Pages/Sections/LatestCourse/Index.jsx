import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import { route } from '@/Utils/routes';

export default function Index({ categories = [], latestCourseSection }) {
    const { data, setData, post, processing, errors } = useForm({
        category_one: latestCourseSection?.category_one || '',
        category_two: latestCourseSection?.category_two || '',
        category_three: latestCourseSection?.category_three || '',
        category_four: latestCourseSection?.category_four || '',
        category_five: latestCourseSection?.category_five || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.latest-courses-section.store'), {
            preserveScroll: true,
            onSuccess: () => {
                if (window.toast) {
                    window.toast.success('Latest Courses Section Berhasil Diperbarui', 'Pilihan kategori telah disimpan.');
                }
            },
            onError: () => {
                if (window.toast) {
                    window.toast.danger('Gagal Memperbarui Latest Courses Section', 'Silakan periksa kembali inputan form.');
                }
            },
        });
    };

    const renderCategoryOptions = () => {
        return categories.map((category) => {
            if (category.sub_categories && category.sub_categories.length > 0) {
                return (
                    <optgroup label={category.name} key={category.id}>
                        {category.sub_categories.map((sub) => (
                            <option value={sub.id} key={sub.id}>
                                {sub.name}
                            </option>
                        ))}
                    </optgroup>
                );
            }
            return (
                <option value={category.id} key={category.id}>
                    {category.name}
                </option>
            );
        });
    };

    return (
        <AdminLayout title="Latest Courses Section">
            <Head title="Latest Courses Section" />
            <PageHeader title="Latest Courses Section" pretitle="Sections" />

            <div className="page-body">
                <div className="container-xl">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Latest Course Categories</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Category One</label>
                                        <select
                                            className={`form-select ${errors.category_one ? 'is-invalid' : ''}`}
                                            value={data.category_one}
                                            onChange={(e) => setData('category_one', e.target.value)}
                                        >
                                            <option value="">Please Select</option>
                                            {renderCategoryOptions()}
                                        </select>
                                        {errors.category_one && <div className="invalid-feedback">{errors.category_one}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Category Two</label>
                                        <select
                                            className={`form-select ${errors.category_two ? 'is-invalid' : ''}`}
                                            value={data.category_two}
                                            onChange={(e) => setData('category_two', e.target.value)}
                                        >
                                            <option value="">Please Select</option>
                                            {renderCategoryOptions()}
                                        </select>
                                        {errors.category_two && <div className="invalid-feedback">{errors.category_two}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Category Three</label>
                                        <select
                                            className={`form-select ${errors.category_three ? 'is-invalid' : ''}`}
                                            value={data.category_three}
                                            onChange={(e) => setData('category_three', e.target.value)}
                                        >
                                            <option value="">Please Select</option>
                                            {renderCategoryOptions()}
                                        </select>
                                        {errors.category_three && <div className="invalid-feedback">{errors.category_three}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Category Four</label>
                                        <select
                                            className={`form-select ${errors.category_four ? 'is-invalid' : ''}`}
                                            value={data.category_four}
                                            onChange={(e) => setData('category_four', e.target.value)}
                                        >
                                            <option value="">Please Select</option>
                                            {renderCategoryOptions()}
                                        </select>
                                        {errors.category_four && <div className="invalid-feedback">{errors.category_four}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Category Five</label>
                                        <select
                                            className={`form-select ${errors.category_five ? 'is-invalid' : ''}`}
                                            value={data.category_five}
                                            onChange={(e) => setData('category_five', e.target.value)}
                                        >
                                            <option value="">Please Select</option>
                                            {renderCategoryOptions()}
                                        </select>
                                        {errors.category_five && <div className="invalid-feedback">{errors.category_five}</div>}
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
