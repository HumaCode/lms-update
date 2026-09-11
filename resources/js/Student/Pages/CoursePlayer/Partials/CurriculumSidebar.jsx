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
                                                <label
                                                    className={`form-check-label d-block ${isActive ? 'fw-bold text-primary' : 'text-dark'}`}
                                                    htmlFor={`lesson_check_${les.id}`}
                                                    style={{ cursor: 'pointer', fontSize: '14px', lineHeight: '1.4', width: '100%' }}
                                                >
                                                    <div className="text-break">{les.title}</div>
                                                    <span className="d-flex align-items-center gap-1 text-muted mt-1" style={{ fontSize: '12px', fontWeight: 500 }}>
                                                        <img
                                                            src="/frontend/assets/images/video_icon_black_2.png"
                                                            alt="video"
                                                            style={{ width: '13px', height: '13px', objectFit: 'contain' }}
                                                        />
                                                        {formatDuration(les.duration)}
                                                    </span>
                                                </label>
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
