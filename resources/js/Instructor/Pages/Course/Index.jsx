import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import InstructorLayout from '@/Instructor/Layouts/InstructorLayout';
import Pagination from '@/Components/UI/Pagination';
import InstructorQnaModal from '@/Components/InstructorQnaModal';
import InstructorReviewsModal from '@/Components/InstructorReviewsModal';
import { formatCurrency } from '@/Utils/formatters';
import { route } from '@/Utils/routes';

export default function Index({ courses }) {
    const { props } = usePage();
    const settings = props?.settings || {};
    const [selectedQnaCourse, setSelectedQnaCourse] = useState(null);
    const [showQnaModal, setShowQnaModal] = useState(false);

    const [selectedReviewCourse, setSelectedReviewCourse] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const courseList = Array.isArray(courses) ? courses : (courses?.data || []);
    const meta = courses?.meta;

    const renderStars = (rating) => {
        const rounded = Math.round(rating || 0);
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i
                    key={i}
                    className={`fas fa-star ${i <= rounded ? 'text-warning' : 'text-muted opacity-25'}`}
                    style={{ fontSize: '0.8rem' }}
                ></i>
            );
        }
        return <div className="d-flex gap-1 align-items-center">{stars}</div>;
    };

    const getImageUrl = (url, defaultImg = '/frontend/assets/images/courses_img_1.jpg') => {
        if (!url) return defaultImg;
        if (typeof url !== 'string') return defaultImg;
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        if (url.startsWith('/')) return url;
        return `/${url}`;
    };

    return (
        <InstructorLayout
            title="My Courses"
            crumbs={[{ label: 'Courses' }]}
        >
            <Head title="Instructor Courses" />

            <div className="card border-0 shadow-sm rounded-3">
                <div className="card-header bg-white border-bottom py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
                    <div>
                        <h5 className="fw-bold mb-0 text-dark">Your Course Curriculum</h5>
                        <p className="text-muted small mb-0">Manage published courses, review feedback and update content</p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        {meta && (
                            <span className="badge bg-light text-secondary border px-3 py-2">
                                Total: {meta.total} Courses
                            </span>
                        )}
                        <Link
                            href={route('instructor.courses.create')}
                            className="btn btn-primary px-3"
                        >
                            <i className="fas fa-plus me-1"></i> Create Course
                        </Link>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '90px' }}>Thumbnail</th>
                                <th>Course Details</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Rating</th>
                                <th>Status</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseList.length > 0 ? (
                                courseList.map((course) => (
                                    <tr key={course.id}>
                                        <td style={{ width: '90px' }}>
                                            <img
                                                src={getImageUrl(course.thumbnail)}
                                                alt={course.title}
                                                className="rounded-2 shadow-sm border"
                                                style={{ width: '80px', height: '52px', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/frontend/assets/images/courses_img_1.jpg';
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <div className="fw-bold text-dark">{course.title}</div>
                                            <div className="text-muted small mt-1">
                                                {course.lessons_count || 0} Lessons · {course.enrollments_count || 0} Students
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge bg-light text-dark border">
                                                {course.category?.name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td>
                                            {course.price > 0 ? (
                                                <span className="fw-semibold text-dark">
                                                    {formatCurrency(course.discount_price || course.price, settings)}
                                                </span>
                                            ) : (
                                                <span className="badge bg-success">Free</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column gap-1">
                                                {renderStars(course.reviews_avg_rating)}
                                                <span className="text-muted small">
                                                    {course.reviews_avg_rating ? Number(course.reviews_avg_rating).toFixed(1) : '0.0'} ({course.reviews_count || 0})
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${course.status === 'active' ? 'bg-primary' : 'bg-secondary'}`}>
                                                {course.status}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex align-items-center justify-content-end gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-warning btn-sm px-3 d-inline-flex align-items-center"
                                                    title="Lihat Detail Review & Rating"
                                                    onClick={() => {
                                                        setSelectedReviewCourse(course);
                                                        setShowReviewModal(true);
                                                    }}
                                                    style={{ borderColor: '#c25e00', color: '#c25e00' }}
                                                >
                                                    <i className="fas fa-star me-1"></i> Review
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-purple btn-sm px-3 d-inline-flex align-items-center"
                                                    title="Lihat Q&A / Manajemen Diskusi"
                                                    onClick={() => {
                                                        setSelectedQnaCourse(course);
                                                        setShowQnaModal(true);
                                                    }}
                                                    style={{ borderColor: '#6f42c1', color: '#6f42c1' }}
                                                >
                                                    <i className="far fa-comments me-1"></i> Q&A
                                                </button>
                                                <Link
                                                    href={route('instructor.courses.edit', { id: course.id, step: 1 })}
                                                    className="btn btn-outline-primary btn-sm px-3"
                                                >
                                                    <i className="fas fa-edit me-1"></i> Manage
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">
                                        <i className="fas fa-graduation-cap fs-1 d-block mb-2 opacity-50"></i>
                                        You haven't created any courses yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {meta && meta.last_page > 1 && (
                    <div className="card-footer bg-white border-top py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
                        <div className="text-muted small">
                            Showing <span className="fw-semibold text-dark">{meta.from || 1}</span> to{' '}
                            <span className="fw-semibold text-dark">{meta.to || courseList.length}</span> of{' '}
                            <span className="fw-semibold text-dark">{meta.total}</span> courses
                        </div>
                        <Pagination meta={meta} />
                    </div>
                )}
            </div>

            <InstructorQnaModal
                show={showQnaModal}
                course={selectedQnaCourse}
                onClose={() => {
                    setShowQnaModal(false);
                    setSelectedQnaCourse(null);
                }}
            />

            <InstructorReviewsModal
                show={showReviewModal}
                course={selectedReviewCourse}
                onClose={() => {
                    setShowReviewModal(false);
                    setSelectedReviewCourse(null);
                }}
            />
        </InstructorLayout>
    );
}
