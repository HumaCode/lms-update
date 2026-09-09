import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import StatusBadge from '@/Admin/Components/StatusBadge';
import Pagination from '@/Components/UI/Pagination';
import { route } from '@/Utils/routes';

export default function Index({ categories }) {
    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete category "${name}"?`)) {
            router.delete(route('admin.blog-categories.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Blog Categories" />

            <PageHeader
                title="Blog Categories"
                breadcrumbs={[
                    { label: 'Dashboard', url: route('admin.dashboard') },
                    { label: 'Blog Categories' },
                ]}
                actionText="Create Category"
                actionUrl={route('admin.blog-categories.create')}
                actionIcon="ti ti-plus"
            />

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">All Categories</h3>
                    <div className="card-actions">
                        <span className="badge bg-blue text-blue-fg">
                            {categories.total || categories.data?.length || 0} Total
                        </span>
                    </div>
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
        </AdminLayout>
    );
}
