import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { route } from '@/Utils/routes';

export default function Header() {
    const { auth } = usePage().props;
    const admin = auth?.admin;

    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('tablerTheme') || 'light';
        setTheme(savedTheme);
        document.body.setAttribute('data-bs-theme', savedTheme);
    }, []);

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('tablerTheme', newTheme);
        document.body.setAttribute('data-bs-theme', newTheme);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('admin.logout'));
    };

    return (
        <header className="navbar navbar-expand-md d-none d-lg-flex d-print-none">
            <div className="container-xl">
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbar-menu"
                    aria-controls="navbar-menu"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="navbar-nav flex-row order-md-last">
                    <div className="d-none d-md-flex ms-3 me-3 align-items-center">
                        {theme === 'light' ? (
                            <button
                                onClick={() => toggleTheme('dark')}
                                className="btn btn-icon btn-ghost-secondary"
                                title="Enable dark mode"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
                                </svg>
                            </button>
                        ) : (
                            <button
                                onClick={() => toggleTheme('light')}
                                className="btn btn-icon btn-ghost-secondary"
                                title="Enable light mode"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                                    <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
                                </svg>
                            </button>
                        )}
                    </div>

                    <div className="nav-item dropdown">
                        <a
                            href="#"
                            className="nav-link d-flex lh-1 text-reset p-0"
                            data-bs-toggle="dropdown"
                            aria-label="Open user menu"
                        >
                            <span
                                className="avatar avatar-sm"
                                style={{
                                    backgroundImage: `url(${admin?.image || '/default-files/avatar.png'})`,
                                }}
                            ></span>
                            <div className="d-none d-xl-block ps-2">
                                <div>{admin?.name || 'Administrator'}</div>
                                <div className="mt-1 small text-secondary">Super Admin</div>
                            </div>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                            <Link href={route('admin.profile.index')} className="dropdown-item">
                                <i className="ti ti-user me-2"></i> Profile
                            </Link>
                            <Link href={route('admin.settings.index')} className="dropdown-item">
                                <i className="ti ti-settings me-2"></i> Settings
                            </Link>
                            <div className="dropdown-divider"></div>
                            <button onClick={handleLogout} className="dropdown-item text-danger">
                                <i className="ti ti-logout me-2"></i> Logout
                            </button>
                        </div>
                    </div>
                </div>

                <div className="collapse navbar-collapse" id="navbar-menu"></div>
            </div>
        </header>
    );
}
