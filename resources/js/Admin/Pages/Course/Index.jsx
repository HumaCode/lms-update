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
    const [selectedCourse, setSelectedCourse] = useState(null);

    const handleApprovalChange = async (courseId, newStatus) => {
        setUpdatingId(courseId);
        try {
            const res = await axios.put(route('admin.courses.update-approval', courseId), {
                status: newStatus,
            });
            notify.success(res.data.message || 'Status persetujuan kursus berhasil diperbarui.');
            router.reload({ only: ['courses'], preserveScroll: true });
        } catch (err) {
            notify.error('Gagal memperbarui status kursus.');
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

    const getImageUrl = (url, defaultImg = '/frontend/assets/images/courses_img_1.jpg') => {
        if (!url) return defaultImg;
        if (typeof url !== 'string') return defaultImg;
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        if (url.startsWith('/')) return url;
        return `/${url}`;
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
                            <table className="table card-table table-vcenter text-nowrap datatable">
                                <thead>
                                    <tr>
                                        <th>Course</th>
                                        <th>Price</th>
                                        <th>Instructor</th>
                                        <th>Status</th>
                                        <th>Approval</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.data && courses.data.length > 0 ? (
                                        courses.data.map((course) => (
                                            <tr key={course.id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src={getImageUrl(course.thumbnail)}
                                                            alt={course.title}
                                                            className="rounded me-2 border"
                                                            style={{
                                                                width: 48,
                                                                height: 32,
                                                                objectFit: 'cover',
                                                            }}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = '/frontend/assets/images/courses_img_1.jpg';
                                                            }}
                                                        />
                                                        <div className="text-truncate" style={{ maxWidth: 300 }}>
                                                            <div
                                                                className="font-weight-medium text-truncate cursor-pointer text-primary"
                                                                onClick={() => setSelectedCourse(course)}
                                                                title="View Course Details"
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                {course.title}
                                                            </div>
                                                            <div className="text-secondary small">
                                                                {course.slug}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {Number(course.price) === 0 || course.price === '0' || course.price === 0 ? (
                                                        <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 fw-bold">
                                                            Free
                                                        </span>
                                                    ) : (
                                                        <div>
                                                            <div className="font-weight-bold text-dark">
                                                                {formatCurrency(
                                                                    Number(course.discount) > 0 ? course.discount : course.price,
                                                                    settings
                                                                )}
                                                            </div>
                                                            {Number(course.discount) > 0 && Number(course.discount) < Number(course.price) && (
                                                                <small className="text-decoration-line-through text-muted d-block" style={{ fontSize: '0.75rem' }}>
                                                                    {formatCurrency(course.price, settings)}
                                                                </small>
                                                            )}
                                                        </div>
                                                    )}
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
                                                    <button
                                                        onClick={() => setSelectedCourse(course)}
                                                        className="btn btn-sm btn-icon btn-outline-info me-1"
                                                        title="View Details"
                                                    >
                                                        <i className="ti ti-eye"></i>
                                                    </button>
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

            {/* COURSE DETAIL MODAL */}
            {selectedCourse && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.65)' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content shadow-lg border-0 rounded-3">
                            <div className="modal-header border-bottom py-3 px-4 bg-white">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="avatar bg-blue-lt rounded-2">
                                        <i className="ti ti-school fs-2"></i>
                                    </div>
                                    <div>
                                        <h5 className="modal-title fw-bold text-dark mb-0">Course Details</h5>
                                        <span className="text-secondary small">Overview & Curriculum</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setSelectedCourse(null)}
                                ></button>
                            </div>

                            <div className="modal-body p-4 bg-body-tertiary">
                                {/* COURSE OVERVIEW CARD */}
                                <div className="card mb-3 border-0 shadow-sm rounded-3">
                                    <div className="card-body p-3">
                                        <div className="row g-3 align-items-center">
                                            <div className="col-md-4 col-12 text-center">
                                                <img
                                                    src={getImageUrl(selectedCourse.thumbnail)}
                                                    alt={selectedCourse.title}
                                                    className="rounded-3 shadow-sm border img-fluid w-100"
                                                    style={{ maxHeight: '140px', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/frontend/assets/images/courses_img_1.jpg';
                                                    }}
                                                />
                                            </div>
                                            <div className="col-md-8 col-12">
                                                <h4 className="fw-bold text-dark mb-1">{selectedCourse.title}</h4>
                                                <div className="text-secondary small mb-2">{selectedCourse.slug}</div>

                                                <div className="d-flex flex-wrap gap-1.5 mb-3">
                                                    <span className="badge bg-blue-lt px-2.5 py-1">
                                                        <i className="ti ti-folder me-1"></i>
                                                        {selectedCourse.category?.name || 'Uncategorized'}
                                                    </span>
                                                    <span className="badge bg-secondary-lt px-2.5 py-1">
                                                        <i className="ti ti-layer-group me-1"></i>
                                                        {selectedCourse.level?.name || selectedCourse.course_level?.name || 'All Levels'}
                                                    </span>
                                                    <span className="badge bg-secondary-lt px-2.5 py-1">
                                                        <i className="ti ti-world me-1"></i>
                                                        {selectedCourse.language?.name || selectedCourse.course_language?.name || 'English'}
                                                    </span>
                                                    {Number(selectedCourse.price) === 0 ? (
                                                        <span className="badge bg-green-lt px-2.5 py-1 fw-bold">
                                                            Free
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-green-lt px-2.5 py-1 fw-bold">
                                                            {formatCurrency(selectedCourse.discount ? selectedCourse.discount : selectedCourse.price, settings)}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="row g-2 text-secondary small bg-light p-2 rounded-2 border">
                                                    <div className="col-12 col-sm-6">
                                                        <i className="ti ti-user me-1 text-primary"></i>
                                                        <strong>Instructor:</strong> {selectedCourse.instructor?.name || '-'}
                                                    </div>
                                                    <div className="col-6 col-sm-3">
                                                        <i className="ti ti-clock me-1 text-info"></i>
                                                        <strong>Duration:</strong> {selectedCourse.duration || 0} mins
                                                    </div>
                                                    <div className="col-6 col-sm-3">
                                                        <i className="ti ti-users me-1 text-success"></i>
                                                        <strong>Capacity:</strong> {selectedCourse.capacity ? selectedCourse.capacity : 'Unlimited'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* DESCRIPTION CARD */}
                                <div className="card mb-3 border-0 shadow-sm rounded-3">
                                    <div className="card-header bg-white py-2 px-3 border-bottom d-flex align-items-center">
                                        <h5 className="card-title mb-0 fw-semibold text-dark fs-6">
                                            <i className="ti ti-file-text me-2 text-primary"></i>
                                            Description
                                        </h5>
                                    </div>
                                    <div className="card-body p-3">
                                        <style>{`
                                            .rich-preview-content h1, .rich-preview-content h2, .rich-preview-content h3 {
                                                font-size: 1.1rem !important;
                                                font-weight: 600 !important;
                                                margin-top: 0.5rem !important;
                                                margin-bottom: 0.5rem !important;
                                                color: #1e293b !important;
                                            }
                                            .rich-preview-content p {
                                                margin-bottom: 0.5rem !important;
                                            }
                                            .rich-preview-content img {
                                                max-width: 100% !important;
                                                height: auto !important;
                                                border-radius: 6px !important;
                                            }
                                        `}</style>
                                        <div
                                            className="rich-preview-content text-secondary small"
                                            style={{ maxHeight: '180px', overflowY: 'auto', wordBreak: 'break-word' }}
                                            dangerouslySetInnerHTML={{ __html: selectedCourse.description || '<em>No description provided.</em>' }}
                                        />
                                    </div>
                                </div>

                                {/* CURRICULUM BREAKDOWN CARD */}
                                <div className="card border-0 shadow-sm rounded-3">
                                    <div className="card-header bg-white py-2 px-3 border-bottom d-flex align-items-center justify-content-between">
                                        <h5 className="card-title mb-0 fw-semibold text-dark fs-6">
                                            <i className="ti ti-list-details me-2 text-primary"></i>
                                            Curriculum Breakdown
                                        </h5>
                                        <span className="badge bg-secondary-lt fw-normal">
                                            {selectedCourse.chapters?.length || 0} Chapters • {selectedCourse.chapters?.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0) || 0} Lessons
                                        </span>
                                    </div>
                                    <div className="card-body p-3">
                                        {selectedCourse.chapters && selectedCourse.chapters.length > 0 ? (
                                            <div className="accordion border rounded-2 overflow-hidden" id="adminCurriculumAccordion">
                                                {selectedCourse.chapters.map((ch, idx) => (
                                                    <div className="accordion-item border-0 border-bottom" key={ch.id || idx}>
                                                        <h2 className="accordion-header">
                                                            <button
                                                                className="accordion-button collapsed py-2 px-3 bg-light text-dark fw-semibold small"
                                                                type="button"
                                                                data-bs-toggle="collapse"
                                                                data-bs-target={`#admin-ch-${ch.id || idx}`}
                                                            >
                                                                <i className="ti ti-folder-check me-2 text-primary"></i>
                                                                Chapter {idx + 1}: {ch.title}
                                                                <span className="badge bg-white text-secondary border ms-2">
                                                                    {ch.lessons?.length || 0} Lessons
                                                                </span>
                                                            </button>
                                                        </h2>
                                                        <div id={`admin-ch-${ch.id || idx}`} className="accordion-collapse collapse">
                                                            <div className="accordion-body p-0">
                                                                <ul className="list-group list-group-flush">
                                                                    {ch.lessons && ch.lessons.length > 0 ? (
                                                                        ch.lessons.map((ls, lIdx) => (
                                                                            <li className="list-group-item d-flex justify-content-between align-items-center px-3 py-2 small" key={ls.id || lIdx}>
                                                                                <div className="d-flex align-items-center me-2 text-truncate">
                                                                                    <i className="ti ti-player-play text-muted me-2"></i>
                                                                                    <span className="text-dark fw-medium">{lIdx + 1}. {ls.title}</span>
                                                                                    {ls.is_preview === 1 && (
                                                                                        <span className="badge bg-green-lt ms-2" style={{ fontSize: '0.65rem' }}>Free Preview</span>
                                                                                    )}
                                                                                </div>
                                                                                <span className="badge bg-light text-secondary border fw-normal">{ls.duration || 0} mins</span>
                                                                            </li>
                                                                        ))
                                                                    ) : (
                                                                        <li className="list-group-item text-muted small py-2 px-3">No lessons in this chapter.</li>
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-3 bg-light rounded-2 text-center text-secondary small">No chapters or lessons created yet.</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer border-top py-2 px-4 bg-white d-flex justify-content-between">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setSelectedCourse(null)}
                                >
                                    Close
                                </button>
                                <a
                                    href={`/courses/${selectedCourse.slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-primary px-3"
                                >
                                    <i className="ti ti-external-link me-1"></i> Preview on Website
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
