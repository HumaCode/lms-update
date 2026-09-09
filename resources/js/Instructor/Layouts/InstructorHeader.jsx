import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { route } from '@/Utils/routes';

export default function InstructorHeader() {
    const { auth, settings } = usePage().props;
    const user = auth?.user;

    return (
        <nav className="navbar navbar-expand-lg main_menu main_menu_3 bg-white shadow-sm py-2">
            <div className="container">
                <Link className="navbar-brand" href={route('instructor.dashboard')}>
                    {settings?.site_logo ? (
                        <img
                            src={`/${settings.site_logo}`}
                            alt={settings.site_name || 'LMS'}
                            className="img-fluid"
                            style={{ maxHeight: '42px' }}
                        />
                    ) : (
                        <span className="fw-bold fs-3 text-primary">{settings?.site_name || 'EduCore'}</span>
                    )}
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#instructorNavbar"
                    aria-controls="instructorNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="instructorNavbar">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                        <li className="nav-item">
                            <Link className="nav-link fw-semibold" href={route('home')}>
                                Public Site
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-semibold" href={route('courses.index')}>
                                Browse Courses
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active fw-semibold text-primary" href={route('instructor.dashboard')}>
                                Instructor Studio
                            </Link>
                        </li>
                    </ul>

                    <div className="d-flex align-items-center gap-3">
                        {user && (
                            <div className="d-flex align-items-center gap-2">
                                <img
                                    src={user.image ? `/${user.image}` : '/frontend/assets/images/dash_icon_8.png'}
                                    alt={user.name}
                                    className="rounded-circle"
                                    style={{ width: '38px', height: '38px', objectFit: 'cover' }}
                                />
                                <div>
                                    <div className="fw-bold small text-dark">{user.name}</div>
                                    <div className="badge bg-primary-subtle text-primary" style={{ fontSize: '0.7rem' }}>
                                        Instructor
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
