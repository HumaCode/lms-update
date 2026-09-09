import React from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '../../Layouts/UserLayout';

export default function AboutIndex({ about, counter, testimonials = [], blogs = [] }) {
    return (
        <UserLayout>
            <Head title="About Us - EduCore" />

            {/* Breadcrumb */}
            <section
                className="wsus__breadcrumb"
                style={{
                    background: 'url(/frontend/assets/images/breadcrumb_bg.jpg) no-repeat center/cover',
                    padding: '50px 0',
                }}
            >
                <div className="container text-center text-white">
                    <h2 className="fw-bold mb-2">About EduCore</h2>
                    <ul className="d-flex justify-content-center list-unstyled mb-0 gap-2 small">
                        <li><Link href={route('home')} className="text-white-50 text-decoration-none">Home</Link></li>
                        <li>/</li>
                        <li className="text-white">About Us</li>
                    </ul>
                </div>
            </section>

            {/* About Info Section */}
            <section className="about_section py-5 bg-white">
                <div className="container py-4">
                    <div className="row align-items-center gy-4">
                        <div className="col-lg-6">
                            <span className="text-primary fw-bold text-uppercase small">Empowering Futures</span>
                            <h2 className="display-6 fw-bold text-dark mb-4">
                                {about?.title || 'World-class learning experience accessible to everyone.'}
                            </h2>
                            <div
                                className="text-muted lh-lg mb-4"
                                dangerouslySetInnerHTML={{ __html: about?.description || '<p>EduCore is dedicated to providing high-quality digital education and skill certifications from industry professionals.</p>' }}
                            />
                            <Link href={route('courses.index')} className="btn btn-primary px-4 shadow-sm">
                                Explore Courses <i className="fas fa-arrow-right ms-2"></i>
                            </Link>
                        </div>
                        <div className="col-lg-6 text-center">
                            <img
                                src={about?.image ? `/${about.image}` : '/frontend/assets/images/about_img_1.jpg'}
                                alt="About EduCore"
                                className="img-fluid rounded-4 shadow-lg"
                                style={{ maxHeight: '420px', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/frontend/assets/images/about_img.png';
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Counter Stats Section */}
            {counter && (
                <section className="counter_section py-5 bg-primary text-white">
                    <div className="container">
                        <div className="row text-center gy-4">
                            <div className="col-sm-3">
                                <h2 className="display-5 fw-bold mb-1">{counter.counter_one || '45k+'}</h2>
                                <p className="mb-0 text-white-50">{counter.title_one || 'Active Students'}</p>
                            </div>
                            <div className="col-sm-3">
                                <h2 className="display-5 fw-bold mb-1">{counter.counter_two || '1,200+'}</h2>
                                <p className="mb-0 text-white-50">{counter.title_two || 'Instructors'}</p>
                            </div>
                            <div className="col-sm-3">
                                <h2 className="display-5 fw-bold mb-1">{counter.counter_three || '25k+'}</h2>
                                <p className="mb-0 text-white-50">{counter.title_three || 'Enrolled Courses'}</p>
                            </div>
                            <div className="col-sm-3">
                                <h2 className="display-5 fw-bold mb-1">{counter.counter_four || '99%'}</h2>
                                <p className="mb-0 text-white-50">{counter.title_four || 'Satisfaction Rate'}</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </UserLayout>
    );
}
