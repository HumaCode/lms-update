import React from 'react';
import { Link } from '@inertiajs/react';

export default function BecomeInstructorSection({ becomeInstructorBanner }) {
    if (!becomeInstructorBanner) return null;

    return (
        <section className="wsus__become_instructor mt_120 xs_mt_100">
            <div className="container">
                <div className="row justify-content-between align-items-center">
                    <div className="col-xl-6 col-md-6 wow fadeInLeft">
                        <div className="wsus__become_instructor_text">
                            <div className="wsus__section_heading heading_left mb_20">
                                <h5>Become An Instructor</h5>
                                <h2>
                                    {becomeInstructorBanner.title ||
                                        'Be a Member & Share Your Knowledge.'}
                                </h2>
                            </div>
                            <p>
                                {becomeInstructorBanner.subtitle ||
                                    'LMS allows administrators and instructors to create, organize, and deliver courses. This includes uploading course content, managing materials, and setting assessments.'}
                            </p>
                            <Link
                                className="common_btn"
                                href={
                                    becomeInstructorBanner.button_url ||
                                    route('student.become-instructor')
                                }
                            >
                                {becomeInstructorBanner.button_text || 'Become An Instructor'}{' '}
                                <i className="far fa-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                    <div className="col-xl-5 col-md-6 wow fadeInRight">
                        <div className="wsus__become_instructor_img" style={{ height: 'auto' }}>
                            <img
                                src={
                                    becomeInstructorBanner.become_instructor_image ||
                                    (becomeInstructorBanner.image ? `/${becomeInstructorBanner.image}` : '/frontend/assets/images/become_instructor_img.png')
                                }
                                alt="Instructor"
                                className="img-fluid w-100"
                                style={{ maxHeight: '490px', objectFit: 'contain' }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/frontend/assets/images/become_instructor_img.png';
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
