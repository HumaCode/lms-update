import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import StudentDashboardLayout from '../../../Layouts/StudentDashboardLayout';

export default function StudentProfile() {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [activeTab, setActiveTab] = useState('personal');

    // Personal Info form
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [headline, setHeadline] = useState(user?.headline || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [gender, setGender] = useState(user?.gender || 'male');
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user?.image ? `/${user.image}` : null);
    const [submittingPersonal, setSubmittingPersonal] = useState(false);

    // Password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [submittingPassword, setSubmittingPassword] = useState(false);

    // Social form
    const [facebook, setFacebook] = useState(user?.facebook || '');
    const [twitter, setTwitter] = useState(user?.twitter || '');
    const [linkedin, setLinkedin] = useState(user?.linkedin || '');
    const [website, setWebsite] = useState(user?.website || '');
    const [submittingSocial, setSubmittingSocial] = useState(false);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handlePersonalSubmit = (e) => {
        e.preventDefault();
        setSubmittingPersonal(true);
        const data = new FormData();
        data.append('name', name);
        data.append('email', email);
        data.append('headline', headline);
        data.append('bio', bio);
        data.append('gender', gender);
        if (avatar) data.append('avatar', avatar);

        router.post(route('student.profile.update'), data, {
            preserveScroll: true,
            onFinish: () => setSubmittingPersonal(false),
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setSubmittingPassword(true);
        router.post(
            route('student.profile.update-password'),
            {
                current_password: currentPassword,
                password,
                password_confirmation: passwordConfirmation,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setCurrentPassword('');
                    setPassword('');
                    setPasswordConfirmation('');
                },
                onFinish: () => setSubmittingPassword(false),
            }
        );
    };

    const handleSocialSubmit = (e) => {
        e.preventDefault();
        setSubmittingSocial(true);
        router.post(
            route('student.profile.update-social'),
            { facebook, twitter, linkedin, website },
            {
                preserveScroll: true,
                onFinish: () => setSubmittingSocial(false),
            }
        );
    };

    return (
        <StudentDashboardLayout title="My Profile" subtitle="Account Settings">
            <Head title="My Profile - Student Dashboard" />

            <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
                {/* Tabs */}
                <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'personal' ? 'active fw-bold' : ''}`}
                            onClick={() => setActiveTab('personal')}
                        >
                            Personal Information
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'password' ? 'active fw-bold' : ''}`}
                            onClick={() => setActiveTab('password')}
                        >
                            Security & Password
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'social' ? 'active fw-bold' : ''}`}
                            onClick={() => setActiveTab('social')}
                        >
                            Social Profiles
                        </button>
                    </li>
                </ul>

                {/* Tab 1: Personal Info */}
                {activeTab === 'personal' && (
                    <form onSubmit={handlePersonalSubmit}>
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <img
                                src={avatarPreview || '/default-files/avatar.png'}
                                alt="Avatar Preview"
                                className="rounded-circle shadow-sm border"
                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/default-files/avatar.png';
                                }}
                            />
                            <div>
                                <label className="form-label small fw-bold mb-1">Change Profile Photo</label>
                                <input
                                    type="file"
                                    className="form-control form-control-sm"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                />
                            </div>
                        </div>

                        <div className="row g-3">
                            <div className="col-sm-6">
                                <label className="form-label small fw-semibold">Full Name</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label small fw-semibold">Email Address</label>
                                <input
                                    type="email"
                                    className="form-control form-control-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label small fw-semibold">Headline</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="e.g. Computer Science Student"
                                    value={headline}
                                    onChange={(e) => setHeadline(e.target.value)}
                                />
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label small fw-semibold">Gender</label>
                                <select
                                    className="form-select form-select-sm"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="form-label small fw-semibold">Bio</label>
                                <textarea
                                    className="form-control form-control-sm"
                                    rows="3"
                                    placeholder="Tell us a little bit about your learning journey..."
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="col-12 mt-3">
                                <button className="btn btn-primary btn-sm px-4" type="submit" disabled={submittingPersonal}>
                                    {submittingPersonal ? 'Saving...' : 'Save Profile Changes'}
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* Tab 2: Password */}
                {activeTab === 'password' && (
                    <form onSubmit={handlePasswordSubmit} style={{ maxWidth: '450px' }}>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">Current Password</label>
                            <input
                                type="password"
                                className="form-control form-control-sm"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">New Password</label>
                            <input
                                type="password"
                                className="form-control form-control-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">Confirm New Password</label>
                            <input
                                type="password"
                                className="form-control form-control-sm"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <button className="btn btn-primary btn-sm px-4" type="submit" disabled={submittingPassword}>
                                {submittingPassword ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Tab 3: Social Links */}
                {activeTab === 'social' && (
                    <form onSubmit={handleSocialSubmit}>
                        <div className="row g-3">
                            <div className="col-sm-6">
                                <label className="form-label small fw-semibold"><i className="fab fa-facebook text-primary me-1"></i> Facebook URL</label>
                                <input
                                    type="url"
                                    className="form-control form-control-sm"
                                    value={facebook}
                                    onChange={(e) => setFacebook(e.target.value)}
                                    placeholder="https://facebook.com/username"
                                />
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label small fw-semibold"><i className="fab fa-twitter text-info me-1"></i> X / Twitter URL</label>
                                <input
                                    type="url"
                                    className="form-control form-control-sm"
                                    value={twitter}
                                    onChange={(e) => setTwitter(e.target.value)}
                                    placeholder="https://twitter.com/username"
                                />
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label small fw-semibold"><i className="fab fa-linkedin text-primary me-1"></i> LinkedIn URL</label>
                                <input
                                    type="url"
                                    className="form-control form-control-sm"
                                    value={linkedin}
                                    onChange={(e) => setLinkedin(e.target.value)}
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label small fw-semibold"><i className="fas fa-globe text-secondary me-1"></i> Website / Portfolio</label>
                                <input
                                    type="url"
                                    className="form-control form-control-sm"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    placeholder="https://mywebsite.com"
                                />
                            </div>
                            <div className="col-12 mt-3">
                                <button className="btn btn-primary btn-sm px-4" type="submit" disabled={submittingSocial}>
                                    {submittingSocial ? 'Saving...' : 'Save Social Links'}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </StudentDashboardLayout>
    );
}
