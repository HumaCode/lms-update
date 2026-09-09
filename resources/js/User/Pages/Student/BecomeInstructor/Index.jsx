import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import StudentDashboardLayout from '../../../Layouts/StudentDashboardLayout';

export default function BecomeInstructor() {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [document, setDocument] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const isPending = user?.approve_status === 'pending';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!document) return;
        setSubmitting(true);

        const formData = new FormData();
        formData.append('document', document);

        router.post(route('student.become-instructor.update', user.id), formData, {
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <StudentDashboardLayout title="Become an Instructor" subtitle="Instructor Application">
            <Head title="Become an Instructor - Student Dashboard" />

            <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
                <h5 className="fw-bold text-dark mb-2">Apply as an Instructor</h5>
                <p className="text-muted small mb-4">
                    Share your expertise, create impactful courses, and earn revenue by teaching students globally.
                </p>

                {isPending ? (
                    <div className="alert alert-warning d-flex align-items-center mb-0" role="alert">
                        <i className="fas fa-hourglass-half fs-4 me-3"></i>
                        <div>
                            <h6 className="alert-heading fw-bold mb-1">Application Under Review</h6>
                            <p className="small mb-0">
                                Your instructor application document has been submitted and is currently being verified by the administration team. You will be notified once approved.
                            </p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ maxWidth: '540px' }}>
                        <div className="mb-3">
                            <label className="form-label small fw-bold">Supporting Document / CV / Portfolio</label>
                            <input
                                type="file"
                                className="form-control form-control-sm"
                                accept=".pdf,.doc,.docx,.jpg,.png"
                                onChange={(e) => setDocument(e.target.files[0])}
                                required
                            />
                            <div className="form-text small">
                                Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max: 12MB).
                            </div>
                        </div>

                        <div>
                            <button className="btn btn-primary px-4 shadow-sm" type="submit" disabled={submitting || !document}>
                                {submitting ? 'Submitting Application...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </StudentDashboardLayout>
    );
}
