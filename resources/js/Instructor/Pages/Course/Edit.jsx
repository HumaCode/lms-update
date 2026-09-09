import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import InstructorLayout from '@/Instructor/Layouts/InstructorLayout';
import { formatCurrency } from '@/Utils/formatters';
import { route } from '@/Utils/routes';

export default function Edit({
    course,
    categories = [],
    levels = [],
    languages = [],
    currentStep = 1,
}) {
    const [activeStep, setActiveStep] = useState(Number(currentStep) || 1);

    // STEP 1: Basic Info Form
    const [step1Data, setStep1Data] = useState({
        id: course.id,
        current_step: '1',
        title: course.title || '',
        seo_description: course.seo_description || '',
        thumbnail: null,
        demo_video_storage: course.demo_video_storage || 'youtube',
        demo_video_source: course.demo_video_source || '',
        price: course.price || '',
        discount: course.discount || '',
        description: course.description || '',
    });
    const [step1Preview, setStep1Preview] = useState(
        course.thumbnail ? `/${course.thumbnail}` : null
    );
    const [step1Processing, setStep1Processing] = useState(false);
    const [step1Errors, setStep1Errors] = useState({});

    const handleStep1Submit = (e) => {
        e.preventDefault();
        setStep1Processing(true);
        router.post(route('instructor.courses.update'), step1Data, {
            forceFormData: true,
            onError: (errs) => {
                setStep1Errors(errs);
                setStep1Processing(false);
            },
            onSuccess: () => {
                setStep1Errors({});
                setStep1Processing(false);
                setActiveStep(2);
            },
            onFinish: () => setStep1Processing(false),
        });
    };

    // STEP 2: More Info Form
    const step2Form = useForm({
        id: course.id,
        current_step: '2',
        category: course.category_id || '',
        level: course.course_level_id || '',
        language: course.course_language_id || '',
        capacity: course.capacity || '',
        duration: course.duration || '',
        qna: course.qna ? 1 : 0,
        certificate: course.certificate ? 1 : 0,
    });

    const handleStep2Submit = (e) => {
        e.preventDefault();
        step2Form.post(route('instructor.courses.update'), {
            onSuccess: () => setActiveStep(3),
        });
    };

    // STEP 3: Modals for Chapters and Lessons
    const [showChapterModal, setShowChapterModal] = useState(false);
    const [chapterTitle, setChapterTitle] = useState('');
    const [editingChapter, setEditingChapter] = useState(null);

    const [showLessonModal, setShowLessonModal] = useState(false);
    const [activeChapterId, setActiveChapterId] = useState(null);
    const [lessonForm, setLessonForm] = useState({
        title: '',
        source: 'youtube',
        file_type: 'video',
        url: '',
        duration: '',
        is_preview: 0,
        downloadable: 0,
        description: '',
    });

    const handleSaveChapter = (e) => {
        e.preventDefault();
        if (editingChapter) {
            router.post(route('instructor.course-content.update-chapter', editingChapter.id), {
                title: chapterTitle,
            }, {
                onSuccess: () => {
                    setShowChapterModal(false);
                    setChapterTitle('');
                    setEditingChapter(null);
                },
            });
        } else {
            router.post(route('instructor.course-content.store-chapter', course.id), {
                title: chapterTitle,
            }, {
                onSuccess: () => {
                    setShowChapterModal(false);
                    setChapterTitle('');
                },
            });
        }
    };

    const handleDeleteChapter = (chapterId, title) => {
        if (confirm(`Are you sure you want to delete chapter "${title}" and all its lessons?`)) {
            router.delete(route('instructor.course-content.destory-chapter', chapterId));
        }
    };

    const handleSaveLesson = (e) => {
        e.preventDefault();
        router.post(route('instructor.course-content.store-lesson'), {
            course_id: course.id,
            chapter_id: activeChapterId,
            ...lessonForm,
        }, {
            onSuccess: () => {
                setShowLessonModal(false);
                setLessonForm({
                    title: '',
                    source: 'youtube',
                    file_type: 'video',
                    url: '',
                    duration: '',
                    is_preview: 0,
                    downloadable: 0,
                    description: '',
                });
            },
        });
    };

    const handleDeleteLesson = (lessonId, title) => {
        if (confirm(`Are you sure you want to delete lesson "${title}"?`)) {
            router.delete(route('instructor.course-content.destroy-lesson', lessonId));
        }
    };

    // STEP 4: Review & Publish Form
    const step4Form = useForm({
        id: course.id,
        current_step: '4',
        message: course.message_for_reviewer || '',
        status: course.status || 'draft',
    });

    const handleStep4Submit = (e) => {
        e.preventDefault();
        step4Form.post(route('instructor.courses.update'));
    };

    const steps = [
        { num: 1, label: 'Basic Information' },
        { num: 2, label: 'Course Details' },
        { num: 3, label: 'Curriculum & Lessons' },
        { num: 4, label: 'Review & Publish' },
    ];

    return (
        <InstructorLayout
            title={`Edit Course: ${course.title}`}
            crumbs={[
                { label: 'Courses', url: route('instructor.courses.index') },
                { label: course.title },
            ]}
        >
            <Head title={`Edit Course - ${course.title}`} />

            {/* STEP WIZARD NAV */}
            <div className="card border-0 shadow-sm rounded-3 mb-4">
                <div className="card-body p-2">
                    <div className="row g-2 text-center">
                        {steps.map((s) => (
                            <div key={s.num} className="col-6 col-md-3">
                                <button
                                    type="button"
                                    onClick={() => setActiveStep(s.num)}
                                    className={`w-100 btn py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 rounded-2 ${
                                        activeStep === s.num
                                            ? 'btn-primary text-white shadow-sm'
                                            : 'btn-light text-secondary'
                                    }`}
                                >
                                    <span
                                        className={`badge rounded-circle ${
                                            activeStep === s.num ? 'bg-white text-primary' : 'bg-secondary text-white'
                                        }`}
                                    >
                                        {s.num}
                                    </span>
                                    <span>{s.label}</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* STEP 1: BASIC INFORMATION */}
            {activeStep === 1 && (
                <div className="card border-0 shadow-sm rounded-3">
                    <div className="card-header bg-white border-bottom py-3">
                        <h5 className="fw-bold mb-0 text-dark">Step 1: Basic Information</h5>
                    </div>
                    <form onSubmit={handleStep1Submit} encType="multipart/form-data">
                        <div className="card-body p-4">
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label required fw-semibold">Course Title</label>
                                    <input
                                        type="text"
                                        className={`form-control ${step1Errors.title ? 'is-invalid' : ''}`}
                                        value={step1Data.title}
                                        onChange={(e) => setStep1Data({ ...step1Data, title: e.target.value })}
                                    />
                                    {step1Errors.title && <div className="invalid-feedback">{step1Errors.title}</div>}
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold">SEO Meta Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={step1Data.seo_description}
                                        onChange={(e) =>
                                            setStep1Data({ ...step1Data, seo_description: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Update Thumbnail</label>
                                    <input
                                        type="file"
                                        className={`form-control ${step1Errors.thumbnail ? 'is-invalid' : ''}`}
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setStep1Data({ ...step1Data, thumbnail: file });
                                                setStep1Preview(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                    {step1Errors.thumbnail && (
                                        <div className="invalid-feedback">{step1Errors.thumbnail}</div>
                                    )}
                                    {step1Preview && (
                                        <div className="mt-2">
                                            <img
                                                src={step1Preview}
                                                alt="Preview"
                                                className="img-thumbnail rounded-3"
                                                style={{ maxHeight: '130px' }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label required fw-semibold">Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className={`form-control ${step1Errors.price ? 'is-invalid' : ''}`}
                                        value={step1Data.price}
                                        onChange={(e) => setStep1Data({ ...step1Data, price: e.target.value })}
                                    />
                                    {step1Errors.price && <div className="invalid-feedback">{step1Errors.price}</div>}
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-semibold">Discounted Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="form-control"
                                        value={step1Data.discount}
                                        onChange={(e) => setStep1Data({ ...step1Data, discount: e.target.value })}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">Demo Video Provider</label>
                                    <select
                                        className="form-select"
                                        value={step1Data.demo_video_storage}
                                        onChange={(e) =>
                                            setStep1Data({ ...step1Data, demo_video_storage: e.target.value })
                                        }
                                    >
                                        <option value="youtube">YouTube</option>
                                        <option value="vimeo">Vimeo</option>
                                        <option value="external_link">External URL</option>
                                    </select>
                                </div>

                                <div className="col-md-8">
                                    <label className="form-label fw-semibold">Demo Video URL</label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        value={step1Data.demo_video_source}
                                        onChange={(e) =>
                                            setStep1Data({ ...step1Data, demo_video_source: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label required fw-semibold">Course Description</label>
                                    <textarea
                                        className={`form-control ${step1Errors.description ? 'is-invalid' : ''}`}
                                        rows="8"
                                        value={step1Data.description}
                                        onChange={(e) =>
                                            setStep1Data({ ...step1Data, description: e.target.value })
                                        }
                                    ></textarea>
                                    {step1Errors.description && (
                                        <div className="invalid-feedback">{step1Errors.description}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="card-footer bg-white border-top py-3 text-end">
                            <button
                                type="submit"
                                className="btn btn-primary px-4"
                                disabled={step1Processing}
                            >
                                {step1Processing ? 'Saving...' : 'Save & Proceed to Details'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* STEP 2: COURSE DETAILS */}
            {activeStep === 2 && (
                <div className="card border-0 shadow-sm rounded-3">
                    <div className="card-header bg-white border-bottom py-3">
                        <h5 className="fw-bold mb-0 text-dark">Step 2: Course Category & Details</h5>
                    </div>
                    <form onSubmit={handleStep2Submit}>
                        <div className="card-body p-4">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label required fw-semibold">Category</label>
                                    <select
                                        className={`form-select ${step2Form.errors.category ? 'is-invalid' : ''}`}
                                        value={step2Form.data.category}
                                        onChange={(e) => step2Form.setData('category', e.target.value)}
                                    >
                                        <option value="">-- Select Category --</option>
                                        {categories.map((cat) => (
                                            <React.Fragment key={cat.id}>
                                                <option value={cat.id} className="fw-bold">
                                                    {cat.name}
                                                </option>
                                                {cat.sub_categories?.map((sub) => (
                                                    <option key={sub.id} value={sub.id}>
                                                        &nbsp;&nbsp;— {sub.name}
                                                    </option>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </select>
                                    {step2Form.errors.category && (
                                        <div className="invalid-feedback">{step2Form.errors.category}</div>
                                    )}
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label required fw-semibold">Difficulty Level</label>
                                    <select
                                        className={`form-select ${step2Form.errors.level ? 'is-invalid' : ''}`}
                                        value={step2Form.data.level}
                                        onChange={(e) => step2Form.setData('level', e.target.value)}
                                    >
                                        <option value="">-- Select Level --</option>
                                        {levels.map((lvl) => (
                                            <option key={lvl.id} value={lvl.id}>
                                                {lvl.name}
                                            </option>
                                        ))}
                                    </select>
                                    {step2Form.errors.level && (
                                        <div className="invalid-feedback">{step2Form.errors.level}</div>
                                    )}
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label required fw-semibold">Language</label>
                                    <select
                                        className={`form-select ${step2Form.errors.language ? 'is-invalid' : ''}`}
                                        value={step2Form.data.language}
                                        onChange={(e) => step2Form.setData('language', e.target.value)}
                                    >
                                        <option value="">-- Select Language --</option>
                                        {languages.map((lng) => (
                                            <option key={lng.id} value={lng.id}>
                                                {lng.name}
                                            </option>
                                        ))}
                                    </select>
                                    {step2Form.errors.language && (
                                        <div className="invalid-feedback">{step2Form.errors.language}</div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label required fw-semibold">Total Duration (Minutes)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className={`form-control ${step2Form.errors.duration ? 'is-invalid' : ''}`}
                                        placeholder="e.g. 180"
                                        value={step2Form.data.duration}
                                        onChange={(e) => step2Form.setData('duration', e.target.value)}
                                    />
                                    {step2Form.errors.duration && (
                                        <div className="invalid-feedback">{step2Form.errors.duration}</div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Student Capacity (0 for Unlimited)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control"
                                        value={step2Form.data.capacity}
                                        onChange={(e) => step2Form.setData('capacity', e.target.value)}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <div className="form-check form-switch mt-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={step2Form.data.qna === 1}
                                            onChange={(e) =>
                                                step2Form.setData('qna', e.target.checked ? 1 : 0)
                                            }
                                        />
                                        <label className="form-check-label fw-semibold">
                                            Enable Student Q&A Discussion Forum
                                        </label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-check form-switch mt-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={step2Form.data.certificate === 1}
                                            onChange={(e) =>
                                                step2Form.setData('certificate', e.target.checked ? 1 : 0)
                                            }
                                        />
                                        <label className="form-check-label fw-semibold">
                                            Offer Completion Certificate
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-footer bg-white border-top py-3 d-flex justify-content-between">
                            <button
                                type="button"
                                onClick={() => setActiveStep(1)}
                                className="btn btn-outline-secondary"
                            >
                                <i className="fas fa-arrow-left me-1"></i> Back
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary px-4"
                                disabled={step2Form.processing}
                            >
                                {step2Form.processing ? 'Saving...' : 'Save & Proceed to Curriculum'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* STEP 3: CURRICULUM & LESSON BUILDER */}
            {activeStep === 3 && (
                <div className="card border-0 shadow-sm rounded-3">
                    <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="fw-bold mb-0 text-dark">Step 3: Curriculum Builder</h5>
                            <p className="text-muted small mb-0">Organize your course into chapters and video lessons</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setEditingChapter(null);
                                setChapterTitle('');
                                setShowChapterModal(true);
                            }}
                            className="btn btn-primary btn-sm px-3"
                        >
                            <i className="fas fa-plus me-1"></i> Add Chapter
                        </button>
                    </div>

                    <div className="card-body p-4">
                        {course.chapters && course.chapters.length > 0 ? (
                            <div className="d-flex flex-column gap-3">
                                {course.chapters.map((chapter, cIdx) => (
                                    <div key={chapter.id} className="border rounded-3 p-3 bg-white shadow-xs">
                                        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="badge bg-primary-subtle text-primary fw-bold">
                                                    Chapter {cIdx + 1}
                                                </span>
                                                <h6 className="fw-bold mb-0 text-dark">{chapter.title}</h6>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setActiveChapterId(chapter.id);
                                                        setShowLessonModal(true);
                                                    }}
                                                    className="btn btn-sm btn-outline-primary py-1"
                                                >
                                                    <i className="fas fa-plus me-1"></i> Add Lesson
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingChapter(chapter);
                                                        setChapterTitle(chapter.title);
                                                        setShowChapterModal(true);
                                                    }}
                                                    className="btn btn-sm btn-link text-secondary p-1"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteChapter(chapter.id, chapter.title)}
                                                    className="btn btn-sm btn-link text-danger p-1"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>

                                        {/* LESSONS LIST */}
                                        {chapter.lessons && chapter.lessons.length > 0 ? (
                                            <div className="list-group list-group-flush">
                                                {chapter.lessons.map((lesson, lIdx) => (
                                                    <div
                                                        key={lesson.id}
                                                        className="list-group-item d-flex justify-content-between align-items-center px-2 py-2 border-0 bg-light rounded mb-1"
                                                    >
                                                        <div className="d-flex align-items-center gap-3">
                                                            <i className="fas fa-play-circle text-primary fs-5"></i>
                                                            <div>
                                                                <span className="fw-medium text-dark">
                                                                    {lIdx + 1}. {lesson.title}
                                                                </span>
                                                                <span className="badge bg-secondary-subtle text-secondary ms-2 small">
                                                                    {lesson.duration} mins
                                                                </span>
                                                                {lesson.is_preview === 1 && (
                                                                    <span className="badge bg-success-subtle text-success ms-1 small">
                                                                        Free Preview
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                                                            className="btn btn-sm btn-link text-danger p-1"
                                                            title="Delete Lesson"
                                                        >
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted small mb-0 fst-italic">
                                                No lessons in this chapter yet. Click "Add Lesson" to upload or link lectures.
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-5 text-muted">
                                <i className="fas fa-layer-group fs-1 d-block mb-3 opacity-50"></i>
                                <h6>Your curriculum is empty</h6>
                                <p className="small mb-3">Add chapters to structure your video lessons, quizzes, or resources.</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingChapter(null);
                                        setChapterTitle('');
                                        setShowChapterModal(true);
                                    }}
                                    className="btn btn-primary btn-sm px-4"
                                >
                                    <i className="fas fa-plus me-1"></i> Add First Chapter
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="card-footer bg-white border-top py-3 d-flex justify-content-between">
                        <button
                            type="button"
                            onClick={() => setActiveStep(2)}
                            className="btn btn-outline-secondary"
                        >
                            <i className="fas fa-arrow-left me-1"></i> Back
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveStep(4)}
                            className="btn btn-primary px-4"
                        >
                            Proceed to Review & Publish <i className="fas fa-arrow-right ms-1"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 4: REVIEW & PUBLISH */}
            {activeStep === 4 && (
                <div className="card border-0 shadow-sm rounded-3">
                    <div className="card-header bg-white border-bottom py-3">
                        <h5 className="fw-bold mb-0 text-dark">Step 4: Review & Publish Course</h5>
                    </div>
                    <form onSubmit={handleStep4Submit}>
                        <div className="card-body p-4">
                            <div className="row g-4 mb-4">
                                <div className="col-md-4">
                                    <img
                                        src={course.thumbnail ? `/${course.thumbnail}` : '/frontend/assets/images/courses_img_1.jpg'}
                                        alt="Course"
                                        className="img-fluid rounded-3 shadow-sm"
                                        style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="col-md-8">
                                    <h4 className="fw-bold text-dark mb-2">{course.title}</h4>
                                    <p className="text-muted small mb-3">{course.seo_description || course.description?.substring(0, 150)}...</p>

                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                        <span className="badge bg-primary-subtle text-primary">
                                            {course.category?.name || 'Uncategorized'}
                                        </span>
                                        <span className="badge bg-secondary-subtle text-secondary">
                                            {course.course_level?.name || 'All Levels'}
                                        </span>
                                        <span className="badge bg-secondary-subtle text-secondary">
                                            {course.course_language?.name || 'English'}
                                        </span>
                                        <span className="badge bg-success-subtle text-success fw-bold">
                                            {formatCurrency(course.discount ? course.discount : course.price)}
                                        </span>
                                    </div>

                                    <div className="small text-muted">
                                        <strong>Chapters:</strong> {course.chapters?.length || 0} chapters
                                    </div>
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label required fw-semibold">Publish Status</label>
                                    <select
                                        className="form-select"
                                        value={step4Form.data.status}
                                        onChange={(e) => step4Form.setData('status', e.target.value)}
                                    >
                                        <option value="draft">Draft (Private)</option>
                                        <option value="active">Active (Submit for Admin Approval)</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold">Note for Admin Reviewer</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Add any context or instructions for the platform admin approving this course..."
                                        value={step4Form.data.message}
                                        onChange={(e) => step4Form.setData('message', e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="card-footer bg-white border-top py-3 d-flex justify-content-between">
                            <button
                                type="button"
                                onClick={() => setActiveStep(3)}
                                className="btn btn-outline-secondary"
                            >
                                <i className="fas fa-arrow-left me-1"></i> Back
                            </button>
                            <button
                                type="submit"
                                className="btn btn-success px-4 fw-bold"
                                disabled={step4Form.processing}
                            >
                                <i className="fas fa-paper-plane me-1"></i> Submit Course for Review
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* CHAPTER MODAL */}
            {showChapterModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow rounded-3">
                            <div className="modal-header border-bottom">
                                <h5 className="modal-title fw-bold">
                                    {editingChapter ? 'Edit Chapter' : 'Add New Chapter'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowChapterModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleSaveChapter}>
                                <div className="modal-body">
                                    <label className="form-label required fw-semibold">Chapter Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. Introduction & Fundamentals"
                                        value={chapterTitle}
                                        onChange={(e) => setChapterTitle(e.target.value)}
                                        autoFocus
                                        required
                                    />
                                </div>
                                <div className="modal-footer border-top">
                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={() => setShowChapterModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary px-3">
                                        Save Chapter
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* LESSON MODAL */}
            {showLessonModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow rounded-3">
                            <div className="modal-header border-bottom">
                                <h5 className="modal-title fw-bold">Add Lesson to Chapter</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowLessonModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleSaveLesson}>
                                <div className="modal-body">
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label required fw-semibold">Lesson Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="e.g. Setting Up the Development Environment"
                                                value={lessonForm.title}
                                                onChange={(e) =>
                                                    setLessonForm({ ...lessonForm, title: e.target.value })
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label required fw-semibold">Source Provider</label>
                                            <select
                                                className="form-select"
                                                value={lessonForm.source}
                                                onChange={(e) =>
                                                    setLessonForm({ ...lessonForm, source: e.target.value })
                                                }
                                            >
                                                <option value="youtube">YouTube</option>
                                                <option value="vimeo">Vimeo</option>
                                                <option value="external_link">External URL</option>
                                            </select>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label required fw-semibold">Lesson URL</label>
                                            <input
                                                type="url"
                                                className="form-control"
                                                placeholder="https://..."
                                                value={lessonForm.url}
                                                onChange={(e) =>
                                                    setLessonForm({ ...lessonForm, url: e.target.value })
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label required fw-semibold">Duration (Minutes)</label>
                                            <input
                                                type="number"
                                                min="1"
                                                className="form-control"
                                                placeholder="15"
                                                value={lessonForm.duration}
                                                onChange={(e) =>
                                                    setLessonForm({ ...lessonForm, duration: e.target.value })
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-check form-switch mt-4">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={lessonForm.is_preview === 1}
                                                    onChange={(e) =>
                                                        setLessonForm({
                                                            ...lessonForm,
                                                            is_preview: e.target.checked ? 1 : 0,
                                                        })
                                                    }
                                                />
                                                <label className="form-check-label fw-semibold">
                                                    Allow Free Preview (Sample)
                                                </label>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label required fw-semibold">Lesson Notes / Summary</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                placeholder="Brief summary or lecture notes..."
                                                value={lessonForm.description}
                                                onChange={(e) =>
                                                    setLessonForm({ ...lessonForm, description: e.target.value })
                                                }
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-top">
                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={() => setShowLessonModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary px-3">
                                        Save Lesson
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </InstructorLayout>
    );
}
