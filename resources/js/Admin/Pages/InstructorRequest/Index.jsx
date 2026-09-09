import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import StatusBadge from '@/Admin/Components/StatusBadge';
import { route } from '@/Utils/routes';

export default function Index({ instructorsRequests = [] }) {
    const handleStatusChange = (userId, newStatus) => {
        router.put(route('admin.instructor-requests.update', userId), {
            status: newStatus,
        }, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Instructor Requests" />

            <PageHeader
                title="Instructor Requests"
                breadcrumbs={[
                    { label: 'Dashboard', url: route('admin.dashboard') },
                    { label: 'Instructor Requests' },
                ]}
            />

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Pending & Rejected Instructor Applications</h3>
                    <div className="card-actions">
                        <span className="badge bg-blue text-blue-fg">
                            {instructorsRequests.length} Requests
                        </span>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-vcenter card-table table-hover">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Document</th>
                                <th style={{ width: '200px' }}>Change Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {instructorsRequests.length > 0 ? (
                                instructorsRequests.map((instructor) => (
                                    <tr key={instructor.id}>
                                        <td>
                                            <div className="font-weight-medium">{instructor.name}</div>
                                            <div className="text-secondary small">ID: #{instructor.id}</div>
                                        </td>
                                        <td className="text-secondary">
                                            {instructor.email}
                                        </td>
                                        <td>
                                            <StatusBadge status={instructor.approve_status} />
                                        </td>
                                        <td>
                                            {instructor.document ? (
                                                <a
                                                    href={route('admin.instructor-doc-download', instructor.id)}
                                                    className="btn btn-sm btn-outline-secondary"
                                                    title="Download Document"
                                                >
                                                    <i className="ti ti-download me-1"></i>
                                                    Download
                                                </a>
                                            ) : (
                                                <span className="text-secondary small">No doc</span>
                                            )}
                                        </td>
                                        <td>
                                            <select
                                                className="form-select form-select-sm"
                                                value={instructor.approve_status}
                                                onChange={(e) => handleStatusChange(instructor.id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approve</option>
                                                <option value="rejected">Reject</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-secondary">
                                        No pending or rejected instructor requests.
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
