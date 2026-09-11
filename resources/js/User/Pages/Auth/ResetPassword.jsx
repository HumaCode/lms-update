import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email, status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token || '',
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Reset Password - EduCore" />

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
                                src="/frontend/assets/images/login_img_1.jpg"
                                alt="reset password"
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
                            <div className="tab-content" id="pills-tabContent">
                                <div className="tab-pane fade show active">
                                    <form onSubmit={submit}>
                                        <h2>
                                            Reset Password<span>!</span>
                                        </h2>
                                        <p className="new_user">
                                            Please provide your email and your new password below.
                                        </p>

                                        {status && (
                                            <div className="alert alert-success small py-2 mb-3">
                                                {status}
                                            </div>
                                        )}

                                        <div className="row">
                                            <div className="col-xl-12">
                                                <div className="wsus__login_form_input">
                                                    <label>Email *</label>
                                                    <input
                                                        type="email"
                                                        value={data.email}
                                                        onChange={(e) => setData('email', e.target.value)}
                                                        placeholder="Email"
                                                        required
                                                    />
                                                    {errors.email && (
                                                        <span className="text-danger small mt-1 d-block">
                                                            {errors.email}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="col-xl-12">
                                                <div className="wsus__login_form_input">
                                                    <label>New Password *</label>
                                                    <input
                                                        type="password"
                                                        value={data.password}
                                                        onChange={(e) => setData('password', e.target.value)}
                                                        placeholder="Password"
                                                        required
                                                    />
                                                    {errors.password && (
                                                        <span className="text-danger small mt-1 d-block">
                                                            {errors.password}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="col-xl-12">
                                                <div className="wsus__login_form_input">
                                                    <label>Confirm Password *</label>
                                                    <input
                                                        type="password"
                                                        value={data.password_confirmation}
                                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                                        placeholder="Confirm Password"
                                                        required
                                                    />
                                                    {errors.password_confirmation && (
                                                        <span className="text-danger small mt-1 d-block">
                                                            {errors.password_confirmation}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="col-xl-12">
                                                <div className="wsus__login_form_input">
                                                    <button
                                                        type="submit"
                                                        className="common_btn"
                                                        disabled={processing}
                                                    >
                                                        {processing ? 'Resetting...' : 'Reset Password'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
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
