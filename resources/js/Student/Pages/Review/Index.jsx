import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import StudentDashboardLayout from '@/Student/Layouts/StudentDashboardLayout';

export default function StudentReviews({ reviews }) {
    const reviewList = reviews?.data || [];

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this review?')) {
            router.delete(route('student.review.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <StudentDashboardLayout title="My Reviews" subtitle="Reviews">
            <Head title="My Reviews - Student Dashboard" />

            <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
                <h5 className="fw-bold text-dark mb-4">My Course Reviews</h5>

                {reviewList.length === 0 ? (
                    <p className="text-muted small py-4 text-center">You haven't submitted any reviews yet.</p>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        {reviewList.map((rev) => (
                            <div className="card bg-light border-0 p-3 rounded-3" key={rev.id}>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        <h6 className="fw-bold text-dark mb-1">
                                            {rev.course ? (
                                                <Link href={route('courses.show', rev.course.slug)} className="text-dark text-decoration-none">
                                                    {rev.course.title}
                                                </Link>
                                            ) : (
                                                'Course Review'
                                            )}
                                        </h6>
                                        <div className="text-warning small">
                                            {[...Array(rev.rating || 5)].map((_, i) => (
                                                <i className="fas fa-star me-1" key={i}></i>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className={`badge ${rev.status == 1 ? 'bg-success' : 'bg-secondary'}`}>
                                            {rev.status == 1 ? 'Published' : 'Pending'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(rev.id)}
                                            className="btn btn-outline-danger btn-sm"
                                            title="Delete review"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                                <p className="text-muted small mb-0">{rev.review}</p>
                            </div>
                        ))}
                    </div>
                )}

                {reviews?.links && reviews.links.length > 3 && (
                    <div className="d-flex justify-content-center mt-4">
                        <ul className="pagination pagination-sm shadow-sm mb-0">
                            {reviews.links.map((link, idx) => (
                                <li key={idx} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                                    <Link href={link.url || '#'} className="page-link" dangerouslySetInnerHTML={{ __html: link.label }} />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </StudentDashboardLayout>
    );
}
