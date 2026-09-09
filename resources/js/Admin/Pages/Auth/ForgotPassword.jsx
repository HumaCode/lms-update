import React from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { route } from '@/Utils/routes';
import { useFlashNotification } from '@/Hooks/useFlashNotification';

export default function ForgotPassword({ status }) {
    useFlashNotification();
    const { props } = usePage();
    const settings = props?.settings || {};

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.password.email'));
    };

    return (
        <div className="page page-center">
            <Head title="Forgot Password" />
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
                        <h2 className="h2 text-center mb-4">Forgot Password</h2>
                        <p className="text-secondary mb-4">
                            Forgot your password? No problem. Just enter your email address and we will email you a password reset link.
                        </p>
                        <form onSubmit={submit}>
                            <div className="mb-3">
                                <label className="form-label">Email address</label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    placeholder="your@email.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    autoFocus
                                    required
                                />
                                {errors.email && (
                                    <div className="invalid-feedback">{errors.email}</div>
                                )}
                            </div>

                            <div className="form-footer">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={processing}
                                >
                                    {processing ? 'Sending link...' : 'Email Password Reset Link'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="text-center text-secondary mt-3">
                    Forget it, <Link href={route('admin.login')}>send me back</Link> to the sign in screen.
                </div>
            </div>
        </div>
    );
}
