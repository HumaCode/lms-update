import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { route } from '@/Utils/routes';
import { useFlashNotification } from '@/Hooks/useFlashNotification';

export default function Login({ status }) {
    useFlashNotification();
    const { props } = usePage();
    const settings = props?.settings || {};

    useEffect(() => {
        document.documentElement.classList.remove('has-custom-pointer');
        document.body.classList.remove('has-custom-pointer');
        document.documentElement.style.cursor = 'default';
        document.body.style.cursor = 'default';

        const dot = document.getElementById('pointer-dot');
        if (dot) dot.remove();
        const ring = document.getElementById('pointer-ring');
        if (ring) ring.remove();

        return () => {
            document.documentElement.style.cursor = '';
            document.body.style.cursor = '';
        };
    }, []);

    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.login.store'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="page page-center">
            <Head title="Admin Login" />
            <div className="container container-tight py-4">
                <div className="text-center mb-4">
                    <Link href="/" className="navbar-brand navbar-brand-autodark">
                        <img
                            src={settings?.site_logo || '/default-files/logo.png'}
                            height="36"
                            alt="Logo"
                            className="navbar-brand-image"
                        />
                    </Link>
                </div>

                {status && (
                    <div className="alert alert-success" role="alert">
                        {status}
                    </div>
                )}

                <div className="card card-md">
                    <div className="card-body">
                        <h2 className="h2 text-center mb-4">Login to Admin Portal</h2>
                        <form onSubmit={submit} autoComplete="off">
                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                    placeholder="username"
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                    autoFocus
                                    required
                                />
                                {errors.username && (
                                    <div className="invalid-feedback">{errors.username}</div>
                                )}
                            </div>

                            <div className="mb-2">
                                <label className="form-label">
                                    Password
                                    <span className="form-label-description">
                                        <Link href={route('admin.password.request')}>
                                            I forgot password
                                        </Link>
                                    </span>
                                </label>
                                <div className="input-group input-group-flat">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        placeholder="Your password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <span className="input-group-text">
                                        <button
                                            type="button"
                                            className="btn btn-link link-secondary p-0"
                                            onClick={() => setShowPassword(!showPassword)}
                                            tabIndex="-1"
                                        >
                                            <i className={`ti ${showPassword ? 'ti-eye-off' : 'ti-eye'}`}></i>
                                        </button>
                                    </span>
                                </div>
                                {errors.password && (
                                    <div className="invalid-feedback d-block">{errors.password}</div>
                                )}
                            </div>

                            <div className="mb-2">
                                <label className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <span className="form-check-label">Remember me on this device</span>
                                </label>
                            </div>

                            <div className="form-footer">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Signing in...
                                        </>
                                    ) : (
                                        'Sign in'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
