import React from 'react';

export default function CourseOverviewTab({ course }) {
    return (
        <div className="wsus__courses_overview box_area overflow-hidden" style={{ maxWidth: '100%' }}>
            {course.features && (
                <div className="mb-4 pb-3 border-bottom">
                    <h3 className="mb-2">Features</h3>
                    <p className="text-secondary fs-6 mb-0">{course.features}</p>
                </div>
            )}

            <h3>Course Description</h3>
            {course.description ? (
                <>
                    <style>{`
                        .description_content {
                            word-break: break-word !important;
                            overflow-wrap: anywhere !important;
                            word-wrap: break-word !important;
                            max-width: 100% !important;
                        }
                        .description_content * {
                            max-width: 100% !important;
                            box-sizing: border-box !important;
                        }
                        .description_content img {
                            height: auto !important;
                            border-radius: 8px;
                            margin: 10px 0;
                        }
                        .description_content pre, .description_content code {
                            white-space: pre-wrap !important;
                            word-break: break-word !important;
                        }
                        .description_content table {
                            display: block;
                            overflow-x: auto;
                            max-width: 100% !important;
                        }
                        .description_content h1, .description_content h2, .description_content h3, .description_content h4 {
                            margin-top: 15px;
                            margin-bottom: 10px;
                            line-height: 1.3;
                        }
                    `}</style>
                    <div
                        className="description_content text-secondary"
                        dangerouslySetInnerHTML={{ __html: course.description }}
                    />
                </>
            ) : (
                <p>No detailed description provided for this course.</p>
            )}
        </div>
    );
}
