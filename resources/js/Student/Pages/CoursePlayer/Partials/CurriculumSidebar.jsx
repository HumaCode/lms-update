import React, { useState, useEffect } from 'react';

export default function CurriculumSidebar({
    course,
    activeLesson,
    setActiveLesson,
    completedIds,
    toggleCompletion,
    isTheaterMode = false,
    isStatic = false,
}) {
    // Find initial chapter ID containing activeLesson (or 1st chapter)
    const getInitialChapterId = () => {
        const foundCh = course?.chapters?.find(ch => ch.lessons?.some(l => l.id === activeLesson?.id));
        return foundCh ? foundCh.id : (course?.chapters?.[0]?.id || null);
    };

    // Single active open chapter ID (Exclusive Accordion UX recommendation)
    const [openChapterId, setOpenChapterId] = useState(getInitialChapterId);
    const [openResourceLessonId, setOpenResourceLessonId] = useState(null);

    useEffect(() => {
        const handleOutsideClick = () => setOpenResourceLessonId(null);
        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
    }, []);

    // Auto-expand chapter when active lesson changes
    useEffect(() => {
        if (activeLesson) {
            const foundCh = course?.chapters?.find(ch => ch.lessons?.some(l => l.id === activeLesson.id));
            if (foundCh) {
                setOpenChapterId(foundCh.id);
            }
        }
    }, [activeLesson?.id]);

    const toggleChapter = (chapterId) => {
        setOpenChapterId(prev => (prev === chapterId ? null : chapterId));
    };

    const formatDuration = (mins) => {
        if (!mins) return '05:00';
        if (isNaN(mins)) return mins;
        const num = parseInt(mins, 10);
        const m = Math.floor(num);
        return `${m < 10 ? '0' + m : m}.00`;
    };

    return (
        <div
            className="wsus__course_sidebar"
            style={
                isStatic
                    ? {
                          position: 'static',
                          width: '100%',
                          height: 'auto',
                          paddingTop: '0',
                          background: '#ffffff',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          overflow: 'hidden',
                      }
                    : {
                          transform: isTheaterMode ? 'translateX(100%)' : 'translateX(0)',
                          opacity: isTheaterMode ? 0 : 1,
                          pointerEvents: isTheaterMode ? 'none' : 'auto',
                          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease',
                      }
            }
        >
            <h2
                className="video_heading"
                style={
                    isStatic
                        ? {
                              position: 'static',
                              width: '100%',
                              borderRadius: '12px 12px 0 0',
                          }
                        : {}
                }
            >
                Course Content
            </h2>
            <div className="accordion" id="playerCurriculumAccordion">
                {course?.chapters?.map((chapter) => {
                    const chapterLessons = chapter.lessons || [];
                    const chapterCompletedCount = chapterLessons.filter((l) => completedIds.includes(l.id)).length;
                    const isOpen = openChapterId === chapter.id;

                    return (
                        <div className="accordion-item border-bottom" key={chapter.id}>
                            <h2 className="accordion-header" id={`heading_${chapter.id}`}>
                                <button
                                    className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                                    type="button"
                                    onClick={() => toggleChapter(chapter.id)}
                                    aria-expanded={isOpen ? 'true' : 'false'}
                                >
                                    <b>{chapter.title}</b>
                                    <span>
                                        {chapterCompletedCount}/{chapterLessons.length}
                                    </span>
                                </button>
                            </h2>
                            <div className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}>
                                <div className="accordion-body px-4 py-3">
                                    {chapterLessons.map((les) => {
                                        const isChecked = completedIds.includes(les.id);
                                        const isActive = les.id === activeLesson?.id;

                                        return (
                                            <div
                                                key={les.id}
                                                className={`form-check mb-2 py-2 px-3 rounded transition-all position-relative ${
                                                    isActive ? 'border-start border-3 border-primary' : ''
                                                }`}
                                                style={{
                                                    cursor: 'pointer',
                                                    marginLeft: 0,
                                                    paddingLeft: '2.5rem',
                                                    paddingRight: '1rem',
                                                    backgroundColor: isActive ? 'rgba(47, 102, 238, 0.08)' : 'transparent'
                                                }}
                                                onClick={() => setActiveLesson({ ...les, chapterTitle: chapter.title })}
                                            >
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        toggleCompletion(les);
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    id={`lesson_check_${les.id}`}
                                                    style={{
                                                        cursor: 'pointer',
                                                        marginTop: '3px',
                                                        marginLeft: '-1.8rem'
                                                    }}
                                                />
                                                <div className="w-100">
                                                    <label
                                                        className={`form-check-label d-block ${isActive ? 'fw-bold text-primary' : 'text-dark'}`}
                                                        htmlFor={`lesson_check_${les.id}`}
                                                        style={{ cursor: 'pointer', fontSize: '14px', lineHeight: '1.4', width: '100%' }}
                                                    >
                                                        <div className="text-break">{les.title}</div>
                                                        {les.resources_list && les.resources_list.length > 0 ? (
                                                            <div className="dropdown mt-1.5" onClick={(e) => e.stopPropagation()}>
                                                                <button
                                                                    className="btn btn-sm btn-light border py-1 px-2.5 d-inline-flex align-items-center gap-1 shadow-xs text-dark"
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setOpenResourceLessonId((prev) => (prev === les.id ? null : les.id));
                                                                    }}
                                                                    style={{ fontSize: '12px', fontWeight: 600, borderRadius: '6px' }}
                                                                >
                                                                    <i className="fas fa-folder-open text-warning me-1"></i> Resources ({les.resources_list.length})
                                                                </button>
                                                                <ul
                                                                    className={`dropdown-menu shadow-lg border rounded-3 mt-2 py-2 px-3 ${
                                                                        openResourceLessonId === les.id ? 'show d-block' : ''
                                                                    }`}
                                                                    style={{
                                                                        zIndex: 1050,
                                                                        minWidth: '260px',
                                                                        maxWidth: '320px',
                                                                        right: 0,
                                                                        left: 'auto',
                                                                        backgroundColor: '#ffffff'
                                                                    }}
                                                                >
                                                                    {les.resources_list.map((res) => (
                                                                        <li key={res.id} style={{ listStyle: 'none' }}>
                                                                            <a
                                                                                className="d-flex align-items-center justify-content-between gap-2 py-2 px-2 rounded-2 text-dark text-decoration-none resource-download-item"
                                                                                href={res.download_url}
                                                                                download={res.file_name}
                                                                                style={{ fontSize: '13px', transition: 'background-color 0.2s', paddingLeft: '8px', paddingRight: '8px' }}
                                                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                                            >
                                                                                <div className="d-flex align-items-center gap-2 overflow-hidden me-2">
                                                                                    <i className="fas fa-file-download text-primary flex-shrink-0" style={{ fontSize: '14px' }}></i>
                                                                                    <span className="fw-semibold text-truncate text-dark">{res.file_name}</span>
                                                                                </div>
                                                                                <span className="text-muted small flex-shrink-0" style={{ fontSize: '11px' }}>({res.human_size})</span>
                                                                            </a>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        ) : les.lesson_type === 'resource' ? (
                                                            <span className="d-flex align-items-center gap-1 text-info mt-1" style={{ fontSize: '12px', fontWeight: 500 }}>
                                                                <i className="fas fa-file-archive me-1"></i> Resource File
                                                            </span>
                                                        ) : (
                                                            <span className="d-flex align-items-center gap-1 text-muted mt-1" style={{ fontSize: '12px', fontWeight: 500 }}>
                                                                <img
                                                                    src="/frontend/assets/images/video_icon_black_2.png"
                                                                    alt="video"
                                                                    style={{ width: '13px', height: '13px', objectFit: 'contain' }}
                                                                />
                                                                {formatDuration(les.duration)}
                                                            </span>
                                                        )}
                                                    </label>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
