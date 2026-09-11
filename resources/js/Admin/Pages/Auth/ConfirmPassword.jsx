import React from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { route } from '@/Utils/routes';

export default function ConfirmPassword() {
    const { props } = usePage();
    const settings = props?.settings || {};

    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="page page-center">
            <Head title="Confirm Password - Admin" />
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
                        <h2 className="h2 text-center mb-3">Confirm Password</h2>
                        <p className="text-muted text-center mb-4">
                            This is a secure area of the application. Please confirm your password before continuing.
                        </p>

                        <form onSubmit={submit}>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    placeholder="Your password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoFocus
                                    required
                                />
                                {errors.password && (
                                    <div className="invalid-feedback">{errors.password}</div>
                                )}
                            </div>

                            <div className="form-footer">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={processing}
                                >
                                    Confirm Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
