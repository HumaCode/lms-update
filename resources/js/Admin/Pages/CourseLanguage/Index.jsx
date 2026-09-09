import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import Pagination from '@/Components/UI/Pagination';
import { route } from '@/Utils/routes';

export default function Index({ languages }) {
    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete language "${name}"?`)) {
            router.delete(route('admin.course-languages.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Course Languages" />

            <PageHeader
                title="Course Languages"
                breadcrumbs={[
                    { label: 'Dashboard', url: route('admin.dashboard') },
                    { label: 'Course Languages' },
                ]}
                actionText="Create Language"
                actionUrl={route('admin.course-languages.create')}
                actionIcon="ti ti-plus"
            />

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">All Course Languages</h3>
                    <div className="card-actions">
                        <span className="badge bg-blue text-blue-fg">
                            {languages.total || languages.data?.length || 0} Total
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
                            {languages.data && languages.data.length > 0 ? (
                                languages.data.map((lang, index) => (
                                    <tr key={lang.id}>
                                        <td className="text-secondary" style={{ width: '60px' }}>
                                            {(languages.current_page - 1) * languages.per_page + index + 1}
                                        </td>
                                        <td className="font-weight-medium">
                                            {lang.name}
                                        </td>
                                        <td className="text-secondary">
                                            <code>{lang.slug}</code>
                                        </td>
                                        <td className="text-end">
                                            <div className="btn-list justify-content-end">
                                                <Link
                                                    href={route('admin.course-languages.edit', lang.id)}
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    <i className="ti ti-edit me-1"></i>
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(lang.id, lang.name)}
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
                                        No course languages found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {languages.links && (
                    <div className="card-footer d-flex align-items-center justify-content-between">
                        <Pagination links={languages.links} />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
