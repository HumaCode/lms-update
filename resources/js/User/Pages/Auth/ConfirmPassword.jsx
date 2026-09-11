import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Confirm Password - EduCore" />

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
                                alt="confirm password"
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
                                    <form onSubmit={submit}>
                                        <h2>Confirm Password<span>!</span></h2>
                                        <p className="new_user">
                                            This is a secure area of the application. Please confirm your password before continuing.
                                        </p>

                                        <div className="row">
                                            <div className="col-xl-12">
                                                <div className="wsus__login_form_input">
                                                    <label>Password *</label>
                                                    <input
                                                        type="password"
                                                        value={data.password}
                                                        onChange={(e) => setData('password', e.target.value)}
                                                        placeholder="Password"
                                                        required
                                                        autoFocus
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
                                                    <button
                                                        type="submit"
                                                        className="common_btn"
                                                        disabled={processing}
                                                    >
                                                        {processing ? 'Confirming...' : 'Confirm'}
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
