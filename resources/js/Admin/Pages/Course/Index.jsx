import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import Pagination from '@/Components/UI/Pagination';
import StatusBadge from '@/Admin/Components/StatusBadge';
import { formatCurrency } from '@/Utils/formatters';
import { route } from '@/Utils/routes';
import { notify } from '@/Utils/notifications';
import axios from 'axios';

export default function Index({ courses }) {
    const { props } = usePage();
    const settings = props?.settings || {};

    const [updatingId, setUpdatingId] = useState(null);

    const handleApprovalChange = async (courseId, newStatus) => {
        setUpdatingId(courseId);
        try {
            const res = await axios.post(route('admin.courses.update-approval', courseId), {
                status: newStatus,
            });
            notify.success(res.data.message || 'Course status updated successfully!');
            router.reload({ only: ['courses'], preserveScroll: true });
        } catch (err) {
            notify.error('Failed to update course status.');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = (id, title) => {
        if (confirm(`Are you sure you want to delete course "${title}"?`)) {
            router.delete(route('admin.courses.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout title="Courses Management">
            <PageHeader
                title="Courses"
                pretitle="Course Management"
                actions={
                    <Link
                        href={route('admin.courses.create')}
                        className="btn btn-primary"
                    >
                        <i className="ti ti-plus me-1"></i> Add Course
                    </Link>
                }
            />

            <div className="page-body">
                <div className="container-xl">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h3 className="card-title">All Courses</h3>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-vcenter card-table table-striped">
                                <thead>
                                    <tr>
                                        <th>Course</th>
                                        <th>Price</th>
                                        <th>Instructor</th>
                                        <th>Status</th>
                                        <th>Approval</th>
                                        <th className="w-1 text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.data && courses.data.length > 0 ? (
                                        courses.data.map((course) => (
                                            <tr key={course.id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        {course.thumbnail && (
                                                            <img
                                                                src={course.thumbnail}
                                                                alt=""
                                                                className="rounded me-2"
                                                                style={{
                                                                    width: 48,
                                                                    height: 32,
                                                                    objectFit: 'cover',
                                                                }}
                                                            />
                                                        )}
                                                        <div className="text-truncate" style={{ maxWidth: 300 }}>
                                                            <div className="font-weight-medium text-truncate">
                                                                {course.title}
                                                            </div>
                                                            <div className="text-secondary small">
                                                                {course.slug}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="font-weight-bold">
                                                    {formatCurrency(course.price, settings)}
                                                </td>
                                                <td>
                                                    <div className="font-weight-medium">
                                                        {course.instructor?.name || '-'}
                                                    </div>
                                                    <div className="text-secondary small">
                                                        {course.instructor?.email || ''}
                                                    </div>
                                                </td>
                                                <td>
                                                    <StatusBadge status={course.status} />
                                                </td>
                                                <td>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        style={{ width: 130 }}
                                                        value={course.is_approved}
                                                        disabled={updatingId === course.id}
                                                        onChange={(e) =>
                                                            handleApprovalChange(course.id, e.target.value)
                                                        }
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="approved">Approved</option>
                                                        <option value="rejected">Rejected</option>
                                                    </select>
                                                </td>
                                                <td className="text-end text-nowrap">
                                                    <Link
                                                        href={route('admin.courses.edit', { id: course.id, step: 1 })}
                                                        className="btn btn-sm btn-icon btn-outline-primary me-1"
                                                        title="Edit Course"
                                                    >
                                                        <i className="ti ti-edit"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(course.id, course.title)}
                                                        className="btn btn-sm btn-icon btn-outline-danger"
                                                        title="Delete Course"
                                                    >
                                                        <i className="ti ti-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center text-muted py-4">
                                                No courses found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="card-footer">
                            <Pagination links={courses.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
