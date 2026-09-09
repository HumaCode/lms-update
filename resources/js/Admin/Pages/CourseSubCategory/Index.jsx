import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import StatusBadge from '@/Admin/Components/StatusBadge';
import { route } from '@/Utils/routes';

export default function Index({ category, subCategories = [] }) {
    const handleDelete = (subId, subName) => {
        if (confirm(`Are you sure you want to delete sub-category "${subName}"?`)) {
            router.delete(route('admin.course-sub-categories.destroy', [category.id, subId]), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout>
            <Head title={`Sub-Categories: ${category.name}`} />

            <PageHeader
                title={`Sub-Categories of "${category.name}"`}
                breadcrumbs={[
                    { label: 'Dashboard', url: route('admin.dashboard') },
                    { label: 'Course Categories', url: route('admin.course-categories.index') },
                    { label: category.name },
                    { label: 'Sub-Categories' },
                ]}
                actionText="Create Sub-Category"
                actionUrl={route('admin.course-sub-categories.create', category.id)}
                actionIcon="ti ti-plus"
            />

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">All Sub-Categories</h3>
                    <div className="card-actions">
                        <Link
                            href={route('admin.course-categories.index')}
                            className="btn btn-sm btn-outline-secondary me-2"
                        >
                            <i className="ti ti-arrow-left me-1"></i>
                            Back to Categories
                        </Link>
                        <span className="badge bg-blue text-blue-fg">
                            {subCategories.length} Sub-Categories
                        </span>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-vcenter card-table table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Icon / Image</th>
                                <th>Name</th>
                                <th>Trending</th>
                                <th>Status</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subCategories.length > 0 ? (
                                subCategories.map((sub, index) => (
                                    <tr key={sub.id}>
                                        <td className="text-secondary" style={{ width: '50px' }}>
                                            {index + 1}
                                        </td>
                                        <td style={{ width: '80px' }}>
                                            {sub.image ? (
                                                <img
                                                    src={`/${sub.image}`}
                                                    alt={sub.name}
                                                    className="avatar avatar-sm rounded"
                                                />
                                            ) : sub.icon ? (
                                                <i className={`${sub.icon} fs-2 text-muted`}></i>
                                            ) : (
                                                <span className="avatar avatar-sm bg-secondary-lt">
                                                    <i className="ti ti-folder"></i>
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="font-weight-medium">{sub.name}</div>
                                            <div className="text-secondary small">Slug: {sub.slug}</div>
                                        </td>
                                        <td>
                                            {sub.show_at_trending ? (
                                                <span className="badge bg-green text-green-fg">Yes</span>
                                            ) : (
                                                <span className="badge bg-secondary text-secondary-fg">No</span>
                                            )}
                                        </td>
                                        <td>
                                            <StatusBadge status={sub.status ? 'active' : 'inactive'} />
                                        </td>
                                        <td className="text-end">
                                            <div className="btn-list justify-content-end">
                                                <Link
                                                    href={route('admin.course-sub-categories.edit', [category.id, sub.id])}
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    <i className="ti ti-edit me-1"></i>
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(sub.id, sub.name)}
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
                                    <td colSpan="6" className="text-center py-4 text-secondary">
                                        No sub-categories found for this category.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
