import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Notyf } from 'notyf';

import CustomPointer from '@/User/Components/CustomPointer';
import PlayerHeader from './Partials/PlayerHeader';
import VideoDisplay from './Partials/VideoDisplay';
import CurriculumSidebar from './Partials/CurriculumSidebar';
import OverviewTab from './Partials/OverviewTab';
import QnaTab from './Partials/QnaTab';
import AnnouncementsTab from './Partials/AnnouncementsTab';
import ReviewsTab from './Partials/ReviewsTab';

export default function CoursePlayer({
    course,
    lastWatchHistory,
    watchedLessonIds = [],
    lessonCount = 0,
    initialQuestions = [],
    initialAnnouncements = [],
    initialReviews = [],
}) {
    const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });

    // Flatten all lessons across chapters
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
    const [activeTab, setActiveTab] = useState('overview');

    const isQnaEnabled = Boolean(course?.qna == 1 || course?.qna === true);

    useEffect(() => {
        if (!isQnaEnabled && activeTab === 'qna') {
            setActiveTab('overview');
        }
    }, [isQnaEnabled, activeTab]);

    // Theater mode state (persisted to localStorage)
    const [isTheaterMode, setIsTheaterMode] = useState(() => {
        try {
            return localStorage.getItem('player_theater_mode') === 'true';
        } catch {
            return false;
        }
    });

    const toggleTheaterMode = () => {
        setIsTheaterMode((prev) => {
            const next = !prev;
            try {
                localStorage.setItem('player_theater_mode', String(next));
            } catch {}
            return next;
        });
    };

    // Keyboard shortcut 't' / 'T' to toggle theater mode, 'Escape' to exit
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable) {
                return;
            }
            if (e.key === 't' || e.key === 'T') {
                e.preventDefault();
                toggleTheaterMode();
            } else if (e.key === 'Escape' && isTheaterMode) {
                setIsTheaterMode(false);
                try {
                    localStorage.setItem('player_theater_mode', 'false');
                } catch {}
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isTheaterMode]);

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

    const completedCount = completedIds.length;
    const progressPercentage = lessonCount > 0
        ? Math.round((completedCount / lessonCount) * 100)
        : 0;
    const effectiveTab = (isTheaterMode && activeTab === 'curriculum') ? 'overview' : activeTab;

    return (
        <section className="wsus__course_video">
            <CustomPointer />
            <Head title={`${activeLesson?.title || 'Player'} - ${course.title}`} />

            {/* Fixed Header */}
            <PlayerHeader
                course={course}
                completedCount={completedCount}
                totalCount={lessonCount}
                progressPercentage={progressPercentage}
                isTheaterMode={isTheaterMode}
                toggleTheaterMode={toggleTheaterMode}
            />

            {/* Left Main Video Area (75% Width in Normal, 100% in Theater Mode) */}
            <div
                className="wsus__course_video_player"
                style={{
                    width: isTheaterMode ? '100%' : undefined,
                    transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <VideoDisplay
                    activeLesson={activeLesson}
                    isTheaterMode={isTheaterMode}
                    toggleTheaterMode={toggleTheaterMode}
                />

                {/* Navigation Tabs & Content Area */}
                {isTheaterMode ? (
                    <div className="container-fluid px-3 px-lg-4 py-4">
                        <div className="row g-4">
                            {/* Kolom 1: Informasi Lain (Overview, Q&A, Announcements, Reviews) */}
                            <div className="col-12 col-md-6">
                                <div className="video_tabs_area bg-white rounded-3 border p-0 shadow-sm overflow-hidden">
                                    <ul className="nav nav-pills justify-content-start px-3 pt-2 bg-light border-bottom" id="pills-tab2" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className={`nav-link ${effectiveTab === 'overview' ? 'active' : ''}`}
                                                type="button"
                                                onClick={() => setActiveTab('overview')}
                                            >
                                                Overview
                                            </button>
                                        </li>
                                        {isQnaEnabled && (
                                            <li className="nav-item" role="presentation">
                                                <button
                                                    className={`nav-link ${effectiveTab === 'qna' ? 'active' : ''}`}
                                                    type="button"
                                                    onClick={() => setActiveTab('qna')}
                                                >
                                                    Q&A
                                                </button>
                                            </li>
                                        )}
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className={`nav-link ${effectiveTab === 'announcements' ? 'active' : ''}`}
                                                type="button"
                                                onClick={() => setActiveTab('announcements')}
                                            >
                                                Announcements
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className={`nav-link ${effectiveTab === 'reviews' ? 'active' : ''}`}
                                                type="button"
                                                onClick={() => setActiveTab('reviews')}
                                            >
                                                Reviews
                                            </button>
                                        </li>
                                    </ul>

                                    <div className="tab-content" id="pills-tabContent">
                                        {effectiveTab === 'overview' && (
                                            <div className="tab-pane fade show active">
                                                <OverviewTab course={course} activeLesson={activeLesson} lessonCount={lessonCount} progressPercentage={progressPercentage} />
                                            </div>
                                        )}
                                        {isQnaEnabled && effectiveTab === 'qna' && (
                                            <div className="tab-pane fade show active">
                                                <QnaTab course={course} activeLesson={activeLesson} initialQuestions={initialQuestions} />
                                            </div>
                                        )}
                                        {effectiveTab === 'announcements' && (
                                            <div className="tab-pane fade show active">
                                                <AnnouncementsTab course={course} initialAnnouncements={initialAnnouncements} />
                                            </div>
                                        )}
                                        {effectiveTab === 'reviews' && (
                                            <div className="tab-pane fade show active">
                                                <ReviewsTab course={course} initialReviews={initialReviews} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Kolom 2: Content Course */}
                            <div className="col-12 col-md-6">
                                <div
                                    className="video_course_content shadow-sm rounded-3"
                                    style={{
                                        position: 'sticky',
                                        top: '80px',
                                        maxHeight: 'calc(100vh - 100px)',
                                        overflowY: 'auto',
                                    }}
                                >
                                    <CurriculumSidebar
                                        course={course}
                                        activeLesson={activeLesson}
                                        setActiveLesson={setActiveLesson}
                                        completedIds={completedIds}
                                        toggleCompletion={toggleCompletion}
                                        isStatic={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Standard Mode: Original single-column tab layout */
                    <div className="video_tabs_area">
                        <ul className="nav nav-pills" id="pills-tab2" role="tablist">
                            <li className="nav-item d-lg-none" role="presentation">
                                <button
                                    className={`nav-link ${activeTab === 'curriculum' ? 'active' : ''}`}
                                    type="button"
                                    onClick={() => setActiveTab('curriculum')}
                                >
                                    Course Content
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                                    type="button"
                                    onClick={() => setActiveTab('overview')}
                                >
                                    Overview
                                </button>
                            </li>
                            {isQnaEnabled && (
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${activeTab === 'qna' ? 'active' : ''}`}
                                        type="button"
                                        onClick={() => setActiveTab('qna')}
                                    >
                                        Q&A
                                    </button>
                                </li>
                            )}
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link ${activeTab === 'announcements' ? 'active' : ''}`}
                                    type="button"
                                    onClick={() => setActiveTab('announcements')}
                                >
                                    Announcements
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                                    type="button"
                                    onClick={() => setActiveTab('reviews')}
                                >
                                    Reviews
                                </button>
                            </li>
                        </ul>

                        {/* Tab Panes */}
                        <div className="tab-content" id="pills-tabContent">
                            {activeTab === 'curriculum' && (
                                <div className="tab-pane fade show active d-lg-none">
                                    <div className="video_course_content">
                                        <CurriculumSidebar
                                            course={course}
                                            activeLesson={activeLesson}
                                            setActiveLesson={setActiveLesson}
                                            completedIds={completedIds}
                                            toggleCompletion={toggleCompletion}
                                            isStatic={true}
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'overview' && (
                                <div className="tab-pane fade show active">
                                    <OverviewTab course={course} activeLesson={activeLesson} lessonCount={lessonCount} progressPercentage={progressPercentage} />
                                </div>
                            )}

                            {isQnaEnabled && activeTab === 'qna' && (
                                <div className="tab-pane fade show active">
                                    <QnaTab course={course} activeLesson={activeLesson} initialQuestions={initialQuestions} />
                                </div>
                            )}

                            {activeTab === 'announcements' && (
                                <div className="tab-pane fade show active">
                                    <AnnouncementsTab course={course} initialAnnouncements={initialAnnouncements} />
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="tab-pane fade show active">
                                    <ReviewsTab course={course} initialReviews={initialReviews} />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Fixed Right Curriculum Sidebar (25% Width on Desktop, slides out in Theater Mode) */}
            <div className="d-none d-lg-block">
                <CurriculumSidebar
                    course={course}
                    activeLesson={activeLesson}
                    setActiveLesson={setActiveLesson}
                    completedIds={completedIds}
                    toggleCompletion={toggleCompletion}
                    isTheaterMode={isTheaterMode}
                />
            </div>
        </section>
    );
}
