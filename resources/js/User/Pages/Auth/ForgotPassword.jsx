import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password - EduCore" />

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
                                alt="forgot password"
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
                                            Forgot Password<span>!</span>
                                        </h2>
                                        <p className="new_user">
                                            Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.
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
                                                    <button
                                                        type="submit"
                                                        className="common_btn"
                                                        disabled={processing}
                                                    >
                                                        {processing ? 'Sending...' : 'Email Password Reset Link'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>

                                    <p className="create_account">
                                        Remember your password?{' '}
                                        <Link href={route('login')}>Sign In</Link>
                                    </p>
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
