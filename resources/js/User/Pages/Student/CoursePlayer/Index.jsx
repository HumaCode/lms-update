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
            />

            {/* Left Main Video Area (75% Width) */}
            <div className="wsus__course_video_player">
                <VideoDisplay activeLesson={activeLesson} />

                {/* Navigation Tabs */}
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
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${activeTab === 'qna' ? 'active' : ''}`}
                                type="button"
                                onClick={() => setActiveTab('qna')}
                            >
                                Q&A
                            </button>
                        </li>
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
                                <CurriculumSidebar
                                    course={course}
                                    activeLesson={activeLesson}
                                    setActiveLesson={setActiveLesson}
                                    completedIds={completedIds}
                                    toggleCompletion={toggleCompletion}
                                />
                            </div>
                        )}

                        {activeTab === 'overview' && (
                            <div className="tab-pane fade show active">
                                <OverviewTab course={course} activeLesson={activeLesson} lessonCount={lessonCount} />
                            </div>
                        )}

                        {activeTab === 'qna' && (
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
            </div>

            {/* Fixed Right Curriculum Sidebar (25% Width on Desktop) */}
            <div className="d-none d-lg-block">
                <CurriculumSidebar
                    course={course}
                    activeLesson={activeLesson}
                    setActiveLesson={setActiveLesson}
                    completedIds={completedIds}
                    toggleCompletion={toggleCompletion}
                />
            </div>
        </section>
    );
}
