import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import Pagination from '@/Components/UI/Pagination';
import { route } from '@/Utils/routes';

export default function Index({ levels }) {
    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete level "${name}"?`)) {
            router.delete(route('admin.course-levels.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Course Levels" />

            <PageHeader
                title="Course Levels"
                breadcrumbs={[
                    { label: 'Dashboard', url: route('admin.dashboard') },
                    { label: 'Course Levels' },
                ]}
                actionText="Create Level"
                actionUrl={route('admin.course-levels.create')}
                actionIcon="ti ti-plus"
            />

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">All Course Levels</h3>
                    <div className="card-actions">
                        <span className="badge bg-blue text-blue-fg">
                            {levels.total || levels.data?.length || 0} Total
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
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {levels.data && levels.data.length > 0 ? (
                                levels.data.map((lvl, index) => (
                                    <tr key={lvl.id}>
                                        <td className="text-secondary" style={{ width: '60px' }}>
                                            {(levels.current_page - 1) * levels.per_page + index + 1}
                                        </td>
                                        <td className="font-weight-medium">
                                            {lvl.name}
                                        </td>
                                        <td className="text-secondary">
                                            <code>{lvl.slug}</code>
                                        </td>
                                        <td className="text-end">
                                            <div className="btn-list justify-content-end">
                                                <Link
                                                    href={route('admin.course-levels.edit', lvl.id)}
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    <i className="ti ti-edit me-1"></i>
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(lvl.id, lvl.name)}
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
                                    <td colSpan="4" className="text-center py-4 text-secondary">
                                        No course levels found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {levels.links && (
                    <div className="card-footer d-flex align-items-center justify-content-between">
                        <Pagination links={levels.links} />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
