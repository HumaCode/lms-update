import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import { Notyf } from 'notyf';
import UserLayout from '../../Layouts/UserLayout';
import CourseBreadcrumb from './Sections/CourseBreadcrumb';
import CourseOverviewTab from './Sections/CourseOverviewTab';
import CourseCurriculumTab from './Sections/CourseCurriculumTab';
import CourseInstructorTab from './Sections/CourseInstructorTab';
import CourseFaqTab from './Sections/CourseFaqTab';
import CourseReviewTab from './Sections/CourseReviewTab';
import CourseSidebar from './Sections/CourseSidebar';
import VideoModal from './Sections/VideoModal';

export default function CourseShow({ course, reviews }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [activeTab, setActiveTab] = useState('overview');
    const [addingToCart, setAddingToCart] = useState(false);
    const [previewVideoUrl, setPreviewVideoUrl] = useState(null);

    // Review form state
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    const avgRating = Number(course.reviews_avg_rating || 0);
    const reviewsCount = reviews?.total || (reviews?.data ? reviews.data.length : 0);

    const handleAddToCart = async () => {
        if (!user) {
            router.get(route('login'));
            return;
        }
        const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });
        setAddingToCart(true);
        try {
            const res = await axios.post(route('add-to-cart', course.id));
            notyf.success(res.data?.message || 'Added to cart successfully!');
            router.reload({ only: ['cart_count'] });
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to add to cart';
            notyf.error(msg);
        } finally {
            setAddingToCart(false);
        }
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        router.post(
            route('review.store'),
            {
                course: course.id,
                rating,
                review: reviewText,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setReviewText('');
                },
                onFinish: () => setSubmittingReview(false),
            }
        );
    };

    return (
        <UserLayout>
            <Head title={`${course.title} - EduCore`}>
                <meta name="description" content={course.seo_description || course.title} />
                <meta property="og:title" content={course.title} />
                <meta property="og:description" content={course.seo_description || course.title} />
                {course.thumbnail && (
                    <meta
                        property="og:image"
                        content={
                            course.thumbnail.startsWith('http')
                                ? course.thumbnail
                                : `/${course.thumbnail}`
                        }
                    />
                )}
            </Head>

            {/* Breadcrumb Header */}
            <CourseBreadcrumb
                course={course}
                reviewsCount={reviewsCount}
                avgRating={avgRating}
            />

            {/* Main Course Details & Sticky Sidebar Section */}
            <section className="wsus__courses_details pb_120 xs_pb_100">
                <div className="container">
                    <div className="row">
                        {/* Left Column: Course Tabs */}
                        <div className="col-lg-8 wow fadeInLeft">
                            <div className="wsus__courses_details_area mt_40">
                                {/* Navigation Pills */}
                                <ul className="nav nav-pills mb_40" id="pills-tab" role="tablist">
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
                                            className={`nav-link ${activeTab === 'curriculum' ? 'active' : ''}`}
                                            type="button"
                                            onClick={() => setActiveTab('curriculum')}
                                        >
                                            Curriculum
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className={`nav-link ${activeTab === 'instructor' ? 'active' : ''}`}
                                            type="button"
                                            onClick={() => setActiveTab('instructor')}
                                        >
                                            Instructor
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className={`nav-link ${activeTab === 'faqs' ? 'active' : ''}`}
                                            type="button"
                                            onClick={() => setActiveTab('faqs')}
                                        >
                                            FAQs
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                                            type="button"
                                            onClick={() => setActiveTab('reviews')}
                                        >
                                            Review
                                        </button>
                                    </li>
                                </ul>

                                {/* Tab Content */}
                                <div className="tab-content" id="pills-tabContent">
                                    {activeTab === 'overview' && (
                                        <CourseOverviewTab course={course} />
                                    )}

                                    {activeTab === 'curriculum' && (
                                        <CourseCurriculumTab
                                            chapters={course.chapters || []}
                                            onPreviewLesson={(url) => setPreviewVideoUrl(url)}
                                        />
                                    )}

                                    {activeTab === 'instructor' && (
                                        <CourseInstructorTab
                                            instructor={course.instructor}
                                            reviewsCount={reviewsCount}
                                            avgRating={avgRating}
                                            totalStudents={course.enrollments_count || 0}
                                        />
                                    )}

                                    {activeTab === 'faqs' && <CourseFaqTab />}

                                    {activeTab === 'reviews' && (
                                        <CourseReviewTab
                                            reviews={reviews}
                                            avgRating={avgRating}
                                            user={user}
                                            rating={rating}
                                            setRating={setRating}
                                            reviewText={reviewText}
                                            setReviewText={setReviewText}
                                            handleReviewSubmit={handleReviewSubmit}
                                            submittingReview={submittingReview}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Sticky Course Sidebar */}
                        <div className="col-lg-4 col-md-8 wow fadeInRight">
                            <CourseSidebar
                                course={course}
                                onPlayVideo={(url) => setPreviewVideoUrl(url)}
                                handleAddToCart={handleAddToCart}
                                addingToCart={addingToCart}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Preview Modal */}
            <VideoModal
                videoUrl={previewVideoUrl}
                onClose={() => setPreviewVideoUrl(null)}
            />
        </UserLayout>
    );
}
