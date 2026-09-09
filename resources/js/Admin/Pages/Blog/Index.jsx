import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import StatusBadge from '@/Admin/Components/StatusBadge';
import Pagination from '@/Components/UI/Pagination';
import { formatDate } from '@/Utils/formatters';
import { route } from '@/Utils/routes';

export default function Index({ blogs }) {
    const handleDelete = (id, title) => {
        if (confirm(`Are you sure you want to delete blog post "${title}"?`)) {
            router.delete(route('admin.blogs.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Blogs" />

            <PageHeader
                title="Blog Posts"
                breadcrumbs={[
                    { label: 'Dashboard', url: route('admin.dashboard') },
                    { label: 'Blogs' },
                ]}
                actionText="Write Blog Post"
                actionUrl={route('admin.blogs.create')}
                actionIcon="ti ti-plus"
            />

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">All Blog Articles</h3>
                    <div className="card-actions">
                        <span className="badge bg-blue text-blue-fg">
                            {blogs.total || blogs.data?.length || 0} Posts
                        </span>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-vcenter card-table table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Thumbnail</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.data && blogs.data.length > 0 ? (
                                blogs.data.map((blog, index) => (
                                    <tr key={blog.id}>
                                        <td className="text-secondary" style={{ width: '50px' }}>
                                            {(blogs.current_page - 1) * blogs.per_page + index + 1}
                                        </td>
                                        <td style={{ width: '80px' }}>
                                            {blog.image ? (
                                                <img
                                                    src={`/${blog.image}`}
                                                    alt={blog.title}
                                                    className="avatar avatar-md rounded"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <span className="avatar avatar-md bg-secondary-lt">
                                                    <i className="ti ti-news"></i>
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="font-weight-medium">{blog.title}</div>
                                            <div className="text-secondary small">Slug: {blog.slug}</div>
                                        </td>
                                        <td>
                                            <span className="badge bg-purple-lt">
                                                {blog.category?.name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td>
                                            <StatusBadge status={blog.status ? 'active' : 'inactive'} />
                                        </td>
                                        <td className="text-secondary small">
                                            {formatDate(blog.created_at)}
                                        </td>
                                        <td className="text-end">
                                            <div className="btn-list justify-content-end">
                                                <Link
                                                    href={route('admin.blogs.edit', blog.id)}
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    <i className="ti ti-edit me-1"></i>
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(blog.id, blog.title)}
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
                                    <td colSpan="7" className="text-center py-4 text-secondary">
                                        No blog posts found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {blogs.links && (
                    <div className="card-footer d-flex align-items-center justify-content-between">
                        <Pagination links={blogs.links} />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
