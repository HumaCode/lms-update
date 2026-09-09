import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Admin/Layouts/AdminLayout';
import PageHeader from '@/Admin/Components/PageHeader';
import { route } from '@/Utils/routes';

export default function Index({ admin = {} }) {
    // Profile form
    const [profileData, setProfileData] = useState({
        name: admin.name || '',
        email: admin.email || '',
        bio: admin.bio || '',
        image: null,
    });
    const [profileErrors, setProfileErrors] = useState({});
    const [profileProcessing, setProfileProcessing] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(
        admin.image ? `/${admin.image}` : null
    );

    // Password form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileData((prev) => ({ ...prev, image: file }));
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        setProfileProcessing(true);
        router.post(route('admin.profile.update'), profileData, {
            forceFormData: true,
            onError: (errs) => {
                setProfileErrors(errs);
                setProfileProcessing(false);
            },
            onSuccess: () => {
                setProfileErrors({});
                setProfileProcessing(false);
            },
            onFinish: () => setProfileProcessing(false),
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.post(route('admin.password.update'), {
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <AdminLayout>
            <Head title="Admin Profile & Security" />

            <PageHeader
                title="Account Settings"
                breadcrumbs={[
                    { label: 'Dashboard', url: route('admin.dashboard') },
                    { label: 'Profile' },
                ]}
            />

            <div className="row g-4">
                {/* PROFILE INFORMATION */}
                <div className="col-md-6">
                    <div className="card h-100">
                        <div className="card-header">
                            <h3 className="card-title">Profile Information</h3>
                        </div>
                        <form onSubmit={handleProfileSubmit} encType="multipart/form-data">
                            <div className="card-body">
                                <div className="mb-4 d-flex align-items-center gap-3">
                                    <span
                                        className="avatar avatar-xl rounded-circle"
                                        style={{
                                            backgroundImage: avatarPreview ? `url(${avatarPreview})` : undefined,
                                            backgroundColor: '#f1f5f9',
                                        }}
                                    >
                                        {!avatarPreview && <i className="ti ti-user fs-1 text-muted"></i>}
                                    </span>
                                    <div>
                                        <label className="form-label mb-1">Change Avatar</label>
                                        <input
                                            type="file"
                                            className={`form-control form-control-sm ${profileErrors.image ? 'is-invalid' : ''}`}
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                        />
                                        {profileErrors.image && (
                                            <div className="invalid-feedback">{profileErrors.image}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label required">Full Name</label>
                                    <input
                                        type="text"
                                        className={`form-control ${profileErrors.name ? 'is-invalid' : ''}`}
                                        value={profileData.name}
                                        onChange={(e) =>
                                            setProfileData((prev) => ({ ...prev, name: e.target.value }))
                                        }
                                    />
                                    {profileErrors.name && (
                                        <div className="invalid-feedback">{profileErrors.name}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label required">Email Address</label>
                                    <input
                                        type="email"
                                        className={`form-control ${profileErrors.email ? 'is-invalid' : ''}`}
                                        value={profileData.email}
                                        onChange={(e) =>
                                            setProfileData((prev) => ({ ...prev, email: e.target.value }))
                                        }
                                    />
                                    {profileErrors.email && (
                                        <div className="invalid-feedback">{profileErrors.email}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Short Bio</label>
                                    <input
                                        type="text"
                                        maxLength="25"
                                        className={`form-control ${profileErrors.bio ? 'is-invalid' : ''}`}
                                        placeholder="Administrator / Superuser"
                                        value={profileData.bio}
                                        onChange={(e) =>
                                            setProfileData((prev) => ({ ...prev, bio: e.target.value }))
                                        }
                                    />
                                    {profileErrors.bio && (
                                        <div className="invalid-feedback">{profileErrors.bio}</div>
                                    )}
                                    <small className="form-hint">Max 25 characters.</small>
                                </div>
                            </div>

                            <div className="card-footer bg-transparent text-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={profileProcessing}
                                >
                                    {profileProcessing ? 'Saving...' : 'Save Profile'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* CHANGE PASSWORD */}
                <div className="col-md-6">
                    <div className="card h-100">
                        <div className="card-header">
                            <h3 className="card-title">Update Password</h3>
                        </div>
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="card-body">
                                <div className="mb-3">
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
                                        <div className="invalid-feedback">
                                            {passwordForm.errors.current_password}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label required">New Password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${passwordForm.errors.password ? 'is-invalid' : ''}`}
                                        value={passwordForm.data.password}
                                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                                    />
                                    {passwordForm.errors.password && (
                                        <div className="invalid-feedback">
                                            {passwordForm.errors.password}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
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
                                        <div className="invalid-feedback">
                                            {passwordForm.errors.password_confirmation}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="card-footer bg-transparent text-end">
                                <button
                                    type="submit"
                                    className="btn btn-warning"
                                    disabled={passwordForm.processing}
                                >
                                    {passwordForm.processing ? 'Updating...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
