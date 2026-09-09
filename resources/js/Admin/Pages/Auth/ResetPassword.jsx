import React, { useState } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { route } from '@/Utils/routes';
import { useFlashNotification } from '@/Hooks/useFlashNotification';

export default function ResetPassword({ token, email }) {
    useFlashNotification();
    const { props } = usePage();
    const settings = props?.settings || {};

    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token || '',
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="page page-center">
            <Head title="Reset Password" />
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

                <div className="card card-md">
                    <div className="card-body">
                        <h2 className="h2 text-center mb-4">Set New Password</h2>
                        <form onSubmit={submit}>
                            <div className="mb-3">
                                <label className="form-label">Email address</label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && (
                                    <div className="invalid-feedback">{errors.email}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">New Password</label>
                                <div className="input-group input-group-flat">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
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

                            <div className="mb-3">
                                <label className="form-label">Confirm Password</label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                {errors.password_confirmation && (
                                    <div className="invalid-feedback">{errors.password_confirmation}</div>
                                )}
                            </div>

                            <div className="form-footer">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={processing}
                                >
                                    {processing ? 'Resetting password...' : 'Reset Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
