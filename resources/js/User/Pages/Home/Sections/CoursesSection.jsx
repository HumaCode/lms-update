import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import CourseCard from '@/User/Components/CourseCard';

export default function CoursesSection({ latestCourseCategories = [] }) {
    if (!latestCourseCategories || latestCourseCategories.length === 0) return null;

    const [activeCatId, setActiveCatId] = useState(latestCourseCategories[0]?.id);
    const activeCategory = latestCourseCategories.find((c) => c.id === activeCatId) || latestCourseCategories[0];

    return (
        <section className="wsus__courses_3 pt_120 xs_pt_100 mt_120 xs_mt_90 pb_120 xs_pb_100">
            <div className="container">
                <div className="row">
                    <div className="col-xl-6 m-auto wow fadeInUp">
                        <div className="wsus__section_heading mb_45">
                            <h5>Featured Courses</h5>
                            <h2>Latest Bundle Courses.</h2>
                        </div>
                    </div>
                </div>

                <div className="row wow fadeInUp">
                    <div className="col-12 text-center">
                        <div className="wsus__filter_area mb_30">
                            <ul className="nav nav-pills justify-content-center" role="tablist">
                                {latestCourseCategories.map((cat) => (
                                    <li className="nav-item" role="presentation" key={cat.id}>
                                        <button
                                            className={`nav-link ${activeCatId === cat.id ? 'active' : ''}`}
                                            type="button"
                                            onClick={() => setActiveCatId(cat.id)}
                                        >
                                            {cat.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="tab-content">
                    <div className="tab-pane fade show active">
                        <div className="row">
                            {activeCategory?.courses && activeCategory.courses.length > 0 ? (
                                activeCategory.courses.map((course) => (
                                    <div className="col-xl-3 col-md-6 col-lg-4 mt-4" key={course.id}>
                                        <CourseCard course={course} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center py-5">
                                    <div
                                        className="d-inline-flex flex-column align-items-center justify-content-center p-4 p-md-5 my-3"
                                        style={{
                                            background: '#ffffff',
                                            borderRadius: '16px',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.04)',
                                            maxWidth: '480px',
                                            width: '100%',
                                        }}
                                    >
                                        <div
                                            className="d-flex align-items-center justify-content-center mb-3"
                                            style={{
                                                width: '72px',
                                                height: '72px',
                                                borderRadius: '50%',
                                                background: '#eff6ff',
                                                color: '#2563eb',
                                                fontSize: '28px',
                                            }}
                                        >
                                            <i className="fas fa-folder-open"></i>
                                        </div>
                                        <h5 className="fw-bold text-dark mb-2" style={{ fontSize: '18px' }}>
                                            No Courses Available Yet
                                        </h5>
                                        <p className="text-muted mb-0" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                            We couldn't find any courses under{' '}
                                            <strong className="text-dark">{activeCategory?.name || 'this category'}</strong>{' '}
                                            at the moment. Check back soon or explore other categories!
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="row mt_60 wow fadeInUp">
                            <div className="col-12 text-center">
                                <Link className="common_btn" href={route('courses.index')}>
                                    Browse More Courses <i className="fas fa-angle-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
