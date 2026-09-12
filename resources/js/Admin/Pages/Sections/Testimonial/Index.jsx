import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import { route } from '@/Utils/routes';

export default function Index({ testimonials = [] }) {
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus testimonial ini?')) {
            setDeletingId(id);
            router.delete(route('admin.testimonial-section.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    setDeletingId(null);
                    if (window.toast) {
                        window.toast.success('Testimonial Berhasil Dihapus', 'Data testimonial telah dihapus.');
                    }
                },
                onError: () => {
                    setDeletingId(null);
                    if (window.toast) {
                        window.toast.danger('Gagal Menghapus Testimonial', 'Terjadi kesalahan saat menghapus data.');
                    }
                },
            });
        }
    };

    return (
        <AdminLayout title="Testimonials">
            <Head title="Testimonials" />
            <PageHeader title="Testimonials" pretitle="Sections" />

            <div className="page-body">
                <div className="container-xl">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h3 className="card-title">Testimonials</h3>
                            <Link href={route('admin.testimonial-section.create')} className="btn btn-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon me-2" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 5l0 14" />
                                    <path d="M5 12l14 0" />
                                </svg>
                                Add new
                            </Link>
                        </div>
                        <div className="card-table table-responsive">
                            <table className="table table-vcenter card-table">
                                <thead>
                                    <tr>
                                        <th>IMAGE</th>
                                        <th>NAME</th>
                                        <th>TITLE</th>
                                        <th>RATING</th>
                                        <th>REVIEW</th>
                                        <th className="w-1">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {testimonials.length > 0 ? (
                                        testimonials.map((item) => {
                                            const imgSrc = item.testimonial_user_image || (item.user_image ? (item.user_image.startsWith('http') ? item.user_image : `/${item.user_image}`) : '/default-files/image-placeholder.png');
                                            return (
                                                <tr key={item.id}>
                                                    <td>
                                                        <img
                                                            src={imgSrc}
                                                            alt={item.user_name}
                                                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = '/default-files/image-placeholder.png';
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="font-weight-medium">{item.user_name}</td>
                                                    <td className="text-muted">{item.user_title}</td>
                                                    <td>
                                                        <span className="badge bg-warning-subtle text-warning">
                                                            ★ {item.rating}
                                                        </span>
                                                    </td>
                                                    <td className="text-muted" style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {item.review}
                                                    </td>
                                                    <td>
                                                        <div className="btn-list flex-nowrap">
                                                            <Link
                                                                href={route('admin.testimonial-section.edit', item.id)}
                                                                className="btn btn-sm btn-outline-primary"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDelete(item.id)}
                                                                disabled={deletingId === item.id}
                                                            >
                                                                {deletingId === item.id ? 'Deleting...' : 'Delete'}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4 text-muted">
                                                No Data Found!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
