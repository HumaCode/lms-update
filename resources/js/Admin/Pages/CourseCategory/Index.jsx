import React from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import Pagination from '@/Components/UI/Pagination';
import StatusBadge from '@/Admin/Components/StatusBadge';
import { route } from '@/Utils/routes';

export default function Index({ categories }) {
    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete category "${name}"?`)) {
            router.delete(route('admin.course-categories.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout title="Course Categories">
            <PageHeader
                title="Course Categories"
                pretitle="Course Management"
                actions={
                    <Link
                        href={route('admin.course-categories.create')}
                        className="btn btn-primary"
                    >
                        <i className="ti ti-plus me-1"></i> Add Category
                    </Link>
                }
            />

            <div className="page-body">
                <div className="container-xl">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h3 className="card-title">All Categories</h3>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-vcenter card-table table-striped">
                                <thead>
                                    <tr>
                                        <th style={{ width: 80 }}>Icon</th>
                                        <th>Name</th>
                                        <th>Trending</th>
                                        <th>Status</th>
                                        <th className="w-1 text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.data && categories.data.length > 0 ? (
                                        categories.data.map((cat) => (
                                            <tr key={cat.id}>
                                                <td>
                                                    {cat.image ? (
                                                        <img
                                                            src={cat.image}
                                                            alt=""
                                                            style={{
                                                                width: 44,
                                                                height: 44,
                                                                objectFit: 'cover',
                                                                borderRadius: 6,
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="avatar avatar-sm bg-secondary-lt">
                                                            <i className="ti ti-folder"></i>
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="font-weight-medium">
                                                    {cat.name}
                                                </td>
                                                <td>
                                                    <span className={`badge ${cat.show_at_trending ? 'bg-success' : 'bg-secondary'} text-white`}>
                                                        {cat.show_at_trending ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <StatusBadge status={cat.status ? 'active' : 'inactive'} />
                                                </td>
                                                <td className="text-end text-nowrap">
                                                    <Link
                                                        href={route('admin.course-sub-categories.index', cat.id)}
                                                        className="btn btn-sm btn-icon btn-outline-warning me-1"
                                                        title="Sub Categories"
                                                    >
                                                        <i className="ti ti-list"></i>
                                                    </Link>
                                                    <Link
                                                        href={route('admin.course-categories.edit', cat.id)}
                                                        className="btn btn-sm btn-icon btn-outline-primary me-1"
                                                        title="Edit Category"
                                                    >
                                                        <i className="ti ti-edit"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(cat.id, cat.name)}
                                                        className="btn btn-sm btn-icon btn-outline-danger"
                                                        title="Delete Category"
                                                    >
                                                        <i className="ti ti-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted py-4">
                                                No categories found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="card-footer">
                            <Pagination links={categories.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
