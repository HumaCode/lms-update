import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <>
            <Head title="Email Verification - EduCore" />

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
                                alt="verify email"
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
                            <div className="tab-content">
                                <div className="tab-pane fade show active">
                                    <h2>Verify Email<span>!</span></h2>
                                    <p className="new_user">
                                        Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.
                                    </p>

                                    {status === 'verification-link-sent' && (
                                        <div className="alert alert-success small py-2 mb-3">
                                            A new verification link has been sent to the email address you provided during registration.
                                        </div>
                                    )}

                                    <form onSubmit={submit}>
                                        <div className="d-flex align-items-center justify-content-between mt-4">
                                            <button
                                                type="submit"
                                                className="common_btn"
                                                disabled={processing}
                                            >
                                                {processing ? 'Sending...' : 'Resend Verification Email'}
                                            </button>

                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="btn btn-link text-muted"
                                            >
                                                Log Out
                                            </Link>
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
