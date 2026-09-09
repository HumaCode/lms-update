import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import Pagination from '@/Components/UI/Pagination';
import { route } from '@/Utils/routes';

export default function Index({ reviews }) {
    const handleStatusChange = (id, newStatus) => {
        router.put(route('admin.reviews.update', id), {
            status: newStatus,
        }, {
            preserveScroll: true,
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this review?')) {
            router.delete(route('admin.reviews.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i
                    key={i}
                    className={`ti ti-star-filled ${i <= rating ? 'text-warning' : 'text-muted opacity-25'}`}
                    style={{ fontSize: '0.85rem' }}
                ></i>
            );
        }
        return <div className="d-flex gap-1 align-items-center">{stars} <span className="ms-1 small fw-bold">({rating})</span></div>;
    };

    return (
        <AdminLayout>
            <Head title="Course Reviews" />

            <PageHeader
                title="Course Reviews"
                breadcrumbs={[
                    { label: 'Dashboard', url: route('admin.dashboard') },
                    { label: 'Course Reviews' },
                ]}
            />

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">All Course Reviews</h3>
                    <div className="card-actions">
                        <span className="badge bg-blue text-blue-fg">
                            {reviews.total || reviews.data?.length || 0} Total Reviews
                        </span>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-vcenter card-table table-hover">
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Student</th>
                                <th>Rating</th>
                                <th>Review Comment</th>
                                <th>Status</th>
                                <th style={{ width: '160px' }}>Change Status</th>
                                <th className="text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.data && reviews.data.length > 0 ? (
                                reviews.data.map((rev) => (
                                    <tr key={rev.id}>
                                        <td>
                                            <div className="font-weight-medium">
                                                {rev.course?.title || 'Unknown Course'}
                                            </div>
                                            <div className="text-secondary small">
                                                Instructor: {rev.course?.instructor?.name || 'N/A'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="font-weight-medium">{rev.user?.name || 'Unknown User'}</div>
                                            <div className="text-secondary small">{rev.user?.email || ''}</div>
                                        </td>
                                        <td>{renderStars(rev.rating)}</td>
                                        <td style={{ maxWidth: '350px' }}>
                                            <div className="text-truncate text-secondary" title={rev.review}>
                                                "{rev.review}"
                                            </div>
                                        </td>
                                        <td>
                                            {rev.status == 1 ? (
                                                <span className="badge bg-green text-green-fg">Approved</span>
                                            ) : (
                                                <span className="badge bg-warning text-warning-fg">Pending</span>
                                            )}
                                        </td>
                                        <td>
                                            <select
                                                className="form-select form-select-sm"
                                                value={rev.status}
                                                onChange={(e) => handleStatusChange(rev.id, e.target.value)}
                                            >
                                                <option value="0">Pending</option>
                                                <option value="1">Approved</option>
                                            </select>
                                        </td>
                                        <td className="text-end">
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(rev.id)}
                                                className="btn btn-sm btn-outline-danger"
                                                title="Delete Review"
                                            >
                                                <i className="ti ti-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-secondary">
                                        No reviews found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {reviews.links && (
                    <div className="card-footer d-flex align-items-center justify-content-between">
                        <Pagination links={reviews.links} />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
