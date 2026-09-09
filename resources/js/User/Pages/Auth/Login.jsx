import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Sign In - EduCore" />

            {/* SIGN IN SECTION */}
            <section
                className="wsus__sign_in"
                style={{
                    marginTop: 0,
                    minHeight: '100vh',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div
                    className="row align-items-center"
                    style={{ minHeight: '100vh', margin: 0 }}
                >
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
                                alt="login"
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
                                <div
                                    className="tab-pane fade show active"
                                    id="pills-home"
                                    role="tabpanel"
                                    tabIndex="0"
                                >
                                    <form onSubmit={submit}>
                                        <h2>
                                            Log in<span>!</span>
                                        </h2>
                                        <p className="new_user">
                                            Welcome Back, please provide your credentials for login
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
                                                    <label>
                                                        Password*{' '}
                                                        <Link href={route('password.request')}>
                                                            Forgot Password?
                                                        </Link>
                                                    </label>
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
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            checked={data.remember}
                                                            onChange={(e) =>
                                                                setData('remember', e.target.checked)
                                                            }
                                                            id="flexCheckDefault"
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="flexCheckDefault"
                                                        >
                                                            Remember Me
                                                        </label>
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        className="common_btn"
                                                        disabled={processing}
                                                    >
                                                        {processing ? 'Signing In...' : 'Sign In'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>

                                    <p className="create_account">
                                        Don't have an account?{' '}
                                        <Link href={route('register')}>Create free account</Link>
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
