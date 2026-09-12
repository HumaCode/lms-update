import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import { route } from '@/Utils/routes';

export default function Index({ counter }) {
    const { data, setData, post, processing, errors } = useForm({
        counter_one: counter?.counter_one || '',
        title_one: counter?.title_one || '',
        counter_two: counter?.counter_two || '',
        title_two: counter?.title_two || '',
        counter_three: counter?.counter_three || '',
        title_three: counter?.title_three || '',
        counter_four: counter?.counter_four || '',
        title_four: counter?.title_four || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.counter-section.store'), {
            onSuccess: () => {
                if (window.toast) {
                    window.toast.success('Counter Section Berhasil Diperbarui', 'Data counter section telah disimpan ke database.');
                }
            },
            onError: () => {
                if (window.toast) {
                    window.toast.danger('Gagal Memperbarui Counter Section', 'Silakan periksa kembali kelengkapan form input.');
                }
            },
        });
    };

    return (
        <AdminLayout title="Counter Section">
            <Head title="Counter Section" />
            <PageHeader title="Counter Section" pretitle="Sections" />

            <div className="page-body">
                <div className="container-xl">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Counter Section Settings</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    {/* Item 1 */}
                                    <div className="col-md-6">
                                        <label className="form-label">Counter One</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.counter_one ? 'is-invalid' : ''}`}
                                            value={data.counter_one}
                                            onChange={(e) => setData('counter_one', e.target.value)}
                                        />
                                        {errors.counter_one && <div className="invalid-feedback">{errors.counter_one}</div>}
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

                                    {/* Item 2 */}
                                    <div className="col-md-6">
                                        <label className="form-label">Counter Two</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.counter_two ? 'is-invalid' : ''}`}
                                            value={data.counter_two}
                                            onChange={(e) => setData('counter_two', e.target.value)}
                                        />
                                        {errors.counter_two && <div className="invalid-feedback">{errors.counter_two}</div>}
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

                                    {/* Item 3 */}
                                    <div className="col-md-6">
                                        <label className="form-label">Counter Three</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.counter_three ? 'is-invalid' : ''}`}
                                            value={data.counter_three}
                                            onChange={(e) => setData('counter_three', e.target.value)}
                                        />
                                        {errors.counter_three && <div className="invalid-feedback">{errors.counter_three}</div>}
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

                                    {/* Item 4 */}
                                    <div className="col-md-6">
                                        <label className="form-label">Counter Four</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.counter_four ? 'is-invalid' : ''}`}
                                            value={data.counter_four}
                                            onChange={(e) => setData('counter_four', e.target.value)}
                                        />
                                        {errors.counter_four && <div className="invalid-feedback">{errors.counter_four}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Title Four</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.title_four ? 'is-invalid' : ''}`}
                                            value={data.title_four}
                                            onChange={(e) => setData('title_four', e.target.value)}
                                        />
                                        {errors.title_four && <div className="invalid-feedback">{errors.title_four}</div>}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="col-12 mt-4">
                                        <button className="btn btn-primary" type="submit" disabled={processing}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon me-2" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
                                                <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                                                <path d="M14 4l0 4l-6 0l0 -4" />
                                            </svg>
                                            {processing ? 'Saving...' : 'Update'}
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
