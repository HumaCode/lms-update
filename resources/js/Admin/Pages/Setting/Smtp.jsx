import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import SettingSidebar from './Components/SettingSidebar';
import { route } from '@/Utils/routes';

export default function Smtp({ settings = {} }) {
    const { data, setData, post, processing, errors } = useForm({
        sender_email: settings.sender_email || '',
        receiver_email: settings.receiver_email || '',
        mail_mailer: settings.mail_mailer || 'smtp',
        mail_host: settings.mail_host || '',
        mail_port: settings.mail_port || 587,
        mail_username: settings.mail_username || '',
        mail_password: settings.mail_password || '',
        mail_encryption: settings.mail_encryption || 'tls',
        mail_queue: settings.mail_queue ? 1 : 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.smtp-settings.update'));
    };

    return (
        <AdminLayout>
            <Head title="SMTP Mail Settings" />

            <PageHeader
                title="Settings"
                breadcrumbs={[
                    { label: 'Dashboard', url: route('admin.dashboard') },
                    { label: 'SMTP Settings' },
                ]}
            />

            <div className="card">
                <div className="row g-0">
                    <SettingSidebar />

                    <div className="col-12 col-md-9 d-flex flex-column">
                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <h3 className="card-title mb-4">SMTP Email Configuration</h3>

                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label required">Sender Email (From)</label>
                                        <input
                                            type="email"
                                            className={`form-control ${errors.sender_email ? 'is-invalid' : ''}`}
                                            value={data.sender_email}
                                            onChange={(e) => setData('sender_email', e.target.value)}
                                        />
                                        {errors.sender_email && <div className="invalid-feedback">{errors.sender_email}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label required">Receiver / Admin Email</label>
                                        <input
                                            type="email"
                                            className={`form-control ${errors.receiver_email ? 'is-invalid' : ''}`}
                                            value={data.receiver_email}
                                            onChange={(e) => setData('receiver_email', e.target.value)}
                                        />
                                        {errors.receiver_email && <div className="invalid-feedback">{errors.receiver_email}</div>}
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label required">Mail Driver / Mailer</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.mail_mailer ? 'is-invalid' : ''}`}
                                            value={data.mail_mailer}
                                            onChange={(e) => setData('mail_mailer', e.target.value)}
                                        />
                                        {errors.mail_mailer && <div className="invalid-feedback">{errors.mail_mailer}</div>}
                                    </div>

                                    <div className="col-md-5">
                                        <label className="form-label required">SMTP Host</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.mail_host ? 'is-invalid' : ''}`}
                                            placeholder="smtp.mailtrap.io"
                                            value={data.mail_host}
                                            onChange={(e) => setData('mail_host', e.target.value)}
                                        />
                                        {errors.mail_host && <div className="invalid-feedback">{errors.mail_host}</div>}
                                    </div>

                                    <div className="col-md-3">
                                        <label className="form-label required">Port</label>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.mail_port ? 'is-invalid' : ''}`}
                                            value={data.mail_port}
                                            onChange={(e) => setData('mail_port', e.target.value)}
                                        />
                                        {errors.mail_port && <div className="invalid-feedback">{errors.mail_port}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label required">SMTP Username</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.mail_username ? 'is-invalid' : ''}`}
                                            value={data.mail_username}
                                            onChange={(e) => setData('mail_username', e.target.value)}
                                        />
                                        {errors.mail_username && <div className="invalid-feedback">{errors.mail_username}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label required">SMTP Password</label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.mail_password ? 'is-invalid' : ''}`}
                                            value={data.mail_password}
                                            onChange={(e) => setData('mail_password', e.target.value)}
                                        />
                                        {errors.mail_password && <div className="invalid-feedback">{errors.mail_password}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label required">Encryption</label>
                                        <select
                                            className={`form-select ${errors.mail_encryption ? 'is-invalid' : ''}`}
                                            value={data.mail_encryption}
                                            onChange={(e) => setData('mail_encryption', e.target.value)}
                                        >
                                            <option value="tls">TLS</option>
                                            <option value="ssl">SSL</option>
                                            <option value="null">None</option>
                                        </select>
                                        {errors.mail_encryption && <div className="invalid-feedback">{errors.mail_encryption}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Queue Email Dispatch</label>
                                        <label className="form-check form-switch mt-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={data.mail_queue === 1}
                                                onChange={(e) => setData('mail_queue', e.target.checked ? 1 : 0)}
                                            />
                                            <span className="form-check-label">Send Emails via Background Queue</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer bg-transparent text-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={processing}
                                >
                                    {processing ? 'Saving...' : 'Save Mail Settings'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
