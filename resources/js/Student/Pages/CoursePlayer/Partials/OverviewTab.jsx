import React from 'react';

export default function OverviewTab({ course, activeLesson, lessonCount, progressPercentage = 0 }) {
    const courseSummary = course?.seo_description || (course?.description ? course.description.replace(/<[^>]+>/g, '').slice(0, 150) + '...' : '');
    const isCompleted = progressPercentage >= 100;

    return (
        <div className="video_about">
            <h1>About this course</h1>
            {courseSummary ? (
                <p className="short_description text-secondary mt-2 mb-4" style={{ fontSize: '15px', lineHeight: '1.6' }}>
                    {courseSummary}
                </p>
            ) : (
                <p className="short_description text-muted mt-2 mb-4">No summary description provided for this course.</p>
            )}

            <div className="table-responsive mt-3">
                <table className="table">
                    <tbody>
                        {/* 1. By the numbers */}
                        <tr>
                            <td style={{ width: '200px' }}>
                                <p className="fw-bold mb-0">By the numbers</p>
                            </td>
                            <td>
                                <p className="mb-1">Skill level: {course?.level?.name || 'All Levels'}</p>
                                <p className="mb-1">Students: {course?.enrollments_count ?? 0}</p>
                                <p className="mb-1">Languages: {course?.language?.name || 'English'}</p>
                                <p className="mb-0">Captions: Yes</p>
                            </td>
                            <td>
                                <p className="mb-1">Lectures: {lessonCount || 0}</p>
                                <p className="mb-0">Duration: {course?.duration ? `${course.duration} minutes` : 'Self-paced'}</p>
                            </td>
                        </tr>

                        {/* 2. Certificates */}
                        {Boolean(course?.certificate == 1 || course?.certificate === true) && (
                            <tr>
                                <td>
                                    <p className="fw-bold mb-0">Certificates</p>
                                </td>
                                <td colSpan="2">
                                    <p className="mb-2 text-secondary small">
                                        {isCompleted
                                            ? 'Get EduCore certificate by completing entire course.'
                                            : 'Selesaikan 100% seluruh materi kursus untuk dapat mengunduh sertifikat.'}
                                    </p>
                                    {isCompleted ? (
                                        <a
                                            href={route('student.certificate.download', course.id)}
                                            className="btn btn-primary fw-semibold px-3 py-1-5 rounded-pill shadow-xs d-inline-flex align-items-center gap-2"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <i className="fas fa-certificate text-warning"></i> Download Certificate
                                        </a>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-secondary fw-semibold px-3 py-1-5 rounded-pill opacity-50 d-inline-flex align-items-center gap-2"
                                            disabled
                                            style={{ cursor: 'not-allowed', pointerEvents: 'auto' }}
                                            title="Progress belum 100%. Selesaikan semua materi terlebih dahulu."
                                        >
                                            <i className="fas fa-lock"></i> Download Certificate
                                        </button>
                                    )}
                                </td>
                            </tr>
                        )}

                        {/* 3. Features */}
                        {course?.features && (
                            <tr>
                                <td>
                                    <p className="fw-bold mb-0">Features</p>
                                </td>
                                <td colSpan="2">
                                    <p className="mb-0 text-dark fs-6">{course.features}</p>
                                </td>
                            </tr>
                        )}

                        {/* 4. Description */}
                        {course?.description && (
                            <tr>
                                <td>
                                    <p className="fw-bold mb-0">Description</p>
                                </td>
                                <td colSpan="2">
                                    <div
                                        className="text-secondary lh-base"
                                        style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                                        dangerouslySetInnerHTML={{ __html: course.description }}
                                    />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
