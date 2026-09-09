import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { Notyf } from 'notyf';

export default function CoursePlayer({
    course,
    lastWatchHistory,
    watchedLessonIds = [],
    lessonCount = 0
}) {
    const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });

    // Flatten all lessons
    const allLessons = [];
    course?.chapters?.forEach((ch) => {
        ch.lessons?.forEach((l) => {
            allLessons.push({ ...l, chapterTitle: ch.title });
        });
    });

    // Determine initial active lesson
    const initialLesson = allLessons.find((l) => l.id === lastWatchHistory?.lesson_id) || allLessons[0];
    const [activeLesson, setActiveLesson] = useState(initialLesson);
    const [completedIds, setCompletedIds] = useState(watchedLessonIds || []);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const isCompleted = activeLesson && completedIds.includes(activeLesson.id);

    // Track watch history when active lesson changes
    useEffect(() => {
        if (activeLesson) {
            axios.post(route('student.update-watch-history'), {
                course_id: course.id,
                chapter_id: activeLesson.chapter_id,
                lesson_id: activeLesson.id,
            }).catch(() => {});
        }
    }, [activeLesson?.id]);

    const toggleCompletion = async (lesson) => {
        try {
            await axios.post(route('student.update-lesson-completion'), {
                course_id: course.id,
                chapter_id: lesson.chapter_id,
                lesson_id: lesson.id,
            });

            setCompletedIds((prev) => {
                if (prev.includes(lesson.id)) {
                    notyf.success('Marked as incomplete');
                    return prev.filter((id) => id !== lesson.id);
                } else {
                    notyf.success('Marked as completed!');
                    return [...prev, lesson.id];
                }
            });
        } catch (err) {
            notyf.error('Failed to update progress');
        }
    };

    const handleNextLesson = () => {
        const currentIndex = allLessons.findIndex((l) => l.id === activeLesson?.id);
        if (currentIndex < allLessons.length - 1) {
            setActiveLesson(allLessons[currentIndex + 1]);
        }
    };

    const handlePrevLesson = () => {
        const currentIndex = allLessons.findIndex((l) => l.id === activeLesson?.id);
        if (currentIndex > 0) {
            setActiveLesson(allLessons[currentIndex - 1]);
        }
    };

    const progressPercentage = lessonCount > 0
        ? Math.round((completedIds.length / lessonCount) * 100)
        : 0;

    return (
        <div className="course_player_container d-flex flex-column vh-100 bg-dark text-white overflow-hidden">
            <Head title={`${activeLesson?.title || 'Player'} - ${course.title}`} />

            {/* Topbar Navigation */}
            <header className="navbar navbar-dark bg-black px-4 py-2 border-bottom border-secondary d-flex justify-content-between align-items-center flex-shrink-0">
                <div className="d-flex align-items-center gap-3">
                    <Link
                        href={route('student.enrolled-courses.index')}
                        className="btn btn-outline-light btn-sm"
                        title="Back to my courses"
                    >
                        <i className="fas fa-arrow-left me-1"></i> Back
                    </Link>
                    <div className="text-truncate" style={{ maxWidth: '450px' }}>
                        <h6 className="mb-0 fw-bold text-white text-truncate">{course.title}</h6>
                        <span className="small text-muted">{activeLesson?.title || 'Course Player'}</span>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                    <div className="d-none d-md-flex align-items-center gap-2">
                        <div className="progress" style={{ width: '120px', height: '8px' }}>
                            <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: `${progressPercentage}%` }}
                                aria-valuenow={progressPercentage}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            ></div>
                        </div>
                        <span className="small text-muted">{progressPercentage}% Complete</span>
                    </div>

                    <button
                        className="btn btn-sm btn-outline-light"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        title="Toggle Curriculum Sidebar"
                    >
                        <i className="fas fa-bars"></i>
                    </button>
                </div>
            </header>

            {/* Main Classroom Layout */}
            <div className="d-flex flex-grow-1 overflow-hidden">
                {/* Left: Video / Lesson Player Area */}
                <div className="flex-grow-1 d-flex flex-column overflow-auto p-4 bg-dark">
                    <div className="mx-auto w-100" style={{ maxWidth: '980px' }}>
                        {/* Video Display Box */}
                        <div className="ratio ratio-16x9 bg-black rounded-3 shadow overflow-hidden mb-4">
                            {activeLesson?.file_type === 'video' ? (
                                activeLesson?.url?.includes('youtube') ? (
                                    <iframe
                                        src={activeLesson.url.replace('watch?v=', 'embed/')}
                                        title={activeLesson.title}
                                        allowFullScreen
                                    ></iframe>
                                ) : activeLesson?.url?.includes('vimeo') ? (
                                    <iframe
                                        src={activeLesson.url}
                                        title={activeLesson.title}
                                        allowFullScreen
                                    ></iframe>
                                ) : activeLesson?.file_path ? (
                                    <video controls className="w-100 h-100" src={`/${activeLesson.file_path}`}></video>
                                ) : (
                                    <div className="d-flex align-items-center justify-content-center text-muted">
                                        <i className="fas fa-play-circle fs-1 me-2"></i> Video source not found
                                    </div>
                                )
                            ) : activeLesson?.file_type === 'pdf' || activeLesson?.file_type === 'doc' ? (
                                <div className="d-flex flex-column align-items-center justify-content-center h-100 p-4 text-center">
                                    <i className="fas fa-file-pdf fs-1 text-danger mb-3"></i>
                                    <h5>{activeLesson.title}</h5>
                                    <p className="text-muted small mb-3">Document / Reading material</p>
                                    {activeLesson.file_path && (
                                        <a
                                            href={route('student.file-download', activeLesson.id)}
                                            className="btn btn-primary btn-sm"
                                        >
                                            <i className="fas fa-download me-1"></i> Download Document
                                        </a>
                                    )}
                                </div>
                            ) : (
                                <div className="d-flex align-items-center justify-content-center text-muted">
                                    <p>Select a lesson from curriculum</p>
                                </div>
                            )}
                        </div>

                        {/* Controls & Description */}
                        {activeLesson && (
                            <div className="card bg-black border-secondary p-4 rounded-3 text-white">
                                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                                    <div>
                                        <span className="badge bg-primary me-2">{activeLesson.chapterTitle}</span>
                                        <h4 className="fw-bold mb-0 mt-1">{activeLesson.title}</h4>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleCompletion(activeLesson)}
                                            className={`btn btn-sm ${isCompleted ? 'btn-success' : 'btn-outline-light'}`}
                                        >
                                            <i className={`fas ${isCompleted ? 'fa-check-circle' : 'fa-circle'} me-1`}></i>
                                            {isCompleted ? 'Completed' : 'Mark as Complete'}
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={handlePrevLesson}
                                            disabled={allLessons.findIndex((l) => l.id === activeLesson?.id) === 0}
                                        >
                                            <i className="fas fa-chevron-left"></i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={handleNextLesson}
                                            disabled={allLessons.findIndex((l) => l.id === activeLesson?.id) === allLessons.length - 1}
                                        >
                                            <i className="fas fa-chevron-right"></i>
                                        </button>
                                    </div>
                                </div>

                                {activeLesson.description && (
                                    <div
                                        className="text-white-50 small lh-base"
                                        dangerouslySetInnerHTML={{ __html: activeLesson.description }}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Curriculum Sidebar */}
                {sidebarOpen && (
                    <div
                        className="bg-black border-start border-secondary d-flex flex-column flex-shrink-0 overflow-auto"
                        style={{ width: '360px' }}
                    >
                        <div className="p-3 border-bottom border-secondary">
                            <h6 className="fw-bold mb-1 text-white">Course Content</h6>
                            <span className="small text-muted">{lessonCount} total lectures</span>
                        </div>

                        <div className="accordion accordion-flush" id="playerSidebarAccordion">
                            {course?.chapters?.map((chapter, cIdx) => (
                                <div className="accordion-item bg-transparent text-white border-bottom border-secondary" key={chapter.id}>
                                    <h2 className="accordion-header" id={`sidebarHeading_${chapter.id}`}>
                                        <button
                                            className="accordion-button bg-black text-white shadow-none px-3 py-2 small fw-bold"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#sidebarCollapse_${chapter.id}`}
                                            aria-expanded="true"
                                            aria-controls={`sidebarCollapse_${chapter.id}`}
                                        >
                                            <span className="text-primary me-2">{cIdx + 1}.</span> {chapter.title}
                                        </button>
                                    </h2>
                                    <div
                                        id={`sidebarCollapse_${chapter.id}`}
                                        className="accordion-collapse collapse show"
                                        aria-labelledby={`sidebarHeading_${chapter.id}`}
                                    >
                                        <div className="accordion-body p-0">
                                            <ul className="list-group list-group-flush">
                                                {chapter.lessons?.map((les) => {
                                                    const isActive = les.id === activeLesson?.id;
                                                    const isDone = completedIds.includes(les.id);

                                                    return (
                                                        <li
                                                            key={les.id}
                                                            className={`list-group-item bg-transparent text-white d-flex align-items-center justify-content-between p-3 cursor-pointer border-0 ${isActive ? 'bg-secondary bg-opacity-25' : ''}`}
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => setActiveLesson({ ...les, chapterTitle: chapter.title })}
                                                        >
                                                            <div className="d-flex align-items-center gap-2 text-truncate">
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input mt-0"
                                                                    checked={isDone}
                                                                    onChange={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleCompletion(les);
                                                                    }}
                                                                />
                                                                <span className={`small ${isActive ? 'text-primary fw-bold' : 'text-white-50'}`}>
                                                                    {les.title}
                                                                </span>
                                                            </div>
                                                            <span className="badge text-muted small">
                                                                <i className={`far ${les.file_type === 'video' ? 'fa-play-circle' : 'fa-file'}`}></i>
                                                            </span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
