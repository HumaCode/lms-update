import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const [activeTab, setActiveTab] = useState('student');

    const studentForm = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const instructorForm = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        document: null,
    });

    const submitStudent = (e) => {
        e.preventDefault();
        studentForm.post(route('register', { type: 'student' }), {
            onFinish: () => studentForm.reset('password', 'password_confirmation'),
        });
    };

    const submitInstructor = (e) => {
        e.preventDefault();
        instructorForm.post(route('register', { type: 'instructor' }), {
            onFinish: () => instructorForm.reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Sign Up - EduCore" />

            <section
                className="wsus__sign_in"
                style={{
                    marginTop: 0,
                    minHeight: '100vh',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div className="row align-items-center" style={{ minHeight: '100vh', margin: 0 }}>
                    <div className="col-xxl-5 col-xl-6 col-lg-6 wow fadeInLeft p-0">
                        <div
                            className="wsus__sign_img"
                            style={{
                                height: '100vh',
                                width: '100%',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            <img
                                src="/frontend/assets/images/login_img_2.jpg"
                                alt="register"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                }}
                            />
                            <Link
                                href={route('home')}
                                style={{
                                    position: 'absolute',
                                    top: '40px',
                                    left: '40px',
                                    zIndex: 2,
                                }}
                            >
                                <img
                                    src="/frontend/assets/images/logo.png"
                                    alt="EduCore"
                                    className="img-fluid"
                                />
                            </Link>
                        </div>
                    </div>
                    <div className="col-xxl-4 col-xl-5 col-lg-6 col-md-9 m-auto wow fadeInRight py-4">
                        <div className="wsus__sign_form_area">
                            <ul className="nav nav-pills mb-4" id="pills-tab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${activeTab === 'student' ? 'active' : ''}`}
                                        type="button"
                                        onClick={() => setActiveTab('student')}
                                    >
                                        Student Sign Up
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${activeTab === 'instructor' ? 'active' : ''}`}
                                        type="button"
                                        onClick={() => setActiveTab('instructor')}
                                    >
                                        Instructor Sign Up
                                    </button>
                                </li>
                            </ul>

                            <div className="tab-content" id="pills-tabContent">
                                {activeTab === 'student' && (
                                    <div className="tab-pane fade show active">
                                        <form onSubmit={submitStudent}>
                                            <h2>
                                                Sign Up<span>!</span>
                                            </h2>
                                            <p className="new_user">
                                                Already have an account?{' '}
                                                <Link href={route('login')}>Sign In</Link>
                                            </p>
                                            <div className="row">
                                                <div className="col-xl-12">
                                                    <div className="wsus__login_form_input">
                                                        <label>Name</label>
                                                        <input
                                                            type="text"
                                                            placeholder="First name"
                                                            value={studentForm.data.name}
                                                            onChange={(e) => studentForm.setData('name', e.target.value)}
                                                            required
                                                        />
                                                        {studentForm.errors.name && (
                                                            <span className="text-danger small mt-1 d-block">
                                                                {studentForm.errors.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-xl-12">
                                                    <div className="wsus__login_form_input">
                                                        <label>Username</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Username"
                                                            value={studentForm.data.username}
                                                            onChange={(e) => studentForm.setData('username', e.target.value)}
                                                            required
                                                        />
                                                        {studentForm.errors.username && (
                                                            <span className="text-danger small mt-1 d-block">
                                                                {studentForm.errors.username}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-xl-12">
                                                    <div className="wsus__login_form_input">
                                                        <label>Your email</label>
                                                        <input
                                                            type="email"
                                                            placeholder="Your email"
                                                            value={studentForm.data.email}
                                                            onChange={(e) => studentForm.setData('email', e.target.value)}
                                                            required
                                                        />
                                                        {studentForm.errors.email && (
                                                            <span className="text-danger small mt-1 d-block">
                                                                {studentForm.errors.email}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-xl-12">
                                                    <div className="wsus__login_form_input">
                                                        <label>Password</label>
                                                        <input
                                                            type="password"
                                                            placeholder="Your password"
                                                            value={studentForm.data.password}
                                                            onChange={(e) => studentForm.setData('password', e.target.value)}
                                                            required
                                                        />
                                                        {studentForm.errors.password && (
                                                            <span className="text-danger small mt-1 d-block">
                                                                {studentForm.errors.password}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-xl-12">
                                                    <div className="wsus__login_form_input">
                                                        <label>Confirm Password</label>
                                                        <input
                                                            type="password"
                                                            placeholder="Confirm password"
                                                            value={studentForm.data.password_confirmation}
                                                            onChange={(e) => studentForm.setData('password_confirmation', e.target.value)}
                                                            required
                                                        />
                                                        {studentForm.errors.password_confirmation && (
                                                            <span className="text-danger small mt-1 d-block">
                                                                {studentForm.errors.password_confirmation}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-xl-12">
                                                    <div className="wsus__login_form_input">
                                                        <button
                                                            type="submit"
                                                            className="common_btn"
                                                            disabled={studentForm.processing}
                                                        >
                                                            {studentForm.processing ? 'Signing Up...' : 'Sign Up'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {activeTab === 'instructor' && (
                                    <div className="tab-pane fade show active">
                                        <form onSubmit={submitInstructor} encType="multipart/form-data">
                                            <h2>
                                                Instructor Sign Up<span>!</span>
                                            </h2>
                                            <p className="new_user">
                                                Already have an account?{' '}
                                                <Link href={route('login')}>Sign In</Link>
                                            </p>
                                            <div className="row">
                                                <div className="col-xl-12">
                                                    <div className="wsus__login_form_input">
                                                        <label>Name</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Name"
                                                            value={instructorForm.data.name}
                                                            onChange={(e) => instructorForm.setData('name', e.target.value)}
                                                            required
                                                        />
                                                        {instructorForm.errors.name && (
                                                            <span className="text-danger small mt-1 d-block">
                                                                {instructorForm.errors.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-xl-12">
                                                    <div className="wsus__login_form_input">
                                                        <label>Username</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Username"
                                                            value={instructorForm.data.username}
                                                            onChange={(e) => instructorForm.setData('username', e.target.value)}
                                                            required
                                                        />
                                                        {instructorForm.errors.username && (
                                                            <span className="text-danger small mt-1 d-block">
                                                                {instructorForm.errors.username}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-xl-12">
                                                    <div className="wsus__login_form_input">
                                                        <label>Your email</label>
                                                        <input
                                                            type="email"
                                                            placeholder="Your email"
                                                            value={instructorForm.data.email}
                                                            onChange={(e) => instructorForm.setData('email', e.target.value)}
                                                            required
                                                        />
                                                        {instructorForm.errors.email && (
                                                            <span className="text-danger small mt-1 d-block">
                                                                {instructorForm.errors.email}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-xl-12">
                                                    <div className="wsus__login_form_input">
                                                        <label>Document (Education/Certificate)</label>
                                                        <input
                                                            type="file"
                                                            onChange={(e) => instructorForm.setData('document', e.target.files[0])}
                                                            required
                                                        />
                                                        {instructorForm.errors.document && (
                                                            <span className="text-danger small mt-1 d-block">
                                                                {instructorForm.errors.document}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-xl-12">
                                                    <div className="wsus__login_form_input">
                                                        <label>Password</label>
                                                        <input
                                                            type="password"
                                                            placeholder="Your password"
                                                            value={instructorForm.data.password}
                                                            onChange={(e) => instructorForm.setData('password', e.target.value)}
                                                            required
                                                        />
                                                        {instructorForm.errors.password && (
                                                            <span className="text-danger small mt-1 d-block">
                                                                {instructorForm.errors.password}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-xl-12">
                                                    <div className="wsus__login_form_input">
                                                        <label>Confirm Password</label>
                                                        <input
                                                            type="password"
                                                            placeholder="Confirm password"
                                                            value={instructorForm.data.password_confirmation}
                                                            onChange={(e) => instructorForm.setData('password_confirmation', e.target.value)}
                                                            required
                                                        />
                                                        {instructorForm.errors.password_confirmation && (
                                                            <span className="text-danger small mt-1 d-block">
                                                                {instructorForm.errors.password_confirmation}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-xl-12">
                                                    <div className="wsus__login_form_input">
                                                        <button
                                                            type="submit"
                                                            className="common_btn"
                                                            disabled={instructorForm.processing}
                                                        >
                                                            {instructorForm.processing ? 'Signing Up...' : 'Sign Up'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <Link
                    className="back_btn"
                    href={route('home')}
                    style={{
                        position: 'absolute',
                        top: '40px',
                        right: '40px',
                        zIndex: 2,
                    }}
                >
                    Back to Home
                </Link>
            </section>
        </>
    );
}
