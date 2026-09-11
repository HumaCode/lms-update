import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import InstructorLayout from '@/Instructor/Layouts/InstructorLayout';
import { route } from '@/Utils/routes';

export default function Index({ profile = {}, gateways = [] }) {
    const [activeTab, setActiveTab] = useState('personal');

    // 1. Personal Info Form
    const [personalData, setPersonalData] = useState({
        name: profile.name || '',
        heading: profile.headline || '',
        email: profile.email || '',
        gender: profile.gender || '',
        about: profile.bio || '',
        avatar: null,
    });
    const [avatarPreview, setAvatarPreview] = useState(
        profile.image ? `/${profile.image}` : null
    );
    const [personalProcessing, setPersonalProcessing] = useState(false);
    const [personalErrors, setPersonalErrors] = useState({});

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPersonalData((prev) => ({ ...prev, avatar: file }));
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handlePersonalSubmit = (e) => {
        e.preventDefault();
        setPersonalProcessing(true);
        router.post(route('instructor.profile.update'), personalData, {
            forceFormData: true,
            onError: (errs) => {
                setPersonalErrors(errs);
                setPersonalProcessing(false);
            },
            onSuccess: () => {
                setPersonalErrors({});
                setPersonalProcessing(false);
            },
            onFinish: () => setPersonalProcessing(false),
        });
    };

    // 2. Password Form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.post(route('instructor.profile.update-password'), {
            onSuccess: () => passwordForm.reset(),
        });
    };

    // 3. Social Links Form
    const socialForm = useForm({
        facebook: profile.facebook || '',
        x: profile.x || '',
        linkedin: profile.linkedin || '',
        website: profile.website || '',
    });

    const handleSocialSubmit = (e) => {
        e.preventDefault();
        socialForm.post(route('instructor.profile.update-social'));
    };

    // 4. Payout Info Form
    const payoutForm = useForm({
        gateway: profile.gateway_info?.gateway || '',
        information: profile.gateway_info?.information || '',
    });

    const handlePayoutSubmit = (e) => {
        e.preventDefault();
        payoutForm.post(route('instructor.profile.update-gateway-info'));
    };

    return (
        <InstructorLayout
            title="Instructor Profile"
            crumbs={[{ label: 'Profile Settings' }]}
        >
            <Head title="Instructor Profile" />

            <div className="card border-0 shadow-sm rounded-3">
                <div className="card-header bg-white border-bottom p-0">
                    <ul className="nav nav-tabs border-0 px-3 pt-2" role="tablist">
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 border-bottom border-2 fw-semibold py-3 px-4 ${
                                    activeTab === 'personal'
                                        ? 'border-primary text-primary active'
                                        : 'border-transparent text-secondary'
                                }`}
                                onClick={() => setActiveTab('personal')}
                                type="button"
                            >
                                <i className="fas fa-user me-2"></i>Personal Info
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 border-bottom border-2 fw-semibold py-3 px-4 ${
                                    activeTab === 'password'
                                        ? 'border-primary text-primary active'
                                        : 'border-transparent text-secondary'
                                }`}
                                onClick={() => setActiveTab('password')}
                                type="button"
                            >
                                <i className="fas fa-lock me-2"></i>Change Password
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 border-bottom border-2 fw-semibold py-3 px-4 ${
                                    activeTab === 'social'
                                        ? 'border-primary text-primary active'
                                        : 'border-transparent text-secondary'
                                }`}
                                onClick={() => setActiveTab('social')}
                                type="button"
                            >
                                <i className="fas fa-share-alt me-2"></i>Social Profiles
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 border-bottom border-2 fw-semibold py-3 px-4 ${
                                    activeTab === 'payout'
                                        ? 'border-primary text-primary active'
                                        : 'border-transparent text-secondary'
                                }`}
                                onClick={() => setActiveTab('payout')}
                                type="button"
                            >
                                <i className="fas fa-wallet me-2"></i>Payout Details
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="card-body p-4">
                    {/* 1. PERSONAL INFO TAB */}
                    {activeTab === 'personal' && (
                        <form onSubmit={handlePersonalSubmit}>
                            <div className="d-flex align-items-center gap-4 mb-4 pb-3 border-bottom">
                                <div
                                    className="rounded-circle border border-2 border-primary shadow-sm overflow-hidden flex-shrink-0"
                                    style={{ width: '80px', height: '80px', minWidth: '80px', minHeight: '80px' }}
                                >
                                    <img
                                        src={avatarPreview || '/frontend/assets/images/dash_icon_8.png'}
                                        alt="Avatar"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/frontend/assets/images/dash_icon_8.png';
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="form-label fw-bold mb-1">Profile Photo</label>
                                    <input
                                        type="file"
                                        className={`form-control form-control-sm ${personalErrors.avatar ? 'is-invalid' : ''}`}
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                    />
                                    {personalErrors.avatar && (
                                        <div className="invalid-feedback">{personalErrors.avatar}</div>
                                    )}
                                    <div className="small text-muted mt-1">PNG, JPG or WEBP (Max 3MB)</div>
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label required">Full Name</label>
                                    <input
                                        type="text"
                                        className={`form-control ${personalErrors.name ? 'is-invalid' : ''}`}
                                        value={personalData.name}
                                        onChange={(e) =>
                                            setPersonalData((prev) => ({ ...prev, name: e.target.value }))
                                        }
                                    />
                                    {personalErrors.name && (
                                        <div className="invalid-feedback">{personalErrors.name}</div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label required">Email Address</label>
                                    <input
                                        type="email"
                                        className={`form-control ${personalErrors.email ? 'is-invalid' : ''}`}
                                        value={personalData.email}
                                        onChange={(e) =>
                                            setPersonalData((prev) => ({ ...prev, email: e.target.value }))
                                        }
                                    />
                                    {personalErrors.email && (
                                        <div className="invalid-feedback">{personalErrors.email}</div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Professional Headline</label>
                                    <input
                                        type="text"
                                        className={`form-control ${personalErrors.heading ? 'is-invalid' : ''}`}
                                        placeholder="e.g. Senior Fullstack Developer & Cloud Architect"
                                        value={personalData.heading}
                                        onChange={(e) =>
                                            setPersonalData((prev) => ({ ...prev, heading: e.target.value }))
                                        }
                                    />
                                    {personalErrors.heading && (
                                        <div className="invalid-feedback">{personalErrors.heading}</div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Gender</label>
                                    <select
                                        className="form-select"
                                        value={personalData.gender}
                                        onChange={(e) =>
                                            setPersonalData((prev) => ({ ...prev, gender: e.target.value }))
                                        }
                                    >
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Biography / About You</label>
                                    <textarea
                                        className={`form-control ${personalErrors.about ? 'is-invalid' : ''}`}
                                        rows="4"
                                        placeholder="Introduce your expertise, achievements, and teaching philosophy..."
                                        value={personalData.about}
                                        onChange={(e) =>
                                            setPersonalData((prev) => ({ ...prev, about: e.target.value }))
                                        }
                                    ></textarea>
                                    {personalErrors.about && (
                                        <div className="invalid-feedback">{personalErrors.about}</div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-top text-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary px-4"
                                    disabled={personalProcessing}
                                >
                                    {personalProcessing ? 'Saving Profile...' : 'Save Profile Information'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* 2. PASSWORD TAB */}
                    {activeTab === 'password' && (
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="row g-3" style={{ maxWidth: '600px' }}>
                                <div className="col-12">
                                    <label className="form-label required">Current Password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${passwordForm.errors.current_password ? 'is-invalid' : ''}`}
                                        value={passwordForm.data.current_password}
                                        onChange={(e) =>
                                            passwordForm.setData('current_password', e.target.value)
                                        }
                                    />
                                    {passwordForm.errors.current_password && (
                                        <div className="invalid-feedback">{passwordForm.errors.current_password}</div>
                                    )}
                                </div>

                                <div className="col-12">
                                    <label className="form-label required">New Password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${passwordForm.errors.password ? 'is-invalid' : ''}`}
                                        value={passwordForm.data.password}
                                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                                    />
                                    {passwordForm.errors.password && (
                                        <div className="invalid-feedback">{passwordForm.errors.password}</div>
                                    )}
                                </div>

                                <div className="col-12">
                                    <label className="form-label required">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${passwordForm.errors.password_confirmation ? 'is-invalid' : ''}`}
                                        value={passwordForm.data.password_confirmation}
                                        onChange={(e) =>
                                            passwordForm.setData('password_confirmation', e.target.value)
                                        }
                                    />
                                    {passwordForm.errors.password_confirmation && (
                                        <div className="invalid-feedback">{passwordForm.errors.password_confirmation}</div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-top text-start">
                                <button
                                    type="submit"
                                    className="btn btn-warning px-4"
                                    disabled={passwordForm.processing}
                                >
                                    {passwordForm.processing ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* 3. SOCIAL TAB */}
                    {activeTab === 'social' && (
                        <form onSubmit={handleSocialSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Facebook Profile URL</label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        placeholder="https://facebook.com/username"
                                        value={socialForm.data.facebook}
                                        onChange={(e) => socialForm.setData('facebook', e.target.value)}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">X / Twitter Profile URL</label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        placeholder="https://x.com/username"
                                        value={socialForm.data.x}
                                        onChange={(e) => socialForm.setData('x', e.target.value)}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">LinkedIn Profile URL</label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        placeholder="https://linkedin.com/in/username"
                                        value={socialForm.data.linkedin}
                                        onChange={(e) => socialForm.setData('linkedin', e.target.value)}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Personal Website / Portfolio</label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        placeholder="https://mywebsite.com"
                                        value={socialForm.data.website}
                                        onChange={(e) => socialForm.setData('website', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-top text-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary px-4"
                                    disabled={socialForm.processing}
                                >
                                    {socialForm.processing ? 'Saving...' : 'Save Social Links'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* 4. PAYOUT TAB */}
                    {activeTab === 'payout' && (
                        <form onSubmit={handlePayoutSubmit}>
                            <p className="text-secondary small mb-4">
                                Choose your preferred withdrawal method and provide accurate account numbers or emails to receive course payouts.
                            </p>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label required">Select Payout Gateway</label>
                                    <select
                                        className={`form-select ${payoutForm.errors.gateway ? 'is-invalid' : ''}`}
                                        value={payoutForm.data.gateway}
                                        onChange={(e) => payoutForm.setData('gateway', e.target.value)}
                                    >
                                        <option value="">-- Choose Gateway --</option>
                                        {gateways.map((gw) => (
                                            <option key={gw.id} value={gw.name}>
                                                {gw.name}
                                            </option>
                                        ))}
                                    </select>
                                    {payoutForm.errors.gateway && (
                                        <div className="invalid-feedback">{payoutForm.errors.gateway}</div>
                                    )}
                                </div>

                                <div className="col-12">
                                    <label className="form-label required">Account Information / Instructions</label>
                                    <textarea
                                        className={`form-control ${payoutForm.errors.information ? 'is-invalid' : ''}`}
                                        rows="5"
                                        placeholder="Bank Name: ...&#10;Account Number: ...&#10;Account Holder: ...&#10;Routing / SWIFT: ..."
                                        value={payoutForm.data.information}
                                        onChange={(e) => payoutForm.setData('information', e.target.value)}
                                    ></textarea>
                                    {payoutForm.errors.information && (
                                        <div className="invalid-feedback">{payoutForm.errors.information}</div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-top text-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary px-4"
                                    disabled={payoutForm.processing}
                                >
                                    {payoutForm.processing ? 'Saving...' : 'Save Payout Details'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </InstructorLayout>
    );
}
