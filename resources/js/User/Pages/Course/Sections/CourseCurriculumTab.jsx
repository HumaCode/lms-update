import React, { useState } from 'react';

export default function CourseCurriculumTab({ chapters = [], onPreviewLesson }) {
    const [openChapters, setOpenChapters] = useState(() => {
        return chapters.length > 0 ? [chapters[0].id] : [];
    });

    const toggleChapter = (chapterId) => {
        setOpenChapters((prev) =>
            prev.includes(chapterId)
                ? prev.filter((id) => id !== chapterId)
                : [...prev, chapterId]
        );
    };

    const formatDuration = (mins) => {
        if (!mins) return 'Lesson';
        if (isNaN(mins)) return mins;
        const num = parseInt(mins, 10);
        const h = Math.floor(num / 60);
        const m = num % 60;
        if (h > 0 && m > 0) return `${h}h ${m}m`;
        if (h > 0) return `${h} hours`;
        return `${m} minutes`;
    };

    return (
        <div className="wsus__courses_curriculum box_area">
            <h3>Course Curriculum</h3>
            {chapters.length === 0 ? (
                <p className="text-muted">No curriculum chapters available yet.</p>
            ) : (
                <div className="accordion" id="accordionExample">
                    {chapters.map((chapter) => {
                        const isOpen = openChapters.includes(chapter.id);
                        return (
                            <div className="accordion-item" key={chapter.id}>
                                <h2 className="accordion-header">
                                    <button
                                        className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                                        type="button"
                                        onClick={() => toggleChapter(chapter.id)}
                                        aria-expanded={isOpen}
                                    >
                                        {chapter.title}
                                    </button>
                                </h2>
                                <div className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}>
                                    <div className="accordion-body">
                                        {chapter.lessons && chapter.lessons.length > 0 ? (
                                            <ul>
                                                {chapter.lessons.map((lesson) => {
                                                    const isPreview = lesson.is_preview == 1 || lesson.is_free == 1;
                                                    return (
                                                        <li key={lesson.id} className={isPreview ? 'active' : ''}>
                                                            <p>{lesson.title}</p>
                                                            {isPreview ? (
                                                                <button
                                                                    type="button"
                                                                    className="right_text"
                                                                    style={{
                                                                        border: 'none',
                                                                        cursor: 'pointer',
                                                                        fontWeight: 600,
                                                                    }}
                                                                    onClick={() => onPreviewLesson(lesson.file_path || lesson.url)}
                                                                >
                                                                    Preview
                                                                </button>
                                                            ) : (
                                                                <span className="right_text">
                                                                    {formatDuration(lesson.duration)}
                                                                </span>
                                                            )}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        ) : (
                                            <p className="text-muted mb-0 small px-3 py-2">
                                                No lessons in this chapter yet.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
