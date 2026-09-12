import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import { route } from '@/Utils/routes';

export default function Index({ brands = [] }) {
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus brand ini?')) {
            setDeletingId(id);
            router.delete(route('admin.brand-section.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    setDeletingId(null);
                    if (window.toast) {
                        window.toast.success('Brand Berhasil Dihapus', 'Data brand telah dihapus.');
                    }
                },
                onError: () => {
                    setDeletingId(null);
                    if (window.toast) {
                        window.toast.danger('Gagal Menghapus Brand', 'Terjadi kesalahan saat menghapus data.');
                    }
                },
            });
        }
    };

    return (
        <AdminLayout title="Brand Section">
            <Head title="Brand Section" />
            <PageHeader title="Brand Section" pretitle="Sections" />

            <div className="page-body">
                <div className="container-xl">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h3 className="card-title">Brand Section</h3>
                            <Link href={route('admin.brand-section.create')} className="btn btn-primary">
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
                                        <th>URL</th>
                                        <th>STATUS</th>
                                        <th className="w-1">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {brands.length > 0 ? (
                                        brands.map((brand) => {
                                            const imgSrc = brand.brand_image || (brand.image ? (brand.image.startsWith('http') ? brand.image : `/${brand.image}`) : '/default-files/image-placeholder.png');
                                            return (
                                                <tr key={brand.id}>
                                                    <td>
                                                        <img
                                                            src={imgSrc}
                                                            alt="Brand"
                                                            style={{ height: '40px', objectFit: 'contain' }}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = '/default-files/image-placeholder.png';
                                                            }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <a href={brand.url} target="_blank" rel="noreferrer">
                                                            {brand.url}
                                                        </a>
                                                    </td>
                                                    <td>
                                                        {brand.status ? (
                                                            <span className="badge bg-success-subtle text-success">Active</span>
                                                        ) : (
                                                            <span className="badge bg-danger-subtle text-danger">Inactive</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="btn-list flex-nowrap">
                                                            <Link
                                                                href={route('admin.brand-section.edit', brand.id)}
                                                                className="btn btn-sm btn-outline-primary"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDelete(brand.id)}
                                                                disabled={deletingId === brand.id}
                                                            >
                                                                {deletingId === brand.id ? 'Deleting...' : 'Delete'}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-4 text-muted">
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
