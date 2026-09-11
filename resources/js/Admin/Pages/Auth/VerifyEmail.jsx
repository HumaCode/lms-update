import React from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { route } from '@/Utils/routes';

export default function VerifyEmail({ status }) {
    const { props } = usePage();
    const settings = props?.settings || {};

    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.verification.send'));
    };

    return (
        <div className="page page-center">
            <Head title="Verify Email - Admin" />
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
                        <h2 className="h2 text-center mb-3">Verify Email Address</h2>
                        <p className="text-muted text-center mb-4">
                            Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you?
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="alert alert-success" role="alert">
                                A new verification link has been sent to the email address you provided during registration.
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div className="d-flex align-items-center justify-content-between">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={processing}
                                >
                                    Resend Verification Email
                                </button>

                                <Link
                                    href={route('admin.logout')}
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
    );
}
