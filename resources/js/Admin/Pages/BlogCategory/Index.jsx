import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import StatusBadge from '@/Admin/Components/StatusBadge';
import Pagination from '@/Components/UI/Pagination';
import { route } from '@/Utils/routes';

export default function Index({ categories }) {
    const handleDelete = (id, name) => {
        if (confirm(`Apakah Anda yakin ingin menghapus kategori "${name}"?`)) {
            router.delete(route('admin.blog-categories.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    if (window.toast) {
                        window.toast.success('Kategori Blog Berhasil Dihapus', 'Data kategori blog telah dihapus.');
                    }
                },
                onError: () => {
                    if (window.toast) {
                        window.toast.danger('Gagal Menghapus Kategori Blog', 'Terjadi kesalahan saat menghapus data.');
                    }
                },
            });
        }
    };

    return (
        <AdminLayout title="Blog Categories">
            <Head title="Blog Categories" />
            <PageHeader title="Blog Categories" pretitle="Content Management" />

            <div className="page-body">
                <div className="container-xl">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h3 className="card-title">All Categories</h3>
                            <Link href={route('admin.blog-categories.create')} className="btn btn-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon me-2" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 5l0 14" />
                                    <path d="M5 12l14 0" />
                                </svg>
                                Create Category
                            </Link>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-vcenter card-table table-hover">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Slug</th>
                                        <th>Status</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.data && categories.data.length > 0 ? (
                                        categories.data.map((cat, index) => (
                                            <tr key={cat.id}>
                                                <td className="text-secondary" style={{ width: '50px' }}>
                                                    {(categories.current_page - 1) * categories.per_page + index + 1}
                                                </td>
                                                <td className="font-weight-medium">{cat.name}</td>
                                                <td className="text-secondary">
                                                    <code>{cat.slug}</code>
                                                </td>
                                                <td>
                                                    <StatusBadge status={cat.status ? 'active' : 'inactive'} />
                                                </td>
                                                <td className="text-end">
                                                    <div className="btn-list justify-content-end">
                                                        <Link
                                                            href={route('admin.blog-categories.edit', cat.id)}
                                                            className="btn btn-sm btn-outline-primary"
                                                        >
                                                            <i className="ti ti-edit me-1"></i>
                                                            Edit
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(cat.id, cat.name)}
                                                            className="btn btn-sm btn-outline-danger"
                                                        >
                                                            <i className="ti ti-trash me-1"></i>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4 text-secondary">
                                                No blog categories found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {categories.links && (
                            <div className="card-footer d-flex align-items-center justify-content-between">
                                <Pagination links={categories.links} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
